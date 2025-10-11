import { Module } from '@nestjs/common';
import { FfprobeService } from './services/ffprobe.service';
import { FileCacheService } from './services/file-cache.service';
import { FileDownloadService } from './services/file-download.service';

const PROVIDERS = [FileCacheService, FileDownloadService, FfprobeService];

@Module({
  imports: [],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class AppModule {}
