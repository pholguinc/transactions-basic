import type { LoginUserData } from '../interfaces/login.user.interface'

export interface ILoginUserRepository {
  findByEmail(email: string): Promise<LoginUserData | null>
}
