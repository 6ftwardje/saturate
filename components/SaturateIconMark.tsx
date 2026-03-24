import Image from "next/image";
import { SATURATE_ASSETS } from "@/lib/brand";

export function SaturateIconMark({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={SATURATE_ASSETS.icon}
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden
    />
  );
}
