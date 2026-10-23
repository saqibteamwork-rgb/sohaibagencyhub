import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabaseAdmin';
import { verifyAdminRequest } from '@/src/lib/serverSecurity';
import { sanitizeString } from '@/src/lib/securitySanitizer';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');

    const auth = verifyAdminRequest(req);

    let query = supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (orderId) {
      const cleanId = sanitizeString(orderId).replace(/^#/, '').trim();
      query = query.or(`id.eq.${cleanId},user_id.eq.${cleanId}`);
    } else if (!auth.authorized) {
      if (!userId) {
        return NextResponse.json({ success: true, source: 'protected', orders: [] });
      }
      query = query.eq('user_id', sanitizeString(userId));
    } else if (userId) {
      query = query.eq('user_id', sanitizeString(userId));
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: true, source: 'fallback', orders: [] });
    }

    const rawOrders = data || [];
    // If not authenticated admin and querying via public orderId lookup, strip sensitive details
    const orders = rawOrders.map((o) => {
      if (auth.authorized) return o;
      return {
        id: o.id,
        user_id: o.user_id ? `${o.user_id.slice(0, 3)}***` : 'Client',
        service_id: o.service_id,
        service_title: o.service_title,
        package_tier: o.package_tier,
        price: o.price,
        status: o.status,
        created_at: o.created_at,
      };
    });

    return NextResponse.json({
      success: true,
      source: 'supabase',
      orders,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: true, source: 'fallback', orders: [], warning: message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId = sanitizeString(body.userId);
    const serviceId = sanitizeString(body.serviceId || 'srv-custom');
    const serviceTitle = sanitizeString(body.serviceTitle);
    const packageTier = sanitizeString(body.packageTier);
    const userInput = sanitizeString(body.userInput || '');
    const price = Math.max(0, Math.min(10000000, Number(body.price) || 0));

    if (!userId || !serviceTitle || !packageTier) {
      return NextResponse.json(
        { success: false, error: 'userId, serviceTitle and packageTier are required' },
        { status: 400 }
      );
    }

    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        id: orderId,
        user_id: userId,
        service_id: serviceId,
        service_title: serviceTitle,
        package_tier: packageTier,
        price,
        user_input: userInput,
        status: 'pending', // Strictly enforced server-side
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Trigger Admin Notification for New Order
    try {
      await supabaseAdmin.from('admin_notifications').insert({
        id: `notif-ord-${Date.now()}`,
        type: 'new_order',
        title: `🛍️ New Order: ${serviceTitle}`,
        message: `Client ${userId} placed an order for ${packageTier} tier ($${price}). Order ID: #${orderId}`,
        reference_id: orderId,
        data: { orderId, userId, serviceId, serviceTitle, packageTier, price },
        is_read: false,
        created_at: new Date().toISOString()
      });
    } catch (notifErr) {
      console.warn('Failed to insert order admin notification:', notifErr);
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    // Only verified admin can update order status
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Access Denied: Admin authorization required to update orders.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const orderId = sanitizeString(body.orderId);
    const status = sanitizeString(body.status);

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'orderId and status are required' },
        { status: 400 }
      );
    }

    const allowedStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Invalid order status value.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status: status.toLowerCase() })
      .eq('id', orderId)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data || { id: orderId, status } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
