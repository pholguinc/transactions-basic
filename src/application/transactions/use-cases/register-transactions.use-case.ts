import type { IStorageProvider } from '../../../domain/shared/interfaces/storage-provider.interface'
import type { RegisterTransactionData } from '../../../domain/transactions/interfaces/register.transaction.interface'
import type { ITransactionRepository } from '../../../domain/transactions/repositories/register.transaction.repository'

export class RegisterTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute(data: RegisterTransactionData): Promise<{ id: string; trackingId: string }> {
    const transaction = await this.transactionRepository.create({
      ...data,
    })

    // Disparamos el proceso asíncrono sin usar 'await'
    this.processTransaction(transaction.id, data).catch((err) => {
      console.error(`Error procesando transacción ${transaction.id}:`, err)
    })

    return transaction
  }

  private async processTransaction(transactionId: string, originalData: RegisterTransactionData): Promise<void> {
    // 1. Pasar a estado PROCESSING inmediatamente
    await this.transactionRepository.updateStatus(transactionId, 'PROCESSING')
    console.log(`Transacción ${transactionId} en proceso...`)

    // 2. Simular análisis de fraude de 2 segundos
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 3. Simular decisión (ej: puntaje aleatorio)
    const fraudScore = Math.random() * 100
    const status = fraudScore < 80 ? 'APPROVED' : 'REJECTED'

    let receiptPath: string | undefined

    // 4. Si es aprobada, generar recibo JSON
    if (status === 'APPROVED') {
      receiptPath = await this.generateReceipt(transactionId, originalData)
    }

    // 5. Actualizar estado final en base de datos
    await this.transactionRepository.updateStatus(transactionId, status, {
      fraudScore,
      receiptPath,
    })

    console.log(`Transacción ${transactionId} finalizada como: ${status} (Score: ${fraudScore.toFixed(2)})`)
  }

  private async generateReceipt(id: string, data: RegisterTransactionData): Promise<string> {
    const fileName = `receipt-${id}.json`

    const receiptContent = {
      transactionId: id,
      amount: data.amount,
      description: data.description,
      userId: data.userId,
      generatedAt: new Date().toISOString(),
      status: 'APPROVED',
    }

    // Usamos el proveedor de almacenamiento inyectado
    return await this.storageProvider.save(fileName, JSON.stringify(receiptContent, null, 2), 'receipts')
  }
}
