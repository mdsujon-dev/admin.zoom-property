import { Image } from "antd";
import { Eye } from "lucide-react";
import { mediaSrc } from "../../utils/mediaSrc";

interface AntImageProps {
  src?: string | null;
  alt?: string;
  accessurl?: boolean;
  className?: string;
  rootClassName?: string;
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
  className = "!w-full !h-full !object-cover",
  rootClassName = "!w-full !h-full !flex !items-center !justify-center",
  height,
  width,
  title,
  style,
  preview = true,
  fallback,
}: AntImageProps) {
  const finalSrc = src
    ? accessurl
      ? mediaSrc(src)
      : src.startsWith("http")
      ? src
      : mediaSrc(src)
    : "";

  return (
    <Image
      src={finalSrc}
      alt={alt}
      title={title}
      className={className}
      rootClassName={rootClassName}
      height={height}
      width={width}
      style={{
        width: width ?? "100%",
        height: height ?? "100%",
        objectFit: "cover",
        ...style,
      }}
      loading="lazy"
      preview={
        preview
          ? {
              mask: (
                <div className="flex items-center justify-center w-full h-full text-white">
                  <Eye className="w-4 h-4 drop-shadow-sm" />
                </div>
              ),
            }
          : false
      }
      fallback={fallback}
    />
  );
}
