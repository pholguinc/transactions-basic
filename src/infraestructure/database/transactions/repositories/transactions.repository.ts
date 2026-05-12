import { randomUUID } from 'crypto'
import type { RegisterTransactionData } from '../../../../domain/transactions/interfaces/register.transaction.interface'
import type { ITransactionRepository } from '../../../../domain/transactions/repositories/register.transaction.repository'
import { pool } from '../../../config'

export class TransactionRepository implements ITransactionRepository {
  async create(data: RegisterTransactionData): Promise<{ id: string; trackingId: string }> {
    const trackingId = randomUUID()

    const result = await pool.query(
      `
      INSERT INTO billing.transactions (
        user_id,
        amount,
        description,
        status,
        tracking_id
      )
      VALUES ($1, $2, $3, 'PENDING', $4)
      RETURNING id, tracking_id
      `,
      [data.userId, data.amount, data.description, trackingId],
    )

    return result.rows[0]
  }

  async updateStatus(
    id: string,
    status: 'PROCESSING' | 'APPROVED' | 'REJECTED',
    data?: { fraudScore?: number; receiptPath?: string },
  ): Promise<void> {
    let timestampColumn = ''
    if (status === 'APPROVED') timestampColumn = 'approved_at = NOW(),'
    if (status === 'REJECTED') timestampColumn = 'rejected_at = NOW(),'

    await pool.query(
      `
      UPDATE billing.transactions
      SET 
        status = $1,
        fraud_score = $2,
        fraud_checked_at = ${status !== 'PROCESSING' ? 'NOW()' : 'fraud_checked_at'},
        receipt_path = $3,
        receipt_generated_at = ${data?.receiptPath ? 'NOW()' : 'receipt_generated_at'},
        ${timestampColumn}
        updated_at = NOW()
      WHERE id = $4
      `,
      [status, data?.fraudScore || null, data?.receiptPath || null, id],
    )
  }

  async findById(id: string): Promise<RegisterTransactionData | null> {
    const result = await pool.query(
      'SELECT amount, description, user_id as "userId" FROM billing.transactions WHERE id = $1',
      [id],
    )

    if (result.rows.length === 0) return null

    return result.rows[0]
  }
}
