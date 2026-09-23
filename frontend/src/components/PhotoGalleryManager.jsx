import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Trash2, 
  Star, 
  RefreshCw, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Image as ImageIcon 
} from 'lucide-react';
import Button from './Button';
import profileApi from '../api/profileApi';

export const PhotoGalleryManager = ({ photos: initialPhotos = [], onPhotosChange, title = 'Photos & Gallery' }) => {
  const [photosList, setPhotosList] = useState(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [replacingId, setReplacingId] = useState(null);

  // Live Camera Capture state
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImageBlob, setCapturedImageBlob] = useState(null);
  const [capturedImagePreview, setCapturedImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const videoRef = useRef(null);

  // Synchronize initialPhotos when passed from parent
  useEffect(() => {
    if (initialPhotos && initialPhotos.length > 0) {
      setPhotosList(initialPhotos);
    } else {
      fetchPhotos();
    }
  }, [initialPhotos]);

  const fetchPhotos = async () => {
    try {
      const res = await profileApi.getPhotos();
      if (res.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setPhotosList(list);
        notifyParent(list);
      }
    } catch (err) {
      console.error('Failed to fetch photos:', err);
    }
  };

  const notifyParent = (list) => {
    if (onPhotosChange) {
      const primaryPhoto = list.find(p => p.is_primary);
      const primaryUrl = primaryPhoto?.url || list[0]?.url || '';
      onPhotosChange(list, primaryUrl);
    }
  };

  // Validate File (Type and Max Size 5MB)
  const validateFile = (file) => {
    if (!file) return 'No file selected.';
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return 'Unsupported file format. Please upload JPG, PNG, or WebP images.';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'File size exceeds maximum limit of 5 MB.';
    }
    return null;
  };

  // Upload a new photo file
  const handleUploadFile = async (file, isPrimary = false) => {
    const error = validateFile(file);
    if (error) {
      setErrorMsg(error);
      return;
    }

    setUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (isPrimary) {
        formData.append('is_primary', 'true');
      }

      const res = await profileApi.uploadPhoto(formData);
      if (res.data) {
        // Refetch full list to ensure accurate sync
        await fetchPhotos();
      }
    } catch (err) {
      console.error('Photo upload failed:', err);
      setErrorMsg(err.response?.data?.detail || 'Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Replace an existing photo
  const handleReplaceFile = async (file) => {
    if (!replacingId) return;
    const error = validateFile(file);
    if (error) {
      setErrorMsg(error);
      return;
    }

    setUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      await profileApi.replacePhoto(replacingId, formData);
      await fetchPhotos();
    } catch (err) {
      console.error('Photo replacement failed:', err);
      setErrorMsg(err.response?.data?.detail || 'Failed to replace photo.');
    } finally {
      setUploading(false);
      setReplacingId(null);
    }
  };

  // Set photo as primary
  const handleSetPrimary = async (photoId) => {
    setErrorMsg('');
    try {
      await profileApi.setPrimaryPhoto(photoId);
      await fetchPhotos();
    } catch (err) {
      console.error('Failed to set primary photo:', err);
      setErrorMsg('Failed to set primary photo.');
    }
  };

  // Delete a photo
  const handleDeletePhoto = async (photoId) => {
    setErrorMsg('');
    try {
      await profileApi.deletePhoto(photoId);
      await fetchPhotos();
    } catch (err) {
      console.error('Failed to delete photo:', err);
      setErrorMsg('Failed to delete photo.');
    }
  };

  // WebRTC Camera Logic
  const startCamera = async () => {
    setErrorMsg('');
    setCapturedImageBlob(null);
    setCapturedImagePreview(null);
    setShowCameraModal(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported by browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setCameraStream(stream);
    } catch (err) {
      console.warn('Direct camera stream failed, falling back to camera input:', err);
      setShowCameraModal(false);
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      } else {
        setErrorMsg('Unable to access device camera.');
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
    setCapturedImagePreview(null);
    setCapturedImageBlob(null);
  };

  useEffect(() => {
    if (showCameraModal && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [showCameraModal, cameraStream]);

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');

    // Flip horizontally for front-facing selfie feel
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        setCapturedImageBlob(blob);
        setCapturedImagePreview(URL.createObjectURL(blob));
      }
    }, 'image/jpeg', 0.9);
  };

  const confirmCapturedPhoto = async () => {
    if (!capturedImageBlob) return;
    const capturedFile = new File([capturedImageBlob], `photo_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
    stopCamera();
    await handleUploadFile(capturedFile);
  };

  return (
    <div className="space-y-6">
      {/* Hidden inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleUploadFile(e.target.files[0]);
            e.target.value = '';
          }
        }}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleUploadFile(e.target.files[0]);
            e.target.value = '';
          }
        }}
      />
      <input
        type="file"
        ref={replaceInputRef}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleReplaceFile(e.target.files[0]);
            e.target.value = '';
          }
        }}
      />

      {/* Header & Main Upload / Take Photo Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-dark-800 flex items-center gap-2">
            <Camera className="w-5 h-5 text-maroon-600" /> {title}
          </h3>
          <p className="text-xs text-muted-500 mt-1">
            Upload clear photos or take a picture using your camera. First photo will be set as Primary.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            type="button"
            variant="primary"
            size="sm"
            icon={Upload}
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={Camera}
            disabled={uploading}
            onClick={startCamera}
          >
            Take Photo
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Photos Grid */}
      {photosList && photosList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photosList.map((photo) => (
            <div
              key={photo.id}
              className={`group relative rounded-2xl overflow-hidden border transition-all bg-cream-50 flex flex-col ${
                photo.is_primary ? 'border-2 border-gold-500 shadow-md' : 'border-rose-200 shadow-xs hover:border-maroon-300'
              }`}
            >
              <div className="w-full aspect-square overflow-hidden relative bg-rose-100/50 flex items-center justify-center">
                <img
                  src={photo.url}
                  alt="Profile gallery"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {photo.is_primary && (
                  <span className="absolute top-2 left-2 bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> PRIMARY
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-2.5 bg-white border-t border-rose-100 flex flex-col gap-1.5">
                {!photo.is_primary ? (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(photo.id)}
                    className="w-full text-center text-xs font-bold text-maroon-700 bg-rose-50 hover:bg-rose-100 py-1 px-2 rounded-lg transition-colors"
                  >
                    Set as Primary
                  </button>
                ) : (
                  <div className="w-full text-center text-xs font-bold text-emerald-700 bg-emerald-50 py-1 px-2 rounded-lg">
                    Primary Profile Photo
                  </div>
                )}

                <div className="flex items-center justify-between gap-1 pt-1 border-t border-rose-50">
                  <button
                    type="button"
                    onClick={() => {
                      setReplacingId(photo.id);
                      replaceInputRef.current?.click();
                    }}
                    className="text-[11px] font-semibold text-muted-600 hover:text-dark-800 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Replace
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-cream-50/50 rounded-3xl border-2 border-dashed border-rose-200 text-center p-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-maroon-600 flex items-center justify-center">
            <ImageIcon className="w-7 h-7" />
          </div>
          <p className="text-xs font-bold text-dark-800">No profile photos uploaded yet</p>
          <p className="text-xs text-muted-500 max-w-sm">
            Click <strong>Upload Photo</strong> to choose images from your device, or <strong>Take Photo</strong> to capture a photo.
          </p>
        </div>
      )}

      {/* WebRTC Live Camera Capture Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 bg-dark-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-rose-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 bg-cream-50 border-b border-rose-100 flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-dark-800 flex items-center gap-2">
                <Camera className="w-4 h-4 text-maroon-600" /> Take Profile Photo
              </h4>
              <button
                type="button"
                onClick={stopCamera}
                className="p-1 rounded-full text-muted-400 hover:text-dark-800 hover:bg-rose-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 flex flex-col items-center">
              <div className="w-full aspect-4/3 bg-dark-900 rounded-2xl overflow-hidden relative border-2 border-maroon-200 shadow-inner flex items-center justify-center">
                {!capturedImagePreview ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <img
                    src={capturedImagePreview}
                    alt="Captured snapshot preview"
                    className="w-full h-full object-cover"
                  />
                )}

                {!cameraStream && !capturedImagePreview && (
                  <div className="text-white text-xs flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                    Connecting to camera...
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-3 w-full pt-1">
                {!capturedImagePreview ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    icon={Camera}
                    disabled={!cameraStream}
                    onClick={captureSnapshot}
                    className="w-full"
                  >
                    Capture Photo
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      icon={RefreshCw}
                      onClick={() => {
                        setCapturedImagePreview(null);
                        setCapturedImageBlob(null);
                      }}
                      className="flex-1"
                    >
                      Retake
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={confirmCapturedPhoto}
                      className="flex-1"
                    >
                      Use Photo
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGalleryManager;
