import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ComplianceService } from './compliance.service';
import { ComplianceEvent } from '../entities/compliance-event.entity';
import { CreateComplianceEventInput } from './dto/create-compliance-event.dto';

@Resolver(() => ComplianceEvent)
export class ComplianceResolver {
  constructor(private readonly complianceService: ComplianceService) {}

  @Mutation(() => ComplianceEvent)
  registrarEvento(@Args('input') input: CreateComplianceEventInput) {
    return this.complianceService.recordEvent(input);
  }

  @Query(() => [ComplianceEvent])
  eventosCompliance() {
    return this.complianceService.findAll();
  }
}
