import { SATURATE_ASSETS } from "@/lib/brand";

/** Subtle hue strip (asset) — use under titles or card headers. */
export function SaturateHueLine({
  className = "",
  width = 120,
}: {
  className?: string;
  width?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- thin decorative strip; avoids layout issues with next/image
    <img
      src={SATURATE_ASSETS.hueLine}
      alt=""
      width={width}
      height={2}
      className={`block h-[2px] max-w-full object-cover opacity-90 ${className}`}
      style={{ width }}
      aria-hidden
    />
  );
}
