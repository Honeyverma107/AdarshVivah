import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Loader2, 
  Upload,
  FileText,
  X,
  Send,
  RefreshCw,
  File
} from 'lucide-react';
import Button from './Button';
import verificationApi from '../api/verificationApi';

const DOCUMENT_TYPES = [
  { id: 'AADHAAR', label: 'Aadhaar Card' },
  { id: 'PAN', label: 'PAN Card' },
  { id: 'PASSPORT', label: 'Passport' },
  { id: 'VOTER_ID', label: 'Voter ID' },
  { id: 'DRIVING_LICENCE', label: 'Driving Licence' }
];

export const IdentityVerificationCard = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  
  const [verification, setVerification] = useState({
    status: 'NOT_SUBMITTED',
    document_type: 'AADHAAR',
    document_url: null,
    document_name: '',
    rejection_reason: '',
    submitted_at: null,
    reviewed_at: null
  });

  const [documentType, setDocumentType] = useState('AADHAAR');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isResubmitting, setIsResubmitting] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await verificationApi.getStatus();
      setVerification(res.data);
      if (res.data?.verification_type || res.data?.document_type) {
        setDocumentType(res.data.verification_type || res.data.document_type);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Error fetching verification status:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileChange = (e) => {
    setErrorMsg('');
    const file = e.target.files[0];
    if (!file) return;

    // File type validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const ext = file.name.split('.').pop().toLowerCase();
    const validExts = ['jpg', 'jpeg', 'png', 'pdf'];

    if (!validTypes.includes(file.type) && !validExts.includes(ext)) {
      setErrorMsg('Unsupported file format. Please upload a JPG, JPEG, PNG, or PDF document.');
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    // File size validation (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds maximum limit of 10 MB.');
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!selectedFile) {
      setErrorMsg('Please select a valid document file (JPG, JPEG, PNG, or PDF) to upload.');
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('verification_type', documentType);
    formData.append('document_type', documentType);
    formData.append('document', selectedFile);

    try {
      const res = await verificationApi.submitDocument(formData);
      setVerification(res.data);
      setSelectedFile(null);
      setFilePreview(null);
      setIsResubmitting(false);
      setInfoMsg('Your identity document has been submitted and is awaiting manual review.');
    } catch (err) {
      console.error('Document submission error:', err);
      const msg = err.response?.data?.detail || 'Failed to submit identity document for verification.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

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

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-xs flex items-center justify-center text-xs text-muted-500 gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-maroon-600" />
        Loading identity verification status...
      </div>
    );
  }

  const status = verification?.status || 'NOT_SUBMITTED';

  return (
    <div className="bg-white rounded-3xl border border-rose-200 p-6 md:p-8 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 inline-block mb-1">
            Trust & Safety
          </span>
          <h3 className="font-serif font-bold text-xl text-dark-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-maroon-600" /> Identity Verification
          </h3>
          <p className="text-xs text-muted-500 mt-0.5">Verify your identity to build trust with other AdarshVivah members.</p>
        </div>

        {/* Status Badge */}
        <div>
          {status === 'VERIFIED' ? (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ✓ Identity Verified
            </span>
          ) : status === 'PENDING' ? (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-sky-50 text-sky-800 border border-sky-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-600 shrink-0 animate-spin" />
              Status: Pending Verification
            </span>
          ) : status === 'REJECTED' ? (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              Status: Rejected
            </span>
          ) : (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Status: Not Verified
            </span>
          )}
        </div>
      </div>

      {/* Error & Info Messages */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {infoMsg && (
        <div className="p-4 bg-sky-50 text-sky-800 border border-sky-200 rounded-2xl flex items-center gap-2 text-xs font-medium">
          <Clock className="w-4 h-4 text-sky-600 shrink-0" />
          <span>{infoMsg}</span>
        </div>
      )}

      {/* Content By Status */}

      {/* 1. VERIFIED STATE */}
      {status === 'VERIFIED' && (
        <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-base text-emerald-950">✓ Identity Verified</h4>
              <p className="text-emerald-800 leading-relaxed font-medium">
                Your identity document has been manually reviewed and approved by AdarshVivah administration.
              </p>
              {verification.verification_type_display && (
                <p className="text-xs font-semibold text-emerald-900 pt-1">
                  Verified Document: <span className="font-medium">{verification.verification_type_display}</span>
                </p>
              )}
              {verification.reviewed_at && (
                <p className="text-[11px] text-emerald-700 font-semibold pt-0.5">
                  Verified on: {formatDate(verification.reviewed_at)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. PENDING STATE */}
      {status === 'PENDING' && (
        <div className="p-6 rounded-2xl bg-sky-50/60 border border-sky-200/80 space-y-4">
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-sky-600 shrink-0 animate-spin mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-base text-sky-950">Status: Pending Verification</h4>
              <p className="text-sky-800 leading-relaxed font-medium">
                Your identity document has been submitted and is awaiting manual review.
              </p>
              <div className="pt-2 space-y-1">
                {verification.verification_type_display && (
                  <p className="text-xs font-semibold text-sky-900">
                    Submitted Document Type: <span className="font-medium text-dark-800">{verification.verification_type_display}</span>
                  </p>
                )}
                {verification.submitted_at && (
                  <p className="text-[11px] text-sky-700 font-semibold pt-0.5">
                    Submitted on: {formatDate(verification.submitted_at)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. REJECTED STATE */}
      {status === 'REJECTED' && !isResubmitting && (
        <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-base text-rose-950">Status: Rejected</h4>
              <p className="text-xs text-rose-900 font-semibold pt-0.5">
                Reason: <span className="font-normal">{verification.rejection_reason || 'Document image is unclear or invalid.'}</span>
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-rose-200/60">
            <Button
              type="button"
              variant="primary"
              size="md"
              icon={RefreshCw}
              onClick={() => setIsResubmitting(true)}
            >
              Resubmit for Verification
            </Button>
          </div>
        </div>
      )}

      {/* 4. NOT_SUBMITTED OR RESUBMITTING FORM */}
      {(status === 'NOT_SUBMITTED' || isResubmitting) && (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-cream-50/70 border border-rose-100 space-y-5">
          
          {/* Document Type Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-dark-800">
              Government ID Document Type *
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full max-w-md bg-white border border-rose-200 text-xs rounded-xl p-3 font-semibold text-dark-800 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
            >
              {DOCUMENT_TYPES.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.label}</option>
              ))}
            </select>
          </div>

          {/* Document File Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-dark-800">
              Government ID Proof *
            </label>
            
            {!selectedFile ? (
              <div className="border-2 border-dashed border-rose-200 rounded-2xl p-6 bg-white text-center space-y-3 max-w-md hover:border-maroon-600 transition-colors">
                <Upload className="w-8 h-8 text-maroon-600 mx-auto" />
                <div className="space-y-1">
                  <label htmlFor="id-doc-upload" className="cursor-pointer text-xs font-bold text-maroon-600 hover:underline inline-block">
                    [ Upload Document ]
                  </label>
                  <p className="text-[11px] text-muted-500">Allowed formats: JPG, JPEG, PNG, PDF (Max 10 MB)</p>
                </div>
                <input
                  id="id-doc-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="bg-white border border-rose-200 rounded-2xl p-4 max-w-md space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-dark-800 truncate">
                    {filePreview ? (
                      <img src={filePreview} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-rose-100" />
                    ) : (
                      <File className="w-8 h-8 text-maroon-600 shrink-0" />
                    )}
                    <div className="truncate">
                      <p className="truncate text-dark-800">{selectedFile.name}</p>
                      <p className="text-[10px] text-muted-400 font-normal">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 text-muted-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
                    title="Remove File"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-2 border-t border-rose-100 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> File ready for submission
                  </span>
                  <label htmlFor="id-doc-change" className="text-maroon-600 hover:underline cursor-pointer font-semibold">
                    Change File
                  </label>
                  <input
                    id="id-doc-change"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Accepted Documents List */}
          <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100 text-[11px] text-muted-500 max-w-md">
            <p className="font-bold text-dark-800 mb-1">Accepted documents:</p>
            <ul className="list-disc list-inside space-y-0.5 font-medium">
              <li>Aadhaar Card</li>
              <li>PAN Card</li>
              <li>Passport</li>
              <li>Voter ID</li>
              <li>Driving Licence</li>
            </ul>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Send}
              disabled={submitting || !selectedFile}
            >
              {submitting ? 'Submitting Request...' : 'Submit for Verification'}
            </Button>

            {isResubmitting && (
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => {
                  setIsResubmitting(false);
                  setSelectedFile(null);
                  setFilePreview(null);
                }}
              >
                Cancel
              </Button>
            )}
          </div>

        </form>
      )}

    </div>
  );
};

export default IdentityVerificationCard;
