import { useState, useRef } from "react";
import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UploadIcon, XIcon } from "lucide-react";

interface UserImage {
  id: string;
  src: string;
  name: string;
  file: File;
}

export default function MyImage() {
  const [images, setImages] = useState<UserImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: UserImage[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const src = event.target?.result as string;
          newImages.push({
            id: `${file.name}-${Date.now()}`,
            src,
            name: file.name,
            file,
          });
          if (newImages.length === files.length) {
            setImages([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragStart = (e: React.DragEvent, image: UserImage) => {
    e.dataTransfer.setData(
      "image",
      JSON.stringify({
        src: image.src,
        alt: image.name,
      })
    );
  };

  const handleRemoveImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold mb-4 px-2">My Assets</h2>
        <Typography level="caption">Upload and use your own images</Typography>
      </div>
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
          variant="outline"
        >
          <UploadIcon className="h-4 w-4 mr-2" />
          Upload Images
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {images.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <Typography level="p">No images uploaded</Typography>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {images.map((image) => (
              <div
                key={image.id}
                draggable
                onDragStart={(e) => handleDragStart(e, image)}
                className="relative group cursor-grab active:cursor-grabbing overflow-hidden rounded-md border border-border hover:border-primary transition-colors"
              >
                <img
                  src={image.src}
                  alt={image.name}
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => handleRemoveImage(image.id)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XIcon className="h-3 w-3" />
                </button>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <Typography level="caption">{image.name}</Typography>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
