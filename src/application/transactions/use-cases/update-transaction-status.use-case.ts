import { IStorageProvider } from '../../../domain/shared/interfaces/storage-provider.interface'
import type { ITransactionRepository } from '../../../domain/transactions/repositories/register.transaction.repository'

export interface UpdateTransactionStatusInput {
  id: string
  status: 'PROCESSING' | 'APPROVED' | 'REJECTED'
}

export class UpdateTransactionStatusUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute(input: UpdateTransactionStatusInput): Promise<void> {
    let receiptPath: string | undefined

    if (input.status === 'APPROVED') {
      const transaction = await this.transactionRepository.findById(input.id)

      if (transaction) {
        const fileName = `receipt-${input.id}.json`
        const receiptContent = {
          transactionId: input.id,
          amount: transaction.amount,
          description: transaction.description,
          userId: transaction.userId,
          generatedAt: new Date().toISOString(),
          status: 'APPROVED',
        }

        receiptPath = await this.storageProvider.save(fileName, JSON.stringify(receiptContent, null, 2), 'receipts')
      }
    }

    await this.transactionRepository.updateStatus(input.id, input.status, {
      receiptPath,
    })
  }
}
