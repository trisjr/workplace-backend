import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString, Matches, MaxLength } from 'class-validator';

export class FindUsersRequestDto {
  @ApiProperty({ example: 'Hung', description: 'First Name' })
  @IsOptional()
  @MaxLength(50)
  @IsString()
  @Matches(/^[a-zA-Z ]*$/)
  readonly firstName?: string;

  @ApiProperty({ example: 'Vo', description: 'Last Name' })
  @IsOptional()
  @MaxLength(50)
  @IsString()
  @Matches(/^[a-zA-Z ]*$/)
  readonly lastName?: string;

  @ApiProperty({ example: '+84123456789', description: 'Phone Number' })
  @IsOptional()
  @IsPhoneNumber()
  readonly phone?: string;
}
