import { createHash } from 'crypto';
import { access, unlink } from 'fs/promises';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

interface CacheEntry {
  url: string;
  filePath: string;
  timestamp: number;
}

@Injectable()
export class FileCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly CACHE_DIR = '/tmp/media-cache';
  private readonly CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
  private readonly CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes
  private cleanupTimer: NodeJS.Timeout | null = null;

  onModuleInit() {
    this.startCleanupInterval();
  }

  onModuleDestroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }

  private generateCacheKey(url: string): string {
    return createHash('sha256').update(url).digest('hex');
  }

  private getFilename(url: string): string {
    const hash = this.generateCacheKey(url);
    const extension = this.extractExtension(url);
    return `${hash}${extension}`;
  }

  private extractExtension(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const match = pathname.match(/\.[a-z0-9]+$/i);
      return match ? match[0] : '';
    } catch {
      return '';
    }
  }

  async getCachedFile(url: string): Promise<string | null> {
    const cacheKey = this.generateCacheKey(url);
    const entry = this.cache.get(cacheKey);

    if (!entry) {
      return null;
    }

    const age = Date.now() - entry.timestamp;
    if (age > this.CACHE_TTL) {
      // Expired, remove from cache
      this.removeCacheEntry(cacheKey);
      return null;
    }

    // Check if file still exists
    try {
      await access(entry.filePath);
      return entry.filePath;
    } catch {
      // File doesn't exist, remove from cache
      this.cache.delete(cacheKey);
      return null;
    }
  }

  setCachedFile(url: string, filePath: string): void {
    const cacheKey = this.generateCacheKey(url);
    this.cache.set(cacheKey, {
      url,
      filePath,
      timestamp: Date.now(),
    });
  }

  getCacheFilename(url: string): string {
    return this.getFilename(url);
  }

  private startCleanupInterval(): void {
    this.cleanupTimer = setInterval(
      () => this.cleanupExpiredFiles(),
      this.CLEANUP_INTERVAL,
    );
  }

  private cleanupExpiredFiles(): void {
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;

      if (age > this.CACHE_TTL) {
        this.removeCacheEntry(key);
      }
    }
  }

  private removeCacheEntry(cacheKey: string): void {
    const entry = this.cache.get(cacheKey);

    if (entry) {
      unlink(entry.filePath).catch(() => {});
      this.cache.delete(cacheKey);
    }
  }
}
