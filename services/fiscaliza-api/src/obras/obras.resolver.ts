import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ObrasService } from './obras.service';
import { Obra } from '../entities/obra.entity';
import { CreateObraInput } from './dto/create-obra.dto';

@Resolver(() => Obra)
export class ObrasResolver {
  constructor(private readonly obrasService: ObrasService) {}

  @Query(() => [Obra])
  obras() {
    return this.obrasService.findAll();
  }

  @Mutation(() => Obra)
  createObra(@Args('input') input: CreateObraInput) {
    return this.obrasService.create(input);
  }
}
