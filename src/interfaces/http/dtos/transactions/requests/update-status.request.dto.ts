import { IsEnum, IsNotEmpty } from 'class-validator'

export enum TransactionStatus {
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class UpdateTransactionStatusDto {
  @IsEnum(TransactionStatus, {
    message: 'El estado debe ser PROCESSING, APPROVED o REJECTED',
  })
  @IsNotEmpty()
  status: TransactionStatus
}
