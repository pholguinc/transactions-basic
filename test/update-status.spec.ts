import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { UpdateTransactionStatusUseCase } from '../src/application/transactions/use-cases/update-transaction-status.use-case'
import type { ITransactionRepository } from '../src/domain/transactions/repositories/register.transaction.repository'
import type { IStorageProvider } from '../src/domain/shared/interfaces/storage-provider.interface'

describe('UpdateTransactionStatusUseCase', () => {
  let updateUseCase: UpdateTransactionStatusUseCase
  let mockRepository: ITransactionRepository
  let mockStorage: IStorageProvider

  const transactionId = crypto.randomUUID()

  beforeEach(() => {
    mockRepository = {
      create: mock(() => Promise.resolve({ id: transactionId, trackingId: 'T-123' })),
      updateStatus: mock(() => Promise.resolve()),
      findById: mock(() =>
        Promise.resolve({
          amount: 100,
          description: 'Pago de prueba',
          userId: 'user-123',
        }),
      ),
    }
    mockStorage = {
      save: mock(() => Promise.resolve('/storage/receipt-123.json')),
    }
    updateUseCase = new UpdateTransactionStatusUseCase(mockRepository, mockStorage)
  })

  it('debería generar un recibo cuando el estado cambia a APPROVED', async () => {
    const input = {
      id: transactionId,
      status: 'APPROVED' as const,
    }

    await updateUseCase.execute(input)

    expect(mockStorage.save).toHaveBeenCalled()
    expect(mockRepository.updateStatus).toHaveBeenCalledWith(
      '123',
      'APPROVED',
      expect.objectContaining({ receiptPath: '/storage/receipt-123.json' }),
    )
  })

  it('no debería generar recibo cuando el estado es REJECTED', async () => {
    const input = {
      id: transactionId,
      status: 'REJECTED' as const,
    }

    await updateUseCase.execute(input)

    expect(mockStorage.save).not.toHaveBeenCalled()
  })
})
