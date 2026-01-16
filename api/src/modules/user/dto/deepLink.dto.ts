import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class DeepLinkDto {
  @ApiProperty({
    description: 'deepLink',
  })
  @IsString()
  @IsUUID()
  deepLink: string;
}
