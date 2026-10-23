import { useState } from "react";
import { BrandMark } from "./BrandMark";

export function MenuImage({
  src,
  alt,
  fallback,
  priority = false,
}: {
  src: string | null;
  alt: string;
  fallback: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed)
    return (
      <div className="image-fallback" role="img" aria-label={alt || fallback}>
        <BrandMark />
        <span>{fallback}</span>
      </div>
    );
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
