import { useMemo } from "react";
import { qrSvgPath } from "../../utils/qrcode";

/**
 * A QR code drawn as one SVG path.
 *
 * Renders nothing if the value is too long for the encoder rather than
 * showing a broken code: a QR that does not scan is worse than none, since
 * the person holding the certificate would trust it and get nowhere.
 */
export default function QrCode({ value, size = 112, label }) {
  const qr = useMemo(() => {
    try {
      return qrSvgPath(value);
    } catch (err) {
      console.error("QR code not generated:", err.message);
      return null;
    }
  }, [value]);

  if (!qr) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${qr.size} ${qr.size}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={label || `Code QR vers ${value}`}
    >
      <rect width={qr.size} height={qr.size} fill="#ffffff" />
      <path d={qr.path} fill="#0f172a" />
    </svg>
  );
}
