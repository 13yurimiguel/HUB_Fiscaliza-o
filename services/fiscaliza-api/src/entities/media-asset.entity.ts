import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
@Entity('media_assets')
export class MediaAsset {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  filename: string;

  @Field()
  @Column()
  storageKey: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, any>;

  @Field()
  @Column()
  hash: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
