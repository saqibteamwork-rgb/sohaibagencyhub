import React, { useState, useEffect } from 'react';
import {
  FaStar,
  FaCheck,
  FaXmark,
  FaTrashCan,
  FaMagnifyingGlass,
  FaRotateRight,
  FaPlus,
  FaCommentDots,
  FaClock,
  FaShieldHalved
} from 'react-icons/fa6';

export interface ReviewItem {
  id: string;
  name: string;
  service: string;
  rating: number;
  comment: string;
  verified: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

interface AdminReviewModerationStudioProps {
  showToast?: (msg: string) => void;
  playPopSound?: (freq?: number) => void;
  onExit?: () => void;
}

export const AdminReviewModerationStudio: React.FC<AdminReviewModerationStudioProps> = ({
  showToast,
  playPopSound,
  onExit
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusTab, setStatusTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // New review modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newService, setNewService] = useState('CapCut Pro 1-Year');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  const fetchAdminReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/reviews?all=true');
      const data = await res.json();
      if (data && data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch {
      if (showToast) showToast('Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminReviews();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setActionLoadingId(id);
    if (playPopSound) playPopSound(newStatus === 'approved' ? 880 : 350);
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, verified: newStatus === 'approved' }),
      });
      const data = await res.json();
      if (data && data.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, status: newStatus, verified: newStatus === 'approved' } : r
          )
        );
        if (showToast) {
          showToast(
            newStatus === 'approved'
              ? 'Review Approved & Published live!'
              : 'Review Rejected.'
          );
        }
      } else {
        if (showToast) showToast(data.error || 'Failed to update review status');
      }
    } catch {
      if (showToast) showToast('Network error updating review');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    setActionLoadingId(id);
    if (playPopSound) playPopSound(300);
    try {
      const res = await fetch(`/api/reviews?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data && data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        if (showToast) showToast('Review permanently deleted.');
      } else {
        if (showToast) showToast(data.error || 'Failed to delete review');
      }
    } catch {
      if (showToast) showToast('Network error deleting review');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) {
      if (showToast) showToast('Please provide both name and comment.');
      return;
    }
    setIsSubmittingNew(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          service: newService.trim(),
          rating: newRating,
          comment: newComment.trim(),
          status: 'approved',
          verified: true
        }),
      });
      const data = await res.json();
      if (data && data.success && data.review) {
        setReviews((prev) => [data.review, ...prev]);
        setShowAddModal(false);
        setNewName('');
        setNewComment('');
        if (playPopSound) playPopSound(900);
        if (showToast) showToast('Official Review added and published!');
      } else {
        if (showToast) showToast(data.error || 'Failed to add review');
      }
    } catch {
      if (showToast) showToast('Network error adding review');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved' || !r.status).length;
  const rejectedCount = reviews.filter((r) => r.status === 'rejected').length;

  const filteredReviews = reviews.filter((r) => {
    const currentStatus = r.status || 'approved';
    const matchesTab = statusTab === 'all' ? true : currentStatus === statusTab;
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Studio Header */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
            <FaShieldHalved className="w-3.5 h-3.5" /> Moderation Center
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Customer Reviews &amp; Testimonials Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Control which client testimonials appear on the live storefront. Approve genuine feedback, discard spam.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (playPopSound) playPopSound(600);
              fetchAdminReviews();
            }}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow"
          >
            <FaRotateRight className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (playPopSound) playPopSound(750);
              setShowAddModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black shadow-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <FaPlus className="w-3.5 h-3.5" />
            <span>Add Official Review</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'pending' as const, label: 'Pending Approval', count: pendingCount, color: 'amber' },
            { id: 'approved' as const, label: 'Approved & Live', count: approvedCount, color: 'emerald' },
            { id: 'rejected' as const, label: 'Rejected / Spam', count: rejectedCount, color: 'rose' },
            { id: 'all' as const, label: 'All Reviews', count: reviews.length, color: 'slate' }
          ].map((tab) => {
            const isAct = statusTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (playPopSound) playPopSound(600);
                  setStatusTab(tab.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 border whitespace-nowrap ${
                  isAct
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                    : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isAct
                      ? 'bg-white text-indigo-700'
                      : tab.id === 'pending' && tab.count > 0
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or feedback..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {/* Reviews Grid */}
      {filteredReviews.length === 0 ? (
        <div className="rounded-3xl p-12 text-center bg-white/70 border border-dashed border-slate-300 space-y-3">
          <FaCommentDots className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-extrabold text-slate-700">No reviews found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {statusTab === 'pending'
              ? 'Great job! There are currently no pending reviews waiting for moderation.'
              : 'No reviews match your current filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((rev) => {
            const currentStatus = rev.status || 'approved';
            const isPending = currentStatus === 'pending';
            const isApproved = currentStatus === 'approved';
            const isRejected = currentStatus === 'rejected';

            return (
              <div
                key={rev.id}
                className={`rounded-2xl p-4 sm:p-5 bg-white border transition shadow-sm hover:shadow-md flex flex-col justify-between gap-4 ${
                  isPending
                    ? 'border-amber-400/80 ring-2 ring-amber-400/20'
                    : isRejected
                    ? 'border-rose-300/80 bg-rose-50/30'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Row: Author, Service & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{rev.name}</span>
                        {rev.verified && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Verified ✓
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{rev.service}</span>
                    </div>

                    <div>
                      {isPending && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <FaClock className="w-2.5 h-2.5" /> Pending
                        </span>
                      )}
                      {isApproved && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <FaCheck className="w-2.5 h-2.5" /> Live
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <FaXmark className="w-2.5 h-2.5" /> Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating ? 'text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-1.5">
                      {rev.rating}.0 / 5
                    </span>
                  </div>

                  {/* Comment */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Date & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Recent'}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Approve Button */}
                    {!isApproved && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(rev.id, 'approved')}
                        disabled={actionLoadingId === rev.id}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <FaCheck className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                    )}

                    {/* Reject Button */}
                    {!isRejected && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                        disabled={actionLoadingId === rev.id}
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold transition flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <FaXmark className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                    )}

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(rev.id)}
                      disabled={actionLoadingId === rev.id}
                      title="Permanently Delete Review"
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                    >
                      <FaTrashCan className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Official Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                ⭐ Add Official Review (Direct Publish)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <FaXmark className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Asad Malik"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Service / Tool Name
                </label>
                <input
                  type="text"
                  required
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="e.g. CapCut Pro 1-Year"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setNewRating(val)}
                      className={`p-2 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                        val <= newRating
                          ? 'bg-amber-50 border-amber-300 text-amber-500'
                          : 'bg-slate-50 border-slate-200 text-slate-300'
                      }`}
                    >
                      <FaStar className="w-4 h-4" />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600">{newRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Review Feedback / Comments
                </label>
                <textarea
                  rows={3}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Fast delivery, 100% genuine account received..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md transition"
                >
                  {isSubmittingNew ? 'Publishing...' : 'Publish Live'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
