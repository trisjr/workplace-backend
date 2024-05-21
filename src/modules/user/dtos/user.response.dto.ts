import { ResponseBase } from '@libs/api/response.base';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto extends ResponseBase {
  @ApiProperty({
    example: 'hungvo@tenomad.com',
    description: "User's email address",
  })
  email: string;

  @ApiProperty({
    example: 'Hung',
    description: 'First Name',
  })
  firstName: string;

  @ApiProperty({
    example: 'Vo',
    description: 'Last Name',
  })
  lastName: string;

  @ApiProperty({
    example: '+84123456789',
    description: 'Phone number',
  })
  phone: string;
}
