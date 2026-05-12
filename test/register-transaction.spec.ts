import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { RegisterTransactionUseCase } from '../src/application/transactions/use-cases/register-transactions.use-case'
import type { ITransactionRepository } from '../src/domain/transactions/repositories/register.transaction.repository'
import type { IStorageProvider } from '../src/domain/shared/interfaces/storage-provider.interface'

describe('RegisterTransactionUseCase', () => {
  let registerUseCase: RegisterTransactionUseCase
  let mockRepository: ITransactionRepository
  let mockStorage: IStorageProvider

  let userId: string
  let transactionId: string
  let trackingId: string

  beforeEach(() => {
    userId = crypto.randomUUID()
    transactionId = crypto.randomUUID()
    trackingId = crypto.randomUUID()

    mockRepository = {
      create: mock(() => Promise.resolve({ id: transactionId, trackingId })),
      updateStatus: mock(() => Promise.resolve()),
      findById: mock(() => Promise.resolve(null)),
    }

    mockStorage = {
      save: mock(() => Promise.resolve('/path/to/receipt.json')),
    }

    registerUseCase = new RegisterTransactionUseCase(mockRepository, mockStorage)
  })

  it('debería registrar una transacción exitosamente y devolver el trackingId', async () => {
    const transactionData = {
      amount: 100,
      description: 'Test transaction',
      userId,
    }

    const result = await registerUseCase.execute(transactionData)

    expect(result).toHaveProperty('trackingId', trackingId)
    expect(mockRepository.create).toHaveBeenCalled()
  })
})
