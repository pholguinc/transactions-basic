import type { RegisterTransactionData } from '../interfaces/register.transaction.interface'

export interface ITransactionRepository {
  create(request: RegisterTransactionData): Promise<{ id: string; trackingId: string }>
  updateStatus(
    id: string,
    status: 'PROCESSING' | 'APPROVED' | 'REJECTED',
    data?: { fraudScore?: number; receiptPath?: string },
  ): Promise<void>
  findById(id: string): Promise<RegisterTransactionData | null>
}
