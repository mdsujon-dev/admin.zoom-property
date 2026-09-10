import { Image } from "antd";
import { mediaSrc } from "../../utils/mediaSrc";

interface AntImageProps {
  src?: string | null;
  alt?: string;
  accessurl?: boolean;
  className?: string;
  height?: number | string;
  width?: number | string;
  title?: string;
  style?: React.CSSProperties;
  preview?: boolean;
  fallback?: string;
}

export default function AntImage({
  src,
  alt = "image",
  accessurl = false,
  className,
  height,
  width,
  title,
  style,
  preview = true,
  fallback,
}: AntImageProps) {
  const finalSrc = src ? (accessurl ? mediaSrc(src) : (src.startsWith("http") ? src : mediaSrc(src))) : "";

  return (
    <Image
      src={finalSrc}
      alt={alt}
      title={title}
      className={className}
      style={{
        ...style,
        height,
        width,
        objectFit: "cover",
        borderRadius: "0px",
      }}
      loading="lazy"
      preview={preview}
      fallback={fallback}
    />
  );
}
