import axios from "axios";

// In-memory cache for ultra-fast, zero-delay rendering during SPA session
const memoryCache = new Map();
// Map to deduplicate concurrent in-flight HTTP requests
const inFlightRequests = new Map();

const CACHE_PREFIX = "blogsify_cache_";
const DEFAULT_MAX_AGE_MS = 3 * 60 * 1000; // 3 minutes fresh window

/**
 * Synchronously retrieves cached data from memory or sessionStorage.
 * This runs at Frame 0 on component mount to eliminate loading states entirely.
 */
export function getCachedPosts(cacheKey) {
  // 1. Check memory cache first (fastest, 0 overhead)
  if (memoryCache.has(cacheKey)) {
    const entry = memoryCache.get(cacheKey);
    return entry.data;
  }

  // 2. Check sessionStorage for persistence across tab navigation
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + cacheKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.data) {
        // Hydrate memory cache
        memoryCache.set(cacheKey, { data: parsed.data, timestamp: parsed.timestamp });
        return parsed.data;
      }
    }
  } catch {
    // Graceful fallback if storage is disabled or quota exceeded
  }

  return null;
}

/**
 * Saves data to memory cache and sessionStorage.
 */
export function setCachedPosts(cacheKey, data) {
  const timestamp = Date.now();
  memoryCache.set(cacheKey, { data, timestamp });

  try {
    sessionStorage.setItem(
      CACHE_PREFIX + cacheKey,
      JSON.stringify({ data, timestamp })
    );
  } catch {
    // Ignore storage quota warnings
  }
}

/**
 * Checks if a cache entry is still fresh within the max-age window.
 */
export function isCacheFresh(cacheKey, maxAgeMs = DEFAULT_MAX_AGE_MS) {
  if (memoryCache.has(cacheKey)) {
    const entry = memoryCache.get(cacheKey);
    return Date.now() - entry.timestamp < maxAgeMs;
  }

  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + cacheKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.timestamp) {
        return Date.now() - parsed.timestamp < maxAgeMs;
      }
    }
  } catch {
    // Ignore
  }

  return false;
}

/**
 * Fetches posts with in-flight deduplication, instant cache return, and background SWR.
 *
 * @param {string} url - API endpoint
 * @param {string} cacheKey - Unique key for caching
 * @param {Function} [onUpdate] - Optional callback when fresh background data arrives
 * @returns {Promise<any>} Response data
 */
export async function fetchPostsWithCache(url, cacheKey, onUpdate) {
  const cached = getCachedPosts(cacheKey);
  const isFresh = isCacheFresh(cacheKey);

  // If cache is fresh and we already returned it synchronously, we can avoid network request entirely
  if (cached && isFresh) {
    return cached;
  }

  // If an identical request is already in-flight, reuse it (prevents duplicate network requests)
  if (inFlightRequests.has(cacheKey)) {
    const data = await inFlightRequests.get(cacheKey);
    if (onUpdate && data) onUpdate(data);
    return data;
  }

  // Launch network request with deduplication
  const fetchPromise = (async () => {
    try {
      const res = await axios.get(url);
      const data = res.data;
      setCachedPosts(cacheKey, data);
      if (onUpdate && data) {
        onUpdate(data);
      }
      return data;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, fetchPromise);

  // If we already have stale cache, return it immediately while fetchPromise runs in background
  if (cached) {
    return cached;
  }

  return await fetchPromise;
}
