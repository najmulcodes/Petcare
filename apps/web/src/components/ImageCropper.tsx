import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { getCroppedFile } from "../lib/cropImage";

interface ImageCropperProps {
  imageSrc: string;
  onDone: (file: File) => void;
  onCancel: () => void;
  aspect?: number;
}

export function ImageCropper({ imageSrc, onDone, onCancel, aspect = 1 }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function handleApply() {
    if (!croppedAreaPixels) return;
    setProcessing(true);

    try {
      const file = await getCroppedFile(imageSrc, croppedAreaPixels);
      onDone(file);
    } catch {
      onCancel();
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:px-4">
      <div className="flex w-full max-w-xl flex-col overflow-hidden rounded-t-[32px] bg-white shadow-xl sm:rounded-[32px]">
        <div className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-[#e7d5cb] sm:hidden" />
        <div className="border-b border-[#f1e3da] px-5 py-4">
          <h2 className="text-base font-bold text-gray-900">Adjust image</h2>
          <p className="mt-1 text-sm text-gray-500">Center the important part so it fills neatly everywhere.</p>
        </div>
        <div className="relative h-[50vh] min-h-[18rem] bg-black sm:h-80">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="flex items-center gap-3">
            <span className="w-10 text-xs text-gray-400">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="flex-1 accent-[#ff7a5c]"
            />
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-2xl border border-[#eeddd3] bg-[#f6eee9] py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-[#eeddd3]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={processing}
              className="flex-1 rounded-2xl py-3 text-sm font-semibold text-white transition-colors disabled:opacity-50"
              style={{ background: "#ff7a5c" }}
            >
              {processing ? "Cropping..." : "Apply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
