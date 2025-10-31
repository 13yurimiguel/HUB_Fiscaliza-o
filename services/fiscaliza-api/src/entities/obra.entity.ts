import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('obras')
export class Obra {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nome: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  descricao?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  status?: string;
}
