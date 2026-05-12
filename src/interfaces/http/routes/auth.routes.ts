import { Router } from 'express'

import { AuthController } from '../controllers/AuthController'
import { validateDto } from '../middlewares/validateDto'

import { RegisterUserRequestDto } from '../dtos/auth/requests/register-user.request.dto'
import { LoginUserRequestDto } from '../dtos/auth/requests/login-user.request.dto'

const router = Router()

const controller = new AuthController()

router.post('/register', validateDto(RegisterUserRequestDto), controller.register)
router.post('/login', validateDto(LoginUserRequestDto), controller.login)

export default router
