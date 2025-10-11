import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';

@Injectable()
export class FfprobeService {
  async getMetadata(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err: Error, metadata) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              `Failed to probe file: ${err.message}`,
            ),
          );
        }

        resolve(metadata);
      });
    });
  }
}
