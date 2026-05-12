import type { Request, Response } from 'express'
import { RegisterUserUseCase } from '../../../application/auth/use-cases/register.user.use-case'
import { RegisterUserRepository } from '../../../infraestructure/database/auth/repositories/register.user.repository'
import { LoginUserRepository } from '../../../infraestructure/database/auth/repositories/login.user.repository'
import { LoginUserUseCase } from '../../../application/auth/use-cases/login.user.use-case'
import type { LoginUserResponse } from '../dtos/auth/responses/login-user.response'

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    const repository = new RegisterUserRepository()

    const useCase = new RegisterUserUseCase(repository)

    await useCase.execute(req.body)

    return res.status(201).json({
      status: 201,
      message: 'Usuario registrado exitosamente',
    })
  }

  async login(req: Request, res: Response): Promise<Response<LoginUserResponse>> {
    const repository = new LoginUserRepository()
    const useCase = new LoginUserUseCase(repository)

    const result = await useCase.execute(req.body)

    return res.status(200).json({
      status: 200,
      message: 'Login exitoso',
      access_token: result.token,
    })
  }
}
