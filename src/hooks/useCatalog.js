import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAppStore } from '../store/useAppStore';
import {
  discoverMedia,
  fetchCatalog,
  fetchCatalogPage,
  fetchMediaDetails,
  fetchProviderStats,
  parseMediaIdentifier,
  searchLocalCatalog,
  searchMedia
} from '../services/vidsrcCatalogService';

export function useCatalog() {
  const language = useAppStore((state) => state.language);
  const query = useQuery({
    queryKey: ['vidsrc-catalog'],
    queryFn: ({ signal }) => fetchCatalog(language, signal),
    placeholderData: [],
    staleTime: 1000 * 60 * 30,
    retry: 2
  });

  return { ...query, data: query.data || [], isLive: !query.error };
}

export function useMediaDetails(identifier) {
  const language = useAppStore((state) => state.language);
  const parsed = parseMediaIdentifier(identifier);
  const query = useQuery({
    queryKey: ['vidsrc-media-details', parsed.type, parsed.imdbId],
    queryFn: ({ signal }) => fetchMediaDetails(parsed.imdbId, parsed.type, language, signal),
    enabled: Boolean(parsed.imdbId),
    staleTime: 1000 * 60 * 60,
    retry: 2
  });

  return { ...query, data: query.data || null };
}

export function useSearchCatalog(queryText, catalog = []) {
  const language = useAppStore((state) => state.language);
  const normalizedQuery = queryText.trim();
  const query = useQuery({
    queryKey: ['catalog-search', normalizedQuery, language],
    queryFn: ({ signal }) => searchMedia(normalizedQuery, language, signal),
    enabled: normalizedQuery.length >= 2,
    placeholderData: () => searchLocalCatalog(normalizedQuery, catalog),
    staleTime: 1000 * 60 * 10,
    retry: 1
  });

  const fallbackResults = searchLocalCatalog(normalizedQuery, catalog);
  return { ...query, data: normalizedQuery.length >= 2 ? query.data || fallbackResults : [] };
}

export function useInfiniteCatalog(type) {
  return useInfiniteQuery({
    queryKey: ['vidsrc-pages', type],
    queryFn: ({ pageParam, signal }) => fetchCatalogPage(type, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 10,
    retry: 2
  });
}

export function useInfiniteDiscoverCatalog(filters) {
  const language = useAppStore((state) => state.language);
  return useInfiniteQuery({
    queryKey: ['vidsrc-discover-pages', filters, language],
    queryFn: ({ pageParam, signal }) => discoverMedia({ ...filters, page: pageParam }, language, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 10,
    retry: 2
  });
}

export function useProviderStats() {
  return useQuery({
    queryKey: ['vidsrc-provider-stats'],
    queryFn: fetchProviderStats,
    staleTime: 1000 * 60 * 60,
    retry: 2
  });
}

export function useDiscoverCatalog(filters) {
  const language = useAppStore((state) => state.language);
  const query = useQuery({
    queryKey: ['discover', filters, language],
    queryFn: ({ signal }) => discoverMedia(filters, language, signal),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10,
    retry: 1
  });

  return query;
}
