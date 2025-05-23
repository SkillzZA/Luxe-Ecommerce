import { CSSProperties } from 'react';

interface ImagePlaceholderProps {
  width?: number;
  height?: number;
  text?: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
  style?: CSSProperties;
}

const ImagePlaceholder = ({
  width = 400,
  height = 300,
  text = 'Image',
  bgColor = '#0ea5e9',
  textColor = '#ffffff',
  className = '',
  style = {},
}: ImagePlaceholderProps) => {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width,
        height,
        backgroundColor: bgColor,
        color: textColor,
        ...style,
      }}
    >
      <span className="text-xl font-medium">{text}</span>
    </div>
  );
};

export default ImagePlaceholder;
