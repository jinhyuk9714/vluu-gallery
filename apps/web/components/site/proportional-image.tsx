import Image from "next/image";

type ProportionalImageProps = {
  alt: string;
  className?: string;
  height?: number;
  priority?: boolean;
  sizes?: string;
  src: string;
  width?: number;
};

export function ProportionalImage({
  alt,
  className,
  height,
  priority = false,
  sizes,
  src,
  width,
}: ProportionalImageProps) {
  if (width && height) {
    return (
      <Image
        alt={alt}
        className={className}
        height={height}
        priority={priority}
        sizes={sizes}
        src={src}
        width={width}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      sizes={sizes}
      src={src}
    />
  );
}
