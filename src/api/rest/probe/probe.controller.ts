import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FfprobeService } from 'src/app/services/ffprobe.service';
import { FileCacheService } from 'src/app/services/file-cache.service';
import { FileDownloadService } from 'src/app/services/file-download.service';
import { ProbeUrlInput } from './inputs/probe-url.input';

@ApiTags('probe')
@Controller()
export class ProbeController {
  constructor(
    private readonly fileCacheService: FileCacheService,
    private readonly fileDownloadService: FileDownloadService,
    private readonly ffprobeService: FfprobeService,
  ) {}

  @Post('/probe/url')
  @ApiOperation({
    summary: 'Probe media file from URL',
    description:
      'Download a media file from URL (max 50MB) and extract metadata using ffprobe. Files are cached for 1 hour.',
  })
  @ApiResponse({
    status: 200,
    description: 'Media metadata successfully retrieved',
  })
  @ApiBadRequestResponse({
    description: 'Invalid URL or download failed',
  })
  @ApiPayloadTooLargeResponse({
    description: 'File size exceeds 50MB limit',
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to probe file',
  })
  async probeUrl(@Body() body: ProbeUrlInput) {
    const { url } = body;

    // Check cache first
    let filePath = await this.fileCacheService.getCachedFile(url);

    if (!filePath) {
      // Cache miss - download file
      const filename = this.fileCacheService.getCacheFilename(url);
      filePath = await this.fileDownloadService.downloadFile(url, filename);

      // Store in cache
      this.fileCacheService.setCachedFile(url, filePath);
    }

    // Get metadata
    const metadata = await this.ffprobeService.getMetadata(filePath);

    return metadata;
  }
}
