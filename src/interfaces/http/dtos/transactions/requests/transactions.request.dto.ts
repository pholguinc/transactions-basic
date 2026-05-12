import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class RegisterTransactionRequestDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsNotEmpty()
  userId: string
}
