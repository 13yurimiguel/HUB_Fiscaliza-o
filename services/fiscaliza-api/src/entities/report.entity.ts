import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
@Entity('reports')
export class Report {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  reportCode: string;

  @Field()
  @Column()
  version: number;

  @Field(() => GraphQLJSONObject)
  @Column({ type: 'simple-json' })
  payload: Record<string, any>;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
