import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { CreateRelatorioInput } from './dto/create-relatorio.dto';

@Controller({ path: 'relatorios', version: '1' })
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Post()
  create(@Body() input: CreateRelatorioInput) {
    return this.relatoriosService.createVersion(input);
  }

  @Get(':reportCode')
  latest(@Param('reportCode') reportCode: string) {
    return this.relatoriosService.findLatest(reportCode);
  }

  @Get(':reportCode/historico')
  historico(@Param('reportCode') reportCode: string) {
    return this.relatoriosService.findHistory(reportCode);
  }
}
