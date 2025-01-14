import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('protected')
export class protectedController {
  @Get()
  health(@Req() req: Request, @Res() res: Response) {
    const user = req['user'];
    res.json({ user, testing: "testing nx caching" });
    return;
  }
}
