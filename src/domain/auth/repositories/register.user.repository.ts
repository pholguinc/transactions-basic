import type { RegisterUserData } from '../interfaces/register.user.interface'

export interface IUserRepository {
  create(request: RegisterUserData): Promise<void>
}
