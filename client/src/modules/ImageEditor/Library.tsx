import { useState, useEffect } from "react";
import { pexelsService, type PexelsPhoto } from "@/services/pexelsService";
import Typography from "@/components/Typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchIcon, Loader2 } from "lucide-react";

export default function Library() {
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Fetch curated photos on mount
  useEffect(() => {
    fetchCuratedPhotos();
  }, []);

  const fetchCuratedPhotos = async () => {
    try {
      setLoading(true);
      const response = await pexelsService.getCuratedPhotos(1, 20);
      setPhotos(response.photos);
    } catch (error) {
      console.error("Failed to fetch curated photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchCuratedPhotos();
      return;
    }

    try {
      setLoading(true);
      setPage(1);
      const response = await pexelsService.searchPhotos(searchQuery, 1, 20);
      setPhotos(response.photos);
    } catch (error) {
      console.error("Failed to search photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, photo: PexelsPhoto) => {
    // Store the image URL for dropping onto canvas
    e.dataTransfer.setData(
      "image",
      JSON.stringify({
        src: photo.src.medium,
        photographer: photo.photographer,
        alt: photo.alt,
      })
    );
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex-col gap-2 w-full ">
        <h2 className="text-xl font-semibold mb-4 px-2">Library</h2>
        <span className="text-muted-foreground">Powered by Pexels</span>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search photos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SearchIcon className="h-4 w-4" />
          )}
        </Button>
      </form>

      {/* Photo Grid */}
      <ScrollArea className="flex-1">
        {loading && photos.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {photos.map((photo) => (
              <div
                key={photo.id}
                draggable
                onDragStart={(e) => handleDragStart(e, photo)}
                className="relative group cursor-grab active:cursor-grabbing overflow-hidden rounded-md border border-border hover:border-primary transition-colors"
              >
                <img
                  src={photo.src.small}
                  alt={photo.alt}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <div className="text-white text-xs">
                    <Typography level="caption">
                      Photo by {photo.photographer}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && photos.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <Typography level="p">No photos found</Typography>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
