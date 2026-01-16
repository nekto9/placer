import { ApiProperty } from '@nestjs/swagger';
import { GameUserStatus } from '@/prismaClient';

/**
 * Метаданные для игры
 */
export class GameMetaDto {
  @ApiProperty({ description: 'Права на редактирование' })
  canEdit: boolean;

  @ApiProperty({ description: 'Права на участие' })
  canJoin: boolean;

  @ApiProperty({ description: 'Текущий юзер в списке участников' })
  isMember: boolean;

  @ApiProperty({
    description: 'Статус участника',
    enum: GameUserStatus,
    enumName: 'GameUserStatus',
  })
  memberStatus: GameUserStatus;
}
