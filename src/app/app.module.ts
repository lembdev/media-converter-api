import { Module } from '@nestjs/common';
import { FfprobeService } from './services/ffprobe/ffprobe.service';
import { FileCacheService } from './services/file/file-cache.service';
import { FileDownloadService } from './services/file/file-download.service';

const PROVIDERS = [FileCacheService, FileDownloadService, FfprobeService];

@Module({
  imports: [],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class AppModule {}
