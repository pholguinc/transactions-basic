import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { envs } from '../../../infraestructure/config'

interface UserPayload {
  sub: string
  email: string
  name: string
}

// Extendemos la interfaz de Request de Express para incluir al usuario
export interface AuthRequest extends Request {
  user?: UserPayload
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      status: 401,
      message: 'No se proporcionó un token de autenticación',
    })
    return
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({
      status: 401,
      message: 'Token no encontrado en el header de autorización',
    })
    return
  }

  try {
    const payload = jwt.verify(token, envs.jwtSecret as string) as unknown as UserPayload

    req.user = payload

    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({
      status: 401,
      message: 'Token inválido o expirado',
    })
  }
}
