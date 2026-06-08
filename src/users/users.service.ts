import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CompleteUserProfileDto } from './dto/complete-profile.dto';
import { UpdateUserDto } from './dto/update-profile.dto';
@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ─── GET /user/profile ────────────────────────
  async getProfile(id: number) {
    const user = await this.userRepository.findOne({
      where: { id }
    });
    if (!user) throw new NotFoundException('User not found');

    const { password_hash, ...result } = user; // ← never return password
    return result;
  }

  // ─── POST /user/profile ───────────────────────
  async completeProfile(id: number, dto: CompleteUserProfileDto) {
    const user = await this.userRepository.findOne({
      where: { id }
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.is_profile_completed) {
      throw new BadRequestException('Profile already completed. Use PATCH to update.');
    }

    await this.userRepository.update(id, {
      ...dto,
      is_profile_completed: true,   // ← mark as completed
    });

    return { message: 'Profile completed successfully' };
  }

  // ─── PATCH /user/profile ──────────────────────
  async updateProfile(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id }
    });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.update(id, dto);

    return { message: 'Profile updated successfully' };
  }
}