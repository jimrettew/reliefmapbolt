import { useState, useEffect, useCallback } from 'react';

interface OfflineData {
  timestamp: number;
  data: any;
  key: string;
}

interface UseOfflineModeReturn {
  isOffline: boolean;
  isOnline: boolean;
  cachedData: Record<string, any>;
  saveToCache: (key: string, data: any) => Promise<void>;
  getFromCache: (key: string) => any;
  clearCache: () => Promise<void>;
  syncData: () => Promise<void>;
  lastSyncTime: Date | null;
}

// In-memory cache (in a real app, you'd use AsyncStorage)
const memoryCache: Record<string, OfflineData> = {};
let lastSyncTimestamp: number | null = null;

export function useOfflineMode(): UseOfflineModeReturn {
  const [isOffline, setIsOffline] = useState(false);
  const [cachedData, setCachedData] = useState<Record<string, any>>({});
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Check network connectivity
  const checkConnectivity = useCallback(async () => {
    try {
      await fetch('https://www.google.com', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
      });
      setIsOffline(false);
      return true;
    } catch {
      setIsOffline(true);
      return false;
    }
  }, []);

  // Load cached data from memory
  const loadCachedData = useCallback(async () => {
    try {
      const data: Record<string, any> = {};

      Object.entries(memoryCache).forEach(([key, offlineData]) => {
        data[key] = offlineData.data;
      });

      setCachedData(data);

      // Load last sync timestamp
      if (lastSyncTimestamp) {
        setLastSyncTime(new Date(lastSyncTimestamp));
      }
    } catch (error) {
      console.error('Failed to load cached data:', error);
    }
  }, []);

  // Save data to cache
  const saveToCache = useCallback(async (key: string, data: any) => {
    try {
      const offlineData: OfflineData = {
        timestamp: Date.now(),
        data,
        key,
      };

      memoryCache[key] = offlineData;
      setCachedData(prev => ({ ...prev, [key]: data }));
    } catch (error) {
      console.error('Failed to save to cache:', error);
    }
  }, []);

  // Get data from cache
  const getFromCache = useCallback((key: string) => {
    return cachedData[key] || null;
  }, [cachedData]);

  // Clear all cached data
  const clearCache = useCallback(async () => {
    try {
      Object.keys(memoryCache).forEach(key => {
        delete memoryCache[key];
      });

      lastSyncTimestamp = null;
      setCachedData({});
      setLastSyncTime(null);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }, []);

  // Sync data when back online
  const syncData = useCallback(async () => {
    if (isOffline) {
      console.log('Cannot sync while offline');
      return;
    }

    try {
      // In a real app, you'd sync cached data with the server
      console.log('Syncing data with server...');

      // Update sync timestamp
      lastSyncTimestamp = Date.now();
      setLastSyncTime(new Date(lastSyncTimestamp));

      console.log('Data synced successfully');
    } catch (error) {
      console.error('Failed to sync data:', error);
    }
  }, [isOffline]);

  // Initialize offline mode
  useEffect(() => {
    loadCachedData();
    checkConnectivity();

    // Check connectivity periodically
    const interval = setInterval(checkConnectivity, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [loadCachedData, checkConnectivity]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (!isOffline && lastSyncTime) {
      const timeSinceLastSync = Date.now() - lastSyncTime.getTime();
      const oneHour = 60 * 60 * 1000;

      if (timeSinceLastSync > oneHour) {
        syncData();
      }
    }
  }, [isOffline, lastSyncTime, syncData]);

  return {
    isOffline,
    isOnline: !isOffline,
    cachedData,
    saveToCache,
    getFromCache,
    clearCache,
    syncData,
    lastSyncTime,
  };
}
