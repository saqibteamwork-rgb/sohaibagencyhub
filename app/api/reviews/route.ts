import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabaseAdmin';
import { verifyAdminRequest } from '@/src/lib/serverSecurity';
import { sanitizeString } from '@/src/lib/securitySanitizer';

import { DEFAULT_REVIEWS } from '@/src/data/defaultReviews';
export { DEFAULT_REVIEWS };

function cleanReviewEncoding(text: string): string {
  if (!text) return '';
  return text
    .replace(/â€”/g, '—')
    .replace(/â€“/g, '–')
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"');
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const auth = verifyAdminRequest(req);
    const showAll = auth.authorized && searchParams.get('all') === 'true';

    let query = supabaseAdmin
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    // Non-admin or storefront queries only receive approved reviews
    if (!showAll) {
      query = query.or('status.eq.approved,status.is.null');
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return NextResponse.json({ success: true, source: 'default_seed', reviews: DEFAULT_REVIEWS });
    }

    const sanitizedReviews = data.map((r) => ({
      ...r,
      status: r.status || 'approved',
      name: cleanReviewEncoding(r.name || ''),
      service: cleanReviewEncoding(r.service || ''),
      comment: cleanReviewEncoding(r.comment || ''),
    }));

    return NextResponse.json({ success: true, source: 'supabase', reviews: sanitizedReviews });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: true, source: 'fallback', reviews: [], warning: message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = sanitizeString(body.name || '').slice(0, 80);
    const service = sanitizeString(body.service || 'Digital Service').slice(0, 100);
    const comment = sanitizeString(body.comment || '').slice(0, 1000);
    const rating = Math.max(1, Math.min(5, Number(body.rating) || 5));

    if (!name || !comment) {
      return NextResponse.json(
        { success: false, error: 'Name and comment are required' },
        { status: 400 }
      );
    }

    const auth = verifyAdminRequest(req);
    // If submitted by authorized admin, allow direct approval; public users are always pending
    const status = auth.authorized ? (body.status || 'approved') : 'pending';
    const verified = auth.authorized ? (body.verified !== undefined ? Boolean(body.verified) : true) : false;

    const reviewId = `rev-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        id: reviewId,
        name,
        service,
        rating,
        comment,
        verified,
        status,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // In case status column doesn't exist yet in Supabase, fallback without status
      const fallbackInsert = await supabaseAdmin
        .from('reviews')
        .insert({
          id: reviewId,
          name,
          service,
          rating,
          comment,
          verified,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (fallbackInsert.error) {
        return NextResponse.json({ success: false, error: fallbackInsert.error.message }, { status: 500 });
      }
    }

    // Trigger Admin Notification for the review
    try {
      await supabaseAdmin.from('admin_notifications').insert({
        id: `notif-rev-${Date.now()}`,
        type: 'new_review',
        title: `⭐ New Review (${rating}★) - ${name}`,
        message: `${name} submitted a ${rating}-star review for "${service}": "${comment.slice(0, 80)}${comment.length > 80 ? '...' : ''}"`,
        reference_id: reviewId,
        data: { reviewId, name, service, rating, comment, status },
        is_read: false,
        created_at: new Date().toISOString()
      });
    } catch (notifErr) {
      console.warn('Failed to insert review admin notification:', notifErr);
    }

    const sanitized = {
      ...(data || {}),
      id: reviewId,
      name: cleanReviewEncoding(name),
      service: cleanReviewEncoding(service),
      comment: cleanReviewEncoding(comment),
      rating,
      verified,
      status,
      created_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      review: sanitized,
      pendingApproval: status === 'pending'
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    // Only verified admin can modify review moderation status
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Access Denied: Admin authorization required.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const id = sanitizeString(body.id || '');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Review ID required' }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (body.status !== undefined) {
      const cleanStatus = sanitizeString(body.status).toLowerCase();
      if (['pending', 'approved', 'rejected'].includes(cleanStatus)) {
        updates.status = cleanStatus;
        if (cleanStatus === 'approved') {
          updates.verified = true;
        }
      }
    }
    if (body.verified !== undefined) updates.verified = Boolean(body.verified);
    if (body.name) updates.name = sanitizeString(body.name).slice(0, 80);
    if (body.service) updates.service = sanitizeString(body.service).slice(0, 100);
    if (body.comment) updates.comment = sanitizeString(body.comment).slice(0, 1000);
    if (body.rating) updates.rating = Math.max(1, Math.min(5, Number(body.rating) || 5));

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const sanitized = {
      ...data,
      status: data.status || 'approved',
      name: cleanReviewEncoding(data.name || ''),
      service: cleanReviewEncoding(data.service || ''),
      comment: cleanReviewEncoding(data.comment || ''),
    };

    return NextResponse.json({ success: true, review: sanitized });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // Only verified admin can delete reviews
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Access Denied: Admin authorization required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = sanitizeString(searchParams.get('id') || '');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Review ID required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('reviews').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
