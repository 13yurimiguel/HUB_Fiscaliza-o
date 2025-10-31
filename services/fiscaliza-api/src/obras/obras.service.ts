import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Obra } from '../entities/obra.entity';
import { CreateObraInput } from './dto/create-obra.dto';

@Injectable()
export class ObrasService {
  constructor(
    @InjectRepository(Obra)
    private readonly obrasRepository: Repository<Obra>,
  ) {}

  async create(data: CreateObraInput): Promise<Obra> {
    const obra = this.obrasRepository.create(data);
    return this.obrasRepository.save(obra);
  }

  async findAll(): Promise<Obra[]> {
    return this.obrasRepository.find();
  }
}
