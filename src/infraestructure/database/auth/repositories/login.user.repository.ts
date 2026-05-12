import type { LoginUserData } from '../../../../domain/auth/interfaces/login.user.interface'
import type { ILoginUserRepository } from '../../../../domain/auth/repositories/login.user.repository'
import { pool } from '../../../config'

export class LoginUserRepository implements ILoginUserRepository {
  async findByEmail(email: string): Promise<LoginUserData | null> {
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        password_hash
      FROM admin.users
      WHERE email = $1
      LIMIT 1
      `,
      [email],
    )

    if (result.rowCount === 0) {
      return null
    }

    const user = result.rows[0]

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.password_hash,
    }
  }
}
