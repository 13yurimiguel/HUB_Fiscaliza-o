import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { IsObject, IsString } from 'class-validator';

@InputType()
export class CreateComplianceEventInput {
  @Field()
  @IsString()
  eventType: string;

  @Field(() => GraphQLJSONObject)
  @IsObject()
  payload: Record<string, any>;
}
