import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
@Entity('compliance_events')
export class ComplianceEvent {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  eventType: string;

  @Field(() => GraphQLJSONObject)
  @Column({ type: 'simple-json' })
  payload: Record<string, any>;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
