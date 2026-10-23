import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabaseAdmin';
import { verifyAdminRequest } from '@/src/lib/serverSecurity';
import { sanitizeString } from '@/src/lib/securitySanitizer';

export interface AdminNotificationItem {
  id: string;
  type: 'new_review' | 'new_order' | 'payment_proof' | 'contact_inquiry' | 'system_alert';
  title: string;
  message: string;
  reference_id?: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

// In-memory fallback if database table is not yet migrated
let memoryNotifications: AdminNotificationItem[] = [
  {
    id: 'notif-welcome',
    type: 'system_alert',
    title: '🔔 Notification Center Active',
    message: 'Review approvals, store orders, and payment proofs will alert you here in real-time.',
    reference_id: 'system',
    is_read: false,
    created_at: new Date().toISOString()
  }
];

export async function GET(req: Request) {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Access Denied: Admin authorization required.' },
        { status: 401 }
      );
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && Array.isArray(data)) {
        const unreadCount = data.filter((n) => !n.is_read).length;
        return NextResponse.json({
          success: true,
          source: 'supabase',
          notifications: data,
          unreadCount
        });
      }
    } catch {
      // Supabase table might not exist yet; gracefully fallback
    }

    const unreadCount = memoryNotifications.filter((n) => !n.is_read).length;
    return NextResponse.json({
      success: true,
      source: 'memory_fallback',
      notifications: memoryNotifications,
      unreadCount
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Access Denied: Admin authorization required.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const id = sanitizeString(body.id || '');
    const markAll = Boolean(body.markAll);

    try {
      if (markAll) {
        await supabaseAdmin
          .from('admin_notifications')
          .update({ is_read: true })
          .eq('is_read', false);
      } else if (id) {
        await supabaseAdmin
          .from('admin_notifications')
          .update({ is_read: true })
          .eq('id', id);
      }
    } catch {
      // Table fallback
    }

    if (markAll) {
      memoryNotifications = memoryNotifications.map((n) => ({ ...n, is_read: true }));
    } else if (id) {
      memoryNotifications = memoryNotifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      );
    }

    return NextResponse.json({ success: true, updatedId: id, markAll });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Access Denied: Admin authorization required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = sanitizeString(searchParams.get('id') || '');
    const clearAll = searchParams.get('clearAll') === 'true';

    try {
      if (clearAll) {
        await supabaseAdmin.from('admin_notifications').delete().eq('is_read', true);
      } else if (id) {
        await supabaseAdmin.from('admin_notifications').delete().eq('id', id);
      }
    } catch {
      // Fallback
    }

    if (clearAll) {
      memoryNotifications = memoryNotifications.filter((n) => !n.is_read);
    } else if (id) {
      memoryNotifications = memoryNotifications.filter((n) => n.id !== id);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
