import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan, onError, active }) {
  const regionId = "qr-scanner-region";
  const scannerRef = useRef(null);
  const lastScanRef = useRef({ code: "", time: 0 });

  useEffect(() => {
    if (!active) return;

    const scanner = new Html5Qrcode(regionId);
    scannerRef.current = scanner;
    let cancelled = false;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          // Debounce: ignore the same code re-fired within 3s (camera scans every frame)
          const now = Date.now();
          if (decodedText === lastScanRef.current.code && now - lastScanRef.current.time < 3000) {
            return;
          }
          lastScanRef.current = { code: decodedText, time: now };
          onScan(decodedText);
        },
        () => {} // ignore per-frame "no QR found" noise
      )
      .catch((err) => {
        if (!cancelled) onError?.(err?.message || "Could not access camera");
      });

    return () => {
      cancelled = true;
      scanner
        .stop()
        .then(() => scanner.clear())
        .catch(() => {});
    };
  }, [active]);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-sidebar">
      <div id={regionId} className="aspect-square w-full [&_video]:object-cover" />
    </div>
  );
}
