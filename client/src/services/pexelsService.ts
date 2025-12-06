import axios, { type AxiosInstance } from "axios";

// Pexels API types
export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

export interface PexelsResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class PexelsService {
  private api: AxiosInstance;
  private apiKey: string;
  private cache: Map<string, CacheEntry<PexelsResponse | PexelsPhoto>>;
  private cacheTTL: number; // Cache time-to-live in milliseconds

  constructor(cacheTTL: number = 5 * 60 * 1000) {
    // Default: 5 minutes
    this.apiKey = import.meta.env.VITE_PEXELS_API_KEY || "";
    this.cache = new Map();
    this.cacheTTL = cacheTTL;

    this.api = axios.create({
      baseURL: "https://api.pexels.com/v1",
      headers: {
        Authorization: this.apiKey,
      },
    });
  }

  /**
   * Generate cache key from request parameters
   */
  private getCacheKey(endpoint: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    return `${endpoint}?${sortedParams}`;
  }

  /**
   * Get data from cache if valid
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    const isExpired = now - entry.timestamp > this.cacheTTL;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Save data to cache
   */
  private saveToCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data: data as PexelsResponse | PexelsPhoto,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear all cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear expired cache entries
   */
  public clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Fetch curated photos from Pexels
   * @param page - Page number (default: 1)
   * @param perPage - Number of results per page (default: 15, max: 80)
   */
  async getCuratedPhotos(
    page: number = 1,
    perPage: number = 15
  ): Promise<PexelsResponse> {
    try {
      const response = await this.api.get<PexelsResponse>("/curated", {
        params: {
          page,
          per_page: perPage,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching curated photos:", error);
      throw error;
    }
  }

  /**
   * Search for photos on Pexels
   * @param query - Search query
   * @param page - Page number (default: 1)
   * @param perPage - Number of results per page (default: 15, max: 80)
   */
  async searchPhotos(
    query: string,
    page: number = 1,
    perPage: number = 15
  ): Promise<PexelsResponse> {
    try {
      const response = await this.api.get<PexelsResponse>("/search", {
        params: {
          query,
          page,
          per_page: perPage,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching photos:", error);
      throw error;
    }
  }

  /**
   * Get a specific photo by ID
   * @param id - Photo ID
   */
  async getPhotoById(id: number): Promise<PexelsPhoto> {
    try {
      const response = await this.api.get<PexelsPhoto>(`/photos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching photo:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const pexelsService = new PexelsService();
