import type { Request, Response } from 'express'
import { RegisterTransactionUseCase } from '../../../application/transactions/use-cases/register-transactions.use-case'
import { TransactionRepository } from '../../../infraestructure/database/transactions/repositories/transactions.repository'
import { UpdateTransactionStatusUseCase } from '../../../application/transactions/use-cases/update-transaction-status.use-case'
import { LocalStorageProvider } from '../../../infraestructure/services/local-storage-provider.service'

export class TransactionsController {
  async register(req: Request, res: Response): Promise<Response> {
    const repository = new TransactionRepository()
    const storageProvider = new LocalStorageProvider()
    const useCase = new RegisterTransactionUseCase(repository, storageProvider)

    const result = await useCase.execute(req.body)

    return res.status(201).json({
      status: 201,
      message: 'Transacción registrada exitosamente',
      tracking_id: result.trackingId,
    })
  }

  async updateStatus(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const { status } = req.body

    const repository = new TransactionRepository()
    const storageProvider = new LocalStorageProvider()
    const useCase = new UpdateTransactionStatusUseCase(repository, storageProvider)

    await useCase.execute({
      id: id as string,
      status: status as 'PROCESSING' | 'APPROVED' | 'REJECTED',
    })

    return res.status(200).json({
      status: 200,
      message: `Estado de transacción actualizado a ${status}`,
    })
  }
}
