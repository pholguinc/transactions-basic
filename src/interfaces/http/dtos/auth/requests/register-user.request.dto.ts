import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class RegisterUserRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(9)
  phone: string

  @MinLength(6)
  @IsNotEmpty()
  passwordHash: string
}
