import { plainToInstance, type ClassConstructor } from 'class-transformer'
import { validate } from 'class-validator'
import type { NextFunction, Request, Response } from 'express'

export const validateDto = <T extends object>(DtoClass: ClassConstructor<T>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Transformamos el body plano a una instancia de la clase DTO
      const dto = plainToInstance(DtoClass, req.body || {})

      // Validar la instancia
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: { target: false },
      })

      if (errors.length > 0) {
        res.status(400).json({
          message: 'Error de validación',
          errors: errors.map((err) => ({
            property: err.property,
            constraints: err.constraints,
          })),
        })
        return
      }

      // 3. Asignamos el DTO ya validado y transformado al body
      req.body = dto
      next()
    } catch (error) {
      console.error('Validation Middleware Error:', error)
      res.status(500).json({
        message: 'Internal server error during validation',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}
