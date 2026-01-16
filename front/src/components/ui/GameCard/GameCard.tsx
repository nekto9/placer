import { CircleRuble } from '@gravity-ui/icons';
import { Card, Flex, Icon, Label, Text } from '@gravity-ui/uikit';
import { GameResponseDto } from '@/store/api';
import { timeConvertToFormattedString } from '@/tools/dateTools';
import { MemberStatus } from './components/MemberStatus';
import { UsersStatInfo } from './components/UsersStatInfo';
import {
  formatDate,
  getGameLevelLabel,
  getRequestModeLabel,
  weekdayDate,
} from './utils';

interface GameCardProps {
  game: GameResponseDto;

  isShort?: boolean;

  /** Информация об игре */
  onDetailsClick?: (id: string) => void;
}

export const GameCard = (props: GameCardProps) => {
  const gameLevelLabel = getGameLevelLabel(props.game.level);
  const gameModeLabel = getRequestModeLabel(props.game.requestMode);

  return (
    <Card
      className="g-s__py_3 g-s__px_4 g-s__mb_2"
      type="action"
      view="outlined"
      theme="normal"
      onClick={
        props.onDetailsClick
          ? () => props.onDetailsClick(props.game.id)
          : undefined
      }
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text variant="subheader-2">{props.game.place.name}</Text>
        {!props.game.place.isFree && <Icon data={CircleRuble} />}
      </Flex>

      <Flex gapRow={2} gap={4} wrap className="g-s__mt_2">
        <Flex direction="column" gap={1}>
          <Text variant="caption-2" className="text--capitalize">
            {weekdayDate(props.game.date)}
          </Text>
          <Text>{formatDate(props.game.date)}</Text>
        </Flex>

        <Flex direction="column" gap={1}>
          <Text variant="caption-2" color="secondary">
            Время
          </Text>
          <Text>
            {timeConvertToFormattedString(props.game.timeStart)} -{' '}
            {timeConvertToFormattedString(props.game.timeEnd)}
          </Text>
        </Flex>

        {!!props.game.sport && (
          <Flex direction="column" gap={1}>
            <Text variant="caption-2" color="secondary">
              Спорт
            </Text>
            <Text>{props.game.sport.name}</Text>
          </Flex>
        )}

        <Flex direction="column" gap={1}>
          <Text variant="caption-2" color="secondary">
            Уровень
          </Text>
          <Label theme={gameLevelLabel.theme}>{gameLevelLabel.text}</Label>
        </Flex>

        {!props.isShort && (
          <MemberStatus memberStatus={props.game.meta?.memberStatus} />
        )}

        <Flex direction="column" gap={1}>
          <Text variant="caption-2" color="secondary">
            Режим
          </Text>
          <Label theme={gameModeLabel.theme}>{gameModeLabel.text}</Label>
        </Flex>
      </Flex>
      {props.game.meta.canEdit && <UsersStatInfo game={props.game} />}
    </Card>
  );
};
