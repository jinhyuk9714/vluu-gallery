"use client";

import { useEffect, useRef, useState } from "react";

import { ProportionalImage } from "@/components/site/proportional-image";

type PhotoDetailHeroProps = {
  alt: string;
  height?: number;
  imageUrl: string;
  title: string;
  width?: number;
};

function getBottomPadding(viewportWidth: number) {
  if (viewportWidth >= 1024) {
    return 32;
  }

  if (viewportWidth >= 640) {
    return 24;
  }

  return 16;
}

export function PhotoDetailHero({
  alt,
  height,
  imageUrl,
  title,
  width,
}: PhotoDetailHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isReleased, setIsReleased] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || typeof window === "undefined") {
      return undefined;
    }

    let frame = 0;

    const updatePosition = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const bottomPadding = getBottomPadding(window.innerWidth);
        setIsReleased(rect.bottom <= window.innerHeight - bottomPadding);
      });
    };

    updatePosition();

    const resizeObserver = new ResizeObserver(() => {
      updatePosition();
    });

    resizeObserver.observe(section);
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  return (
    <section className="relative min-h-[100svh] bg-[var(--color-surface)]" ref={sectionRef}>
      <div className="relative flex min-h-[100svh] items-end overflow-hidden">
        <ProportionalImage
          alt={alt}
          className="block h-auto w-full"
          height={height}
          priority
          sizes="100vw"
          src={imageUrl}
          width={width}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.08)_28%,rgba(0,0,0,0.52)_100%)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className={isReleased ? "absolute inset-x-0 bottom-0" : "fixed inset-x-0 bottom-0"}>
          <div className="mx-auto w-full max-w-[1720px] px-4 pb-4 sm:px-6 sm:pb-6 lg:px-10 lg:pb-8">
            <h1 className="max-w-[8ch] font-serif text-[clamp(2.6rem,8vw,8.6rem)] leading-[0.88] tracking-[-0.05em] text-white sm:max-w-[10ch]">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
