import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserRequestDto {
  @ApiProperty({
    example: 'hungvo@tenomad.com',
    description: 'User email address',
  })
  @MaxLength(320)
  @MinLength(5)
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '********', description: 'Password' })
  @MaxLength(50)
  @MinLength(8)
  @IsString()
  readonly password: string;
}
