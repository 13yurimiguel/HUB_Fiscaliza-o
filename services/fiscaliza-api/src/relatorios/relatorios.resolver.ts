import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RelatoriosService } from './relatorios.service';
import { Report } from '../entities/report.entity';
import { CreateRelatorioInput } from './dto/create-relatorio.dto';

@Resolver(() => Report)
export class RelatoriosResolver {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Mutation(() => Report)
  createRelatorio(@Args('input') input: CreateRelatorioInput) {
    return this.relatoriosService.createVersion(input);
  }

  @Query(() => Report, { nullable: true })
  relatorio(@Args('reportCode') reportCode: string) {
    return this.relatoriosService.findLatest(reportCode);
  }

  @Query(() => [Report])
  relatorioHistorico(@Args('reportCode') reportCode: string) {
    return this.relatoriosService.findHistory(reportCode);
  }
}
