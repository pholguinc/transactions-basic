import bcrypt from 'bcryptjs'
import type { ILoginUserRepository } from '../../../domain/auth/repositories/login.user.repository'
import type { LoginUserInput } from '../interfaces/login.user.input'
import jwt from 'jsonwebtoken'
import { envs } from '../../../infraestructure/config'

export class LoginUserUseCase {
  constructor(private readonly userRepository: ILoginUserRepository) {}

  async execute(data: LoginUserInput): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(data.email)

    if (!user) {
      throw new Error('Credenciales inválidas')
    }

    const passwordMatches = await bcrypt.compare(data.password, user.passwordHash)

    if (!passwordMatches) {
      throw new Error('Credenciales inválidas')
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
      },
      envs.jwtSecret as string,
      {
        expiresIn: '1d',
      },
    )

    return { token }
  }
}
