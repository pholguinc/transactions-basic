import type { RegisterUserData } from '../../../../domain/auth/interfaces/register.user.interface'
import type { IUserRepository } from '../../../../domain/auth/repositories/register.user.repository'
import { pool } from '../../../config'

export class RegisterUserRepository implements IUserRepository {
  async create(data: RegisterUserData): Promise<void> {
    await pool.query(
      `
      INSERT INTO admin.users (
        name,
        email,
        phone,
        password_hash
      )
      VALUES ($1, $2, $3, $4)
      `,
      [data.name, data.email, data.phone, data.passwordHash],
    )
  }
}
