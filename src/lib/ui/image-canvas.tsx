import { useRef, useState, useEffect, type FC } from "react";

interface Crop {
  x: number;
  y: number;
  width: number;
  height: number;
}

const MAX_IMAGE_WIDTH = 2000;
const MAX_IMAGE_HEIGHT = 2000;

type Props = {
  imageSrc: string;
  setImageSrc: (base64Img: string) => void;
  regionImageB64: string;
  setRegionImageB64: (base64Img: string) => void;
};

const Component: FC<Props> = ({
  imageSrc,
  setImageSrc,
  //   regionImageB64,
  setRegionImageB64,
}) => {
  const [crop, setCrop] = useState<Crop | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [naturalSize, setNaturalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // === File Handling ===
  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      // setRegionImageB64(reader.result as string);
    };
    reader.readAsDataURL(file);
    setCrop(null);
    setRegionImageB64("");
    setNaturalSize(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert("File too large. Max size is 10MB.");
      return;
    }

    handleImageFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      const maxSizeMB = 10;
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert("File too large. Max size is 10MB.");
        return;
      }
      handleImageFile(file);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  // === Image load handler to get natural dimensions and validate max size ===
  const onImageLoad = () => {
    if (imageRef.current) {
      const width = imageRef.current.naturalWidth;
      const height = imageRef.current.naturalHeight;

      if (width > MAX_IMAGE_WIDTH || height > MAX_IMAGE_HEIGHT) {
        alert(
          `Image is too large! Maximum allowed dimensions are ${MAX_IMAGE_WIDTH} x ${MAX_IMAGE_HEIGHT}px.`
        );
        // Reset image because it’s too big
        setImageSrc("");
        setNaturalSize(null);
        setCrop(null);
        setRegionImageB64("");
        // Also clear the file input so user can select again
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setNaturalSize({ width, height });
    }
  };

  // === Canvas Interaction ===
  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canvasRef.current || !naturalSize) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = naturalSize.width / rect.width;
    const scaleY = naturalSize.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setStartPos({ x, y });
    setIsSelecting(true);
    setCrop(null);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !canvasRef.current || !naturalSize) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = naturalSize.width / rect.width;
    const scaleY = naturalSize.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const newCrop = {
      x: Math.min(x, startPos.x),
      y: Math.min(y, startPos.y),
      width: Math.abs(x - startPos.x),
      height: Math.abs(y - startPos.y),
    };

    setCrop(newCrop);
  };

  const onMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelecting(false);
    if (crop) {
      extractCrop(crop);
    }
  };

  // === Extract cropped image region as base64 ===
  const extractCrop = (cropArea: Crop) => {
    const img = imageRef.current;
    if (!img || !naturalSize) return;

    const canvas = document.createElement("canvas");
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      img,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    const base64 = canvas.toDataURL("image/png");
    setRegionImageB64(base64);
  };

  // === Draw image and crop overlay on canvas ===
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current || !naturalSize) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    if (!ctx || !img) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = naturalSize.width * dpr;
    canvas.height = naturalSize.height * dpr;
    canvas.style.width = `${naturalSize.width}px`;
    canvas.style.height = `${naturalSize.height}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset any transforms
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, naturalSize.width, naturalSize.height);
    ctx.drawImage(img, 0, 0, naturalSize.width, naturalSize.height);

    if (crop) {
      // Dimmed overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, naturalSize.width, naturalSize.height);

      // Transparent crop area
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.rect(crop.x, crop.y, crop.width, crop.height);
      ctx.fill();
      ctx.restore();

      // Dotted border
      ctx.save();
      ctx.setLineDash([4, 2]);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);
      ctx.restore();
    }
  }, [crop, imageSrc, naturalSize]);

  return (
    <>
      {/* 📦 Drop Zone */}
      <div
        onClick={handleClickUpload}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: "2px dashed #888",
          padding: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
          cursor: "pointer",
          background: "#f8f8f8",
          borderRadius: "8px",
          flex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        {imageSrc ? (
          <div
            style={{
              position: "relative",
              display: "inline-block",
              userSelect: "none",
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onClick={(e) => e.stopPropagation()}
            onMouseLeave={() => setIsSelecting(false)}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Hidden source"
              style={{ display: "none" }}
              onLoad={onImageLoad}
              crossOrigin="anonymous"
            />
            <canvas ref={canvasRef} style={{ cursor: "crosshair" }} />
          </div>
        ) : (
          <span style={{ color: "#888" }}>
            Click or drag an image here to upload
          </span>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {/* 🔍 Preview */}
      {/* {regionImageB64 && (
        <div style={{ marginTop: 20 }}>
          <h4>Cropped Region Preview:</h4>
          <img
            src={regionImageB64}
            alt="Cropped Region"
            style={{ border: "1px solid #ccc", maxWidth: "100%" }}
          />
        </div>
      )} */}
    </>
  );
};

Component.displayName = "UiImageCanvas";
export default Component;
