import * as bcrypt from 'bcryptjs'
import type { IUserRepository } from '../../../domain/auth/repositories/register.user.repository'
import type { RegisterUserInput } from '../interfaces/register.user.input'

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: RegisterUserInput): Promise<void> {
    const passwordHash = await bcrypt.hash(data.passwordHash, 10)

    await this.userRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
    })
  }
}
