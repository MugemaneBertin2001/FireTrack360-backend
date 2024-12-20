import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Extinguisher } from './entities/extinguisher.entity';
import { CreateExtinguisherInput } from './dto/create-extinguisher.input';
import { UpdateExtinguisherInput } from './dto/update-extinguisher.input';

@Injectable()
export class ExtinguishersService {
  constructor(
    @InjectRepository(Extinguisher)
    private readonly extinguisherRepository: Repository<Extinguisher>,
  ) {}

  async create(createExtinguisherInput: CreateExtinguisherInput) {
    const existingExtinguisher = await this.extinguisherRepository.findOne({
      where: { serialNumber: createExtinguisherInput.serialNumber },
    });

    if (existingExtinguisher) {
      throw new ConflictException(
        'Extinguisher with this serial number already exists',
      );
    }

    const extinguisher = this.extinguisherRepository.create(
      createExtinguisherInput,
    );
    return this.extinguisherRepository.save(extinguisher);
  }

  findAll() {
    return this.extinguisherRepository.find();
  }

  async findOne(id: string) {
    const extinguisher = await this.extinguisherRepository.findOne({
      where: { id },
    });

    if (!extinguisher) {
      throw new NotFoundException(`Extinguisher #${id} not found`);
    }

    return extinguisher;
  }

  async update(id: string, updateExtinguisherInput: UpdateExtinguisherInput) {
    const extinguisher = await this.findOne(id);
    Object.assign(extinguisher, updateExtinguisherInput);
    return this.extinguisherRepository.save(extinguisher);
  }

  async remove(id: string) {
    const extinguisher = await this.findOne(id);
    await this.extinguisherRepository.remove(extinguisher);
    return true;
  }

  async findBySerialNumber(
    serialNumber: string,
  ): Promise<Extinguisher | undefined> {
    return this.extinguisherRepository.findOne({ where: { serialNumber } });
  }
}
