import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  FileText, 
  Loader2, 
  AlertCircle, 
  Search,
  X,
  File
} from 'lucide-react';
import verificationApi from '../../api/verificationApi';

export const ProfileVerification = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Rejection Modal State
  const [rejectingItem, setRejectingItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Document image is unclear.');
  const [submittingAction, setSubmittingAction] = useState(false);

  // Document Viewer Modal State
  const [viewingDocUrl, setViewingDocUrl] = useState(null);
  const [viewingDocName, setViewingDocName] = useState('');

  const fetchVerifications = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await verificationApi.getAdminVerifications();
      setVerifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching admin verifications:', err);
      if (err.response?.status === 403) {
        setErrorMsg('Access Forbidden: Admin permissions required.');
      } else {
        setErrorMsg('Failed to load identity verification requests.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleApprove = async (id) => {
    setSubmittingAction(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await verificationApi.approveVerification(id);
      setSuccessMsg('Identity verification approved successfully!');
      await fetchVerifications();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Approval error:', err);
      setErrorMsg('Failed to approve verification.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleConfirmReject = async (e) => {
    if (e) e.preventDefault();
    if (!rejectingItem) return;

    if (!rejectionReason.trim()) {
      setErrorMsg('A rejection reason must be provided.');
      return;
    }

    setSubmittingAction(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await verificationApi.rejectVerification(rejectingItem.id, rejectionReason);
      setSuccessMsg('Identity verification rejected.');
      setRejectingItem(null);
      await fetchVerifications();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Rejection error:', err);
      setErrorMsg('Failed to reject verification.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const filtered = verifications.filter((item) =>
    (item.user_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.user_email || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.verification_type_display || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.status || '').toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      return new Date(isoString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <div>
          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-gold-400" /> Manual Identity Verification Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review user-submitted government ID documents and approve or reject verification requests.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user or document..."
            className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-950/80 text-rose-200 border border-rose-800 rounded-2xl flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-950/80 text-emerald-200 border border-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Verification Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
            <span>Loading pending verifications...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 italic">
            No identity verification requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">User & Account</th>
                  <th className="p-3">Document Type</th>
                  <th className="p-3">Uploaded Document</th>
                  <th className="p-3">Submitted Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-700/30">
                    <td className="p-3">
                      <p className="font-bold text-white">{item.user_name || 'Member User'}</p>
                      <p className="text-[10px] text-slate-400">{item.user_email}</p>
                    </td>

                    <td className="p-3">
                      <span className="font-medium text-slate-200 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700 text-[11px]">
                        {item.verification_type_display || item.verification_type || 'Government ID'}
                      </span>
                    </td>

                    <td className="p-3">
                      {item.document_url ? (
                        <button
                          type="button"
                          onClick={() => {
                            setViewingDocUrl(item.document_url);
                            setViewingDocName(item.document_name || item.verification_type_display);
                          }}
                          className="inline-flex items-center gap-1.5 text-gold-400 hover:text-gold-300 font-semibold text-xs hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Document</span>
                        </button>
                      ) : (
                        <span className="text-slate-500 italic">No document file</span>
                      )}
                    </td>

                    <td className="p-3 text-slate-300">
                      {formatDate(item.submitted_at || item.created_at)}
                    </td>

                    <td className="p-3">
                      {item.status === 'VERIFIED' ? (
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          ✓ Verified
                        </span>
                      ) : item.status === 'PENDING' ? (
                        <span className="bg-amber-950 text-amber-400 border border-amber-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          Pending Review
                        </span>
                      ) : (
                        <span className="bg-rose-950 text-rose-400 border border-rose-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          Rejected
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right space-x-2">
                      {item.status !== 'VERIFIED' && (
                        <button
                          type="button"
                          disabled={submittingAction}
                          onClick={() => handleApprove(item.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition-colors"
                        >
                          Approve
                        </button>
                      )}

                      {item.status !== 'REJECTED' && (
                        <button
                          type="button"
                          disabled={submittingAction}
                          onClick={() => {
                            setRejectingItem(item);
                            setRejectionReason('Document image is unclear.');
                          }}
                          className="px-3 py-1 bg-rose-700 hover:bg-rose-600 text-white rounded-lg font-semibold text-xs transition-colors"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Rejection Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl max-w-md w-full p-6 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-serif font-bold text-base flex items-center gap-2 text-rose-400">
                <XCircle className="w-5 h-5" /> Reject Identity Verification
              </h4>
              <button onClick={() => setRejectingItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Rejection Reason (Visible to {rejectingItem.user_name}) *
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-3 text-white focus:outline-none mb-2"
                >
                  <option value="Document image is unclear.">Document image is unclear</option>
                  <option value="Document information does not match profile.">Document information does not match profile</option>
                  <option value="Expired or invalid document uploaded.">Expired or invalid document uploaded</option>
                  <option value="Incomplete or cropped document upload.">Incomplete or cropped document upload</option>
                </select>

                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter detailed rejection reason..."
                  className="w-full bg-slate-800 border border-slate-700 text-xs rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAction || !rejectionReason.trim()}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs rounded-xl font-semibold"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Preview Viewer Modal */}
      {viewingDocUrl && (
        <div className="fixed inset-0 z-50 bg-dark-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden text-white">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-gold-400 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Uploaded Document Preview ({viewingDocName})
              </h4>
              <button onClick={() => setViewingDocUrl(null)} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-auto flex items-center justify-center bg-slate-950">
              {viewingDocUrl.toLowerCase().split('?')[0].endsWith('.pdf') ? (
                <iframe
                  src={viewingDocUrl}
                  title="Uploaded Document PDF preview"
                  className="w-full h-[500px] rounded-xl border border-slate-800"
                />
              ) : (
                <img
                  src={viewingDocUrl}
                  alt="Identity Document Preview"
                  className="max-w-full max-h-[500px] object-contain rounded-xl border border-slate-800"
                />
              )}
            </div>

            <div className="p-4 bg-slate-800 border-t border-slate-700 flex items-center justify-between">
              <a
                href={viewingDocUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold-400 hover:underline font-semibold flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Open in Full Window
              </a>
              <button
                type="button"
                onClick={() => setViewingDocUrl(null)}
                className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded-xl"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileVerification;
