import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { register, collectDefaultMetrics } from 'prom-client';

// Collect default metrics
collectDefaultMetrics();

@Controller('metrics')
export class MetricsController {
  @Get()
  async getMetrics(@Res() res: Response): Promise<void> {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  }
}