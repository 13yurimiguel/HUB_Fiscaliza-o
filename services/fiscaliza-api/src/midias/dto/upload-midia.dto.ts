import { Field, InputType } from '@nestjs/graphql';
import { IsBase64, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UploadMidiaInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  filename: string;

  @Field()
  @IsBase64()
  data: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  contentType?: string;
}
