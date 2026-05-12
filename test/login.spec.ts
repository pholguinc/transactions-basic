import { describe, it, expect, mock, beforeEach, spyOn } from 'bun:test'
import bcrypt from 'bcryptjs'
import { LoginUserUseCase } from '../src/application/auth/use-cases/login.user.use-case'
import type { ILoginUserRepository } from '../src/domain/auth/repositories/login.user.repository'

describe('LoginUserUseCase', () => {
  let loginUseCase: LoginUserUseCase
  let mockRepository: ILoginUserRepository

  beforeEach(() => {
    mockRepository = {
      findByEmail: mock(() => Promise.resolve(null)),
    }
    loginUseCase = new LoginUserUseCase(mockRepository)
  })

  it('debería lanzar un error si el usuario no existe', async () => {
    const loginData = {
      email: 'user@email.com',
      password: 'password123',
    }

    expect(loginUseCase.execute(loginData)).rejects.toThrow('Credenciales inválidas')
  })

  it('debería devolver un token si las credenciales son válidas', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@email.com',
      passwordHash: 'hashed_password',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockRepository.findByEmail = mock(() => Promise.resolve(mockUser))

    const spy = spyOn(bcrypt, 'compare')
    spy.mockImplementation(() => Promise.resolve(true))

    const loginData = {
      email: 'test@email.com',
      password: 'password123',
    }

    const result = await loginUseCase.execute(loginData)

    expect(result).toHaveProperty('token')
    expect(typeof result.token).toBe('string')

    spy.mockRestore()
  })
})
