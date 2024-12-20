import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AdminCreateUserInput } from './dto/admin-create-user.input';
import { AdminUpdateUserInput } from './dto/admin-update-user.input';
import { HashingService } from './hashing.service';
import { UserStatus, UserRole } from './entities/user.entity';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async createUser(input: AdminCreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: input.email }, { phone: input.phoneNumber }],
    });

    if (existingUser) {
      throw new ConflictException('Email or phone number already exists');
    }

    const user = this.userRepository.create({
      ...input,
      password: await this.hashingService.hashPassword(input.password),
    });

    return this.userRepository.save(user);
  }

  async updateUser(input: AdminUpdateUserInput): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: input.id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${input.id}" not found`);
    }

    if (input.email && input.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: input.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    if (input.phoneNumber && input.phoneNumber !== user.phone) {
      const existingPhone = await this.userRepository.findOne({
        where: { phone: input.phoneNumber },
      });
      if (existingPhone) {
        throw new ConflictException('Phone number already exists');
      }
    }

    Object.assign(user, input);
    return this.userRepository.save(user);
  }

  async findAll(filters?: {
    role?: string;
    status?: string;
    search?: string;
  }): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder('user');

    if (filters?.role) {
      query.andWhere('user.role = :role', { role: filters.role });
    }

    if (filters?.status) {
      query.andWhere('user.status = :status', { status: filters.status });
    }

    if (filters?.search) {
      query.andWhere(
        '(user.fullName ILIKE :search OR user.email ILIKE :search OR user.phoneNumber ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async updateStatus(id: string, status: UserStatus): Promise<User> {
    const user = await this.findOne(id);
    user.status = status;
    return this.userRepository.save(user);
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    const user = await this.findOne(id);
    user.role = role;
    return this.userRepository.save(user);
  }
}
