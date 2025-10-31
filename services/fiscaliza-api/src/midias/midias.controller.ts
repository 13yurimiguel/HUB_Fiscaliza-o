import { Body, Controller, Post } from '@nestjs/common';
import { MidiasService } from './midias.service';
import { UploadMidiaInput } from './dto/upload-midia.dto';

@Controller({ path: 'midias', version: '1' })
export class MidiasController {
  constructor(private readonly midiasService: MidiasService) {}

  @Post('upload')
  upload(@Body() input: UploadMidiaInput) {
    return this.midiasService.upload(input);
  }
}
