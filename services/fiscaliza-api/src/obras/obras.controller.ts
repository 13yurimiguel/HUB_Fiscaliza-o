import { Body, Controller, Get, Post } from '@nestjs/common';
import { ObrasService } from './obras.service';
import { CreateObraInput } from './dto/create-obra.dto';

@Controller({ path: 'obras', version: '1' })
export class ObrasController {
  constructor(private readonly obrasService: ObrasService) {}

  @Post()
  create(@Body() data: CreateObraInput) {
    return this.obrasService.create(data);
  }

  @Get()
  findAll() {
    return this.obrasService.findAll();
  }
}
