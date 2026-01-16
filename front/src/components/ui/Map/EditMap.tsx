import { useEffect, useRef } from 'react';
import { connectScript } from '@/tools/scriptTools';
import { buildUrl } from '@/tools/utils/fetchUrl';
import { MapPoint } from './types';

const YANDEX_MAPS_API_KEY = '1254ae24-4f80-4784-9792-c3d1870cd4f4';

const getPoint = async (query: string) => {
  try {
    const geocoderUrl = buildUrl('https://geocode-maps.yandex.ru/1.x/', {
      apikey: YANDEX_MAPS_API_KEY,
      geocode: query,
      format: 'json',
    });
    const result = await (await fetch(geocoderUrl)).json();

    const geoPoint =
      result.response.GeoObjectCollection.featureMember[0].GeoObject;
    const pos = geoPoint.Point.pos.split(' ');
    return pos.map(Number).reverse();
  } catch {
    throw new Error('Невозможно получить координаты');
  }
};

const setMapPoint = (
  map: ymaps.Map,
  position: number[],
  onChange: (point: MapPoint) => void
) => {
  const placemark = new window.ymaps.GeoObject(
    {
      geometry: {
        type: 'Point',
        // @ts-expect-error ts(2322)
        coordinates: position,
      },
    },
    {
      preset: 'islands#icon',
      iconColor: '#ff0000',
      draggable: true,
    }
  );

  map.geoObjects.add(placemark);

  placemark.events.add('dragend', () => {
    // @ts-expect-error ts(2339)
    const coords = placemark.geometry.getCoordinates();
    onChange({ latitude: coords[0], longitude: coords[1] });
  });

  return placemark;
};

interface EditMapProps {
  point?: MapPoint;
  onChange: (position: MapPoint) => void;
  city?: string;
}

/** Редактирование гео-точки с расположением площадки */
export const EditMap = (props: EditMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapIsInit = useRef(false);

  const initMap = () => {
    // Проверяем, что карта ещё не инициализирована
    if (mapIsInit.current) return;
    mapIsInit.current = true;

    if (!mapRef.current || !window.ymaps) return;

    window.ymaps.ready(async () => {
      let position = props.point && [
        props.point.latitude,
        props.point.longitude,
      ];

      try {
        if (!position) position = await getPoint(props.city || '');

        const map = new window.ymaps.Map(
          mapRef.current!,
          {
            center: position,
            zoom: 16,
            controls: ['zoomControl'],
          },
          {
            maxZoom: 16,
          }
        );

        const placemark = setMapPoint(map, position, props.onChange);

        map.events.add('click', (e) => {
          const coords = e.get('coords');

          // @ts-expect-error ts(2339)
          placemark.geometry.setCoordinates(coords);
          props.onChange({ latitude: coords[0], longitude: coords[1] });
        });
      } catch (e) {
        console.error(e);
      }
    });
  };

  useEffect(() => {
    if (window.ymaps) {
      initMap();
      return;
    }

    connectScript({
      src: `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_MAPS_API_KEY}&lang=ru_RU`,
      id: 'yandex-map-script',
      onload: initMap,
    });
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: 300 }} />;
};
