import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { RoutesList } from '@/router/routesList';
import { useGameWebSocket } from '@/store/gameWebSocket';
import { useSetPageData } from '@/tools/hooks';
import { GridSchedule } from './components/GridSchedule';

export const PlaceSlotsPage = () => {
  const { placeId } = useParams();
  const [refreshToken, setRefreshToken] = useState(0);

  useSetPageData({
    title: 'Расписания',
    backLink: RoutesList.Place.getPlaceDetails(placeId),
  });

  const {
    connected,
    subscribeToPlace,
    unsubscribeFromPlace,
    onEvent,
    offEvent,
  } = useGameWebSocket({
    url: process.env.REACT_APP_WS_URL || 'http://localhost:3000',
    autoConnect: true,
  });

  useEffect(() => {
    if (connected && placeId) {
      subscribeToPlace(placeId);
    }

    return () => {
      if (placeId) {
        unsubscribeFromPlace(placeId);
      }
    };
  }, [connected, placeId, subscribeToPlace, unsubscribeFromPlace]);

  useEffect(() => {
    const handleGameEvent = () => {
      setRefreshToken((value) => value + 1);
    };

    onEvent('game:reserved', handleGameEvent);
    onEvent('game:released', handleGameEvent);
    onEvent('game:updated', handleGameEvent);

    return () => {
      offEvent('game:reserved', handleGameEvent);
      offEvent('game:released', handleGameEvent);
      offEvent('game:updated', handleGameEvent);
    };
  }, [offEvent, onEvent]);

  return <GridSchedule placeId={placeId} refreshToken={refreshToken} />;
};
