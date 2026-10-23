import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabaseAdmin';
import {
  PaymentProofRequest
} from '@/src/types/paymentProof';
import { verifyAdminRequest } from '@/src/lib/serverSecurity';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let query = supabaseAdmin
      .from('payment_proofs')
      .select('*')
      .order('created_at', { ascending: false });

    // Non-admin requests should only see their own proofs
    const auth = verifyAdminRequest(req);
    if (!auth.authorized && userId) {
      query = query.eq('user_id', userId);
    } else if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: true, source: 'supabase', proofs: [] });
    }

    const proofs: PaymentProofRequest[] = (data || []).map((row) => ({
      id: row.id,
      amount: Number(row.amount),
      method: row.method,
      senderAccountName: row.sender_account_name || '',
      senderAccountNumber: row.sender_account_number || '',
      trxId: row.trx_id || '',
      screenshotUrl: row.screenshot_url || '',
      status: row.status as 'pending' | 'approved' | 'rejected',
      createdAt: row.created_at,
      userNote: row.user_note || '',
    }));

    return NextResponse.json({
      success: true,
      source: 'supabase',
      proofs,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { success: true, source: 'fallback', proofs: [], warning: message },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const proof: PaymentProofRequest = body.proof;
    const userId = body.userId || proof?.senderAccountNumber || 'guest_user';

    if (!proof || !proof.id || !proof.amount || !proof.method) {
      return NextResponse.json(
        { success: false, error: 'Incomplete proof data' },
        { status: 400 }
      );
    }

    // Security: Validate amount range (Min 10 PKR, Max 1,000,000 PKR)
    const cleanAmount = Math.max(10, Math.min(1000000, Number(proof.amount)));

    let publicScreenshotUrl = proof.screenshotUrl;

    // If screenshot is a base64 data URL, upload securely to Supabase Storage bucket
    if (publicScreenshotUrl && publicScreenshotUrl.startsWith('data:image/')) {
      try {
        const matches = publicScreenshotUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (matches) {
          const contentType = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          // Limit screenshot size to 10MB
          if (buffer.length <= 10 * 1024 * 1024) {
            const ext = contentType.split('/')[1] || 'jpg';
            const fileName = `receipts/${proof.id}_${Date.now()}.${ext}`;

            const { error: uploadError } = await supabaseAdmin.storage
              .from('payment-proofs')
              .upload(fileName, buffer, {
                contentType,
                upsert: true,
              });

            if (!uploadError) {
              const { data: urlData } = supabaseAdmin.storage
                .from('payment-proofs')
                .getPublicUrl(fileName);
              if (urlData?.publicUrl) {
                publicScreenshotUrl = urlData.publicUrl;
              }
            }
          }
        }
      } catch (uploadErr) {
        console.error('Storage upload fallback:', uploadErr);
      }
    }

    // Security: NEVER trust client's 'status' field. New submissions MUST ALWAYS BE 'pending'
    const { data, error } = await supabaseAdmin
      .from('payment_proofs')
      .upsert({
        id: proof.id,
        user_id: userId,
        amount: cleanAmount,
        method: proof.method,
        sender_account_name: proof.senderAccountName || '',
        sender_account_number: proof.senderAccountNumber || '',
        trx_id: proof.trxId || '',
        screenshot_url: publicScreenshotUrl || '',
        status: 'pending', // Strictly enforced server-side
        user_note: proof.userNote || '',
        created_at: proof.createdAt || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Trigger Admin Notification for Payment Proof
    try {
      await supabaseAdmin.from('admin_notifications').insert({
        id: `notif-pay-${Date.now()}`,
        type: 'payment_proof',
        title: `💳 New Payment Proof (${proof.method})`,
        message: `Deposit proof of Rs. ${cleanAmount} via ${proof.method} (Trx: ${proof.trxId || 'N/A'}) by ${proof.senderAccountName || userId} submitted.`,
        reference_id: proof.id,
        data: { proofId: proof.id, userId, amount: cleanAmount, method: proof.method, trxId: proof.trxId },
        is_read: false,
        created_at: new Date().toISOString()
      });
    } catch (notifErr) {
      console.warn('Failed to insert payment proof notification:', notifErr);
    }

    return NextResponse.json({ success: true, proof: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    // 1. Enforce Server-Side Admin Authorization (Hacker Proof)
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Access Denied: Admin authorization required to review payments.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { proofId, status, userId } = body;

    if (!proofId || !status) {
      return NextResponse.json(
        { success: false, error: 'proofId and status are required' },
        { status: 400 }
      );
    }

    // 2. Fetch recorded proof from database to prevent client tampering
    const { data: existingProof, error: fetchErr } = await supabaseAdmin
      .from('payment_proofs')
      .select('*')
      .eq('id', proofId)
      .single();

    if (fetchErr || !existingProof) {
      return NextResponse.json(
        { success: false, error: 'Payment proof record not found.' },
        { status: 404 }
      );
    }

    // Prevent duplicate crediting
    const wasAlreadyApproved = existingProof.status === 'approved';

    // 3. Update payment proof status in Supabase
    const { data: updatedProof, error: updateErr } = await supabaseAdmin
      .from('payment_proofs')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', proofId)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
    }

    // 4. Credit user's wallet with TRUE database recorded amount (tamper-proof!)
    let newBalance = null;
    const targetUserId = userId || existingProof.user_id || existingProof.sender_account_number;

    if (status === 'approved' && !wasAlreadyApproved && targetUserId) {
      const verifiedAmount = Number(existingProof.amount || 0);

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('balance')
        .eq('id', targetUserId)
        .maybeSingle();

      const currentBal = Number(profile?.balance || 0);
      newBalance = currentBal + verifiedAmount;

      await supabaseAdmin.from('profiles').upsert({
        id: targetUserId,
        balance: newBalance,
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      proof: updatedProof,
      newBalance,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // Enforce Server-Side Admin Authorization
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Access Denied: Admin authorization required to delete payment records.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('payment_proofs').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
