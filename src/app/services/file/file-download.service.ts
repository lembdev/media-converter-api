import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import * as http from 'http';
import * as https from 'https';
import { join } from 'path';
import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
} from '@nestjs/common';

@Injectable()
export class FileDownloadService {
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly CACHE_DIR = '/tmp/media-cache';
  private readonly MAX_REDIRECTS = 5;

  async downloadFile(url: string, filename: string): Promise<string> {
    await mkdir(this.CACHE_DIR, { recursive: true });

    const filePath = join(this.CACHE_DIR, filename);
    return this.downloadWithRedirects(url, filePath, 0);
  }

  private downloadWithRedirects(
    url: string,
    filePath: string,
    redirectCount: number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (redirectCount > this.MAX_REDIRECTS) {
        reject(
          new BadRequestException('Too many redirects while downloading file'),
        );
        return;
      }

      const client = url.startsWith('https://') ? https : http;

      const request = client.get(url, (response) => {
        // Handle redirects
        if (
          response.statusCode &&
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          // Follow redirect
          const redirectUrl = response.headers.location;
          this.downloadWithRedirects(redirectUrl, filePath, redirectCount + 1)
            .then(resolve)
            .catch(reject);
          return;
        }

        if (response.statusCode !== 200) {
          reject(
            new BadRequestException(
              `Failed to download file: HTTP ${response.statusCode}`,
            ),
          );
          return;
        }

        const contentLength = parseInt(
          response.headers['content-length'] || '0',
          10,
        );
        if (contentLength > this.MAX_FILE_SIZE) {
          response.destroy();
          reject(
            new PayloadTooLargeException(
              `File size exceeds 50MB limit (${Math.round(contentLength / 1024 / 1024)}MB)`,
            ),
          );
          return;
        }

        let downloadedSize = 0;
        const fileStream = createWriteStream(filePath);

        response.on('data', (chunk: Buffer) => {
          downloadedSize += chunk.length;
          if (downloadedSize > this.MAX_FILE_SIZE) {
            response.destroy();
            fileStream.close();
            reject(
              new PayloadTooLargeException(
                'File size exceeds 50MB limit during download',
              ),
            );
          }
        });

        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          resolve(filePath);
        });

        fileStream.on('error', (err) => {
          reject(
            new BadRequestException(`Failed to save file: ${err.message}`),
          );
        });
      });

      request.on('error', (err) => {
        reject(
          new BadRequestException(`Failed to download file: ${err.message}`),
        );
      });

      request.setTimeout(30000, () => {
        request.destroy();
        reject(new BadRequestException('Download timeout'));
      });
    });
  }
}
