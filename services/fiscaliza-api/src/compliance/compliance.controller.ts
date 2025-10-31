import { Body, Controller, Get, Post } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { CreateComplianceEventInput } from './dto/create-compliance-event.dto';

@Controller({ path: 'compliance', version: '1' })
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post('eventos')
  create(@Body() input: CreateComplianceEventInput) {
    return this.complianceService.recordEvent(input);
  }

  @Get('eventos')
  findAll() {
    return this.complianceService.findAll();
  }
}
