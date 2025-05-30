import { useQuery } from "@tanstack/react-query";
import type { Ad } from "@/types/ad";

interface UseAdsFilters {
  search?: string;
  category?: string;
  location?: string;
}

export function useAds(filters?: UseAdsFilters) {
  const queryParams = new URLSearchParams();
  
  if (filters?.search) queryParams.append("search", filters.search);
  if (filters?.category) queryParams.append("category", filters.category);
  if (filters?.location) queryParams.append("location", filters.location);

  const queryString = queryParams.toString();
  const url = `/api/ads${queryString ? `?${queryString}` : ""}`;

  return useQuery<Ad[]>({
    queryKey: ["/api/ads", filters],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAd(id: number) {
  return useQuery<Ad>({
    queryKey: [`/api/ads/${id}`],
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
