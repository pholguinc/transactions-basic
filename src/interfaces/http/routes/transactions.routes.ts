import { Router } from 'express'
import { TransactionsController } from '../controllers/TransactionsController'
import { validateDto } from '../middlewares/validateDto'
import { RegisterTransactionRequestDto } from '../dtos/transactions/requests/transactions.request.dto'
import { UpdateTransactionStatusDto } from '../dtos/transactions/requests/update-status.request.dto'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

const controller = new TransactionsController()

router.post('/', [authMiddleware, validateDto(RegisterTransactionRequestDto)], controller.register)
router.patch('/:id/status', [authMiddleware, validateDto(UpdateTransactionStatusDto)], controller.updateStatus)

export default router
