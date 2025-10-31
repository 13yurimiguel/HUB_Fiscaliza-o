import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateObraInput {
  @Field()
  @IsString()
  nome: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  descricao?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  status?: string;
}
