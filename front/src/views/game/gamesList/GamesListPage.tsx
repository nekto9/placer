import { useNavigate } from 'react-router';
import { Button } from '@gravity-ui/uikit';
import { RoutesList } from '@/router/routesList';
import { GameTimeFrame } from '@/store/api';
import { useSetPageData } from '@/tools/hooks';
import { PersonalGamesList } from './components/PersonalGamesList';
import { PublicGamesList } from './components/PublicGamesList';

interface GamesListPageProps {
  timeFrame?: GameTimeFrame;
  isPersonal?: boolean;
}

/** Страница списка игр */
export const GamesListPage = (props: GamesListPageProps) => {
  const navigate = useNavigate();

  const personalClickHandler = () => {
    navigate(
      props.timeFrame === GameTimeFrame.All
        ? RoutesList.Game.getPersonalAllGamesList()
        : props.timeFrame === GameTimeFrame.Past
          ? RoutesList.Game.getPersonalPastGamesList()
          : RoutesList.Game.getPersonalGamesList()
    );
  };

  const publicClickHandler = () => {
    navigate(
      props.timeFrame === GameTimeFrame.All
        ? RoutesList.Game.getAllGamesList()
        : props.timeFrame === GameTimeFrame.Past
          ? RoutesList.Game.getPastGamesList()
          : RoutesList.Game.getGamesList()
    );
  };

  const upcomingClickHandler = () => {
    navigate(
      props.isPersonal
        ? RoutesList.Game.getPersonalGamesList()
        : RoutesList.Game.getGamesList()
    );
  };

  const pastClickHandler = () => {
    navigate(
      props.isPersonal
        ? RoutesList.Game.getPersonalPastGamesList()
        : RoutesList.Game.getPastGamesList()
    );
  };

  const allClickHandler = () => {
    navigate(
      props.isPersonal
        ? RoutesList.Game.getPersonalAllGamesList()
        : RoutesList.Game.getAllGamesList()
    );
  };

  useSetPageData({ title: 'Игры' });

  return (
    <div>
      <div className="g-s__py_4">
        <Button
          view="normal"
          onClick={personalClickHandler}
          size="l"
          selected={props.isPersonal}
          pin="circle-clear"
        >
          Мои
        </Button>
        <Button
          view="normal"
          onClick={publicClickHandler}
          selected={!props.isPersonal}
          size="l"
          pin="clear-circle"
        >
          Все
        </Button>
      </div>
      <div className="g-s__py_4">
        <Button
          view="normal"
          onClick={upcomingClickHandler}
          size="l"
          selected={!props.timeFrame}
          pin="circle-clear"
        >
          Ближайшие
        </Button>
        <Button
          view="normal"
          onClick={pastClickHandler}
          size="l"
          selected={props.timeFrame === GameTimeFrame.Past}
          pin="clear-clear"
        >
          Завершенные
        </Button>
        <Button
          view="normal"
          onClick={allClickHandler}
          selected={props.timeFrame === GameTimeFrame.All}
          size="l"
          pin="clear-circle"
        >
          Все
        </Button>
      </div>

      {props.isPersonal ? (
        <PersonalGamesList timeFrame={props.timeFrame} />
      ) : (
        <PublicGamesList timeFrame={props.timeFrame} />
      )}
    </div>
  );
};
