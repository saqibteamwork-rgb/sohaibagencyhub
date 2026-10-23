import React, { useState, useEffect, useRef } from 'react';
import {
  FaBell,
  FaCheckDouble,
  FaStar,
  FaBagShopping,
  FaCreditCard,
  FaCircleInfo,
  FaXmark,
  FaRotateRight
} from 'react-icons/fa6';
import { AdminSettingsScreenId } from './AdminStepByStepSettingsHub';

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

interface AdminNotificationBellProps {
  onNavigateScreen?: (screen: AdminSettingsScreenId) => void;
  playPopSound?: (freq?: number) => void;
  showToast?: (msg: string) => void;
}

export const AdminNotificationBell: React.FC<AdminNotificationBellProps> = ({
  onNavigateScreen,
  playPopSound,
  showToast
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const previousUnreadRef = useRef<number>(0);

  const fetchNotifications = async (isManual = false) => {
    try {
      if (isManual) setIsLoading(true);
      const res = await fetch('/api/admin/notifications');
      const data = await res.json();
      if (data && data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        const count = typeof data.unreadCount === 'number' ? data.unreadCount : 0;
        
        // Play alert chime if new notifications arrived
        if (count > previousUnreadRef.current && previousUnreadRef.current > 0) {
          if (playPopSound) playPopSound(880);
          if (showToast) showToast('🔔 New Admin Notification received!');
        }
        previousUnreadRef.current = count;
        setUnreadCount(count);
      }
    } catch {
      // Ignore background poll errors
    } finally {
      if (isManual) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 25 seconds for real-time updates
    const interval = setInterval(() => {
      fetchNotifications();
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      if (playPopSound) playPopSound(600);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      previousUnreadRef.current = 0;

      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      if (showToast) showToast('All notifications marked as read.');
    } catch {
      // Fallback
    }
  };

  const handleNotificationClick = async (notif: AdminNotificationItem) => {
    if (playPopSound) playPopSound(720);
    
    // Mark single as read
    if (!notif.is_read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      try {
        fetch('/api/admin/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: notif.id }),
        });
      } catch {}
    }

    setIsOpen(false);

    // Jump to relevant screen
    if (onNavigateScreen) {
      if (notif.type === 'new_review') {
        onNavigateScreen('reviews');
      } else if (notif.type === 'payment_proof') {
        onNavigateScreen('payments');
      } else if (notif.type === 'new_order') {
        onNavigateScreen('dashboard');
      }
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    } catch {
      return '';
    }
  };

  const getIconAndStyle = (type: string) => {
    switch (type) {
      case 'new_review':
        return {
          icon: <FaStar className="w-3.5 h-3.5 text-amber-300" />,
          bg: 'bg-amber-500/20 border-amber-500/40 text-amber-200',
          badge: 'Review'
        };
      case 'new_order':
        return {
          icon: <FaBagShopping className="w-3.5 h-3.5 text-emerald-300" />,
          bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200',
          badge: 'Order'
        };
      case 'payment_proof':
        return {
          icon: <FaCreditCard className="w-3.5 h-3.5 text-sky-300" />,
          bg: 'bg-sky-500/20 border-sky-500/40 text-sky-200',
          badge: 'Payment'
        };
      default:
        return {
          icon: <FaCircleInfo className="w-3.5 h-3.5 text-purple-300" />,
          bg: 'bg-purple-500/20 border-purple-500/40 text-purple-200',
          badge: 'System'
        };
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => {
          if (playPopSound) playPopSound(isOpen ? 440 : 660);
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        title="Admin Notifications Center"
        className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white cursor-pointer transition flex items-center justify-center shadow-md"
      >
        <FaBell className={`w-4 h-4 ${unreadCount > 0 ? 'text-amber-300 animate-bounce' : 'text-slate-200'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-600 text-white text-[10px] font-black shadow-lg border border-rose-300 ring-2 ring-rose-500/50 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl z-50 overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaBell className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-black tracking-wide uppercase text-slate-200">
                Admin Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => fetchNotifications(true)}
                disabled={isLoading}
                title="Refresh notifications"
                className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
              >
                <FaRotateRight className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
              >
                <FaXmark className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Row */}
          {unreadCount > 0 && (
            <div className="px-3.5 py-1.5 bg-slate-950/40 border-b border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition"
              >
                <FaCheckDouble className="w-3 h-3" />
                <span>Mark all as read</span>
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 overscroll-contain">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <FaBell className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-semibold">No notifications yet</p>
                <p className="text-[10px] text-slate-500">
                  New orders, reviews, and deposit proofs will appear here.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const style = getIconAndStyle(item.type);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3.5 hover:bg-slate-800/60 cursor-pointer transition flex items-start gap-3 ${
                      !item.is_read ? 'bg-indigo-950/20' : 'opacity-80'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl border flex-shrink-0 flex items-center justify-center ${style.bg}`}
                    >
                      {style.icon}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-200 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 flex-shrink-0">
                          {formatRelativeTime(item.created_at)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                        {item.message}
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {style.badge}
                        </span>
                        {!item.is_read && (
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        )}
                        <span className="text-[10px] text-sky-400 font-bold hover:underline">
                          View details →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-950/60 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-400">
              Live updates active • Click any item to jump
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
