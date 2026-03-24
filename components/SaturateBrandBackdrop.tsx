import Image from "next/image";
import { SATURATE_ASSETS } from "@/lib/brand";

/** Large blurred icon watermark — reference site background texture. */
export function SaturateBrandBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute -right-24 top-1/4 h-[min(80vh,600px)] w-[min(80vh,600px)] opacity-[0.06]">
        <div className="relative h-full w-full">
          <Image
            src={SATURATE_ASSETS.icon}
            alt=""
            fill
            className="object-contain blur-3xl scale-150"
            sizes="600px"
            priority={false}
          />
        </div>
      </div>
      <div className="absolute -left-32 bottom-0 h-[min(60vh,480px)] w-[min(60vh,480px)] opacity-[0.04]">
        <div className="relative h-full w-full">
          <Image
            src={SATURATE_ASSETS.icon}
            alt=""
            fill
            className="object-contain blur-3xl scale-125"
            sizes="480px"
          />
        </div>
      </div>
    </div>
  );
}
