import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class ProbeUrlInput {
  @ApiProperty({
    description: 'URL of the media file to probe',
    example: 'https://example.com/video.mp4',
  })
  @IsUrl()
  @IsNotEmpty()
  readonly url: string;
}
