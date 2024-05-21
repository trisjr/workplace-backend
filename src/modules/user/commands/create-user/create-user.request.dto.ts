import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({
    example: 'hungvo@tenomad.com',
    description: 'User email address',
  })
  @MaxLength(320)
  @MinLength(5)
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'Hung', description: 'First Name' })
  @MaxLength(50)
  @IsString()
  @Matches(/^[a-zA-Z ]*$/)
  readonly firstName: string;

  @ApiProperty({ example: 'Vo', description: 'Last Name' })
  @MaxLength(50)
  @IsString()
  @Matches(/^[a-zA-Z ]*$/)
  readonly lastName: string;

  @ApiProperty({ example: '+84123456789', description: 'Phone number' })
  @IsPhoneNumber()
  readonly phone: string;

  @ApiProperty({ example: '********', description: 'Password' })
  @MaxLength(50)
  @MinLength(8)
  @IsString()
  readonly password: string;
}
