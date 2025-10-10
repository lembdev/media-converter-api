import { Body, Controller, Post } from '@nestjs/common';
import { ProbeUrlInput } from './inputs/probe-url.input';

@Controller()
export class ProbeController {
  constructor() {}

  @Post('/probe/url')
  probeUrl(@Body() body: ProbeUrlInput) {}
}
