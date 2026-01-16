import { useEffect, useRef } from 'react';
import { connectScript } from '@/tools/scriptTools';
import { MapPoint } from './types';

interface ViewMapProps {
  point?: MapPoint;
  text?: string;
  className?: string;
}

const YANDEX_MAPS_API_KEY = '1254ae24-4f80-4784-9792-c3d1870cd4f4';

/** Отображение гео-точки с расположением площадки */
export const ViewMap = (props: ViewMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapIsInit = useRef(false);

  const initMap = () => {
    // Проверяем, что карта ещё не инициализирована
    if (mapIsInit.current) return;
    mapIsInit.current = true;

    if (!mapRef.current || !window.ymaps) return;

    window.ymaps.ready(() => {
      const map = new window.ymaps.Map(
        mapRef.current!,
        {
          center: props.point
            ? [props.point.latitude, props.point.longitude]
            : [59.127507, 37.902208],
          zoom: 16,
          controls: ['zoomControl'],
        },
        {
          maxZoom: 16,
        }
      );

      // Добавление метки
      if (props.point) {
        const placemark = new window.ymaps.Placemark(
          [props.point.latitude, props.point.longitude],
          { balloonContent: props.text },
          { preset: 'islands#redDotIcon' }
        );

        map.geoObjects.add(placemark);

        map.behaviors.disable('scrollZoom');
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

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: 300 }}
      className={props.className}
    />
  );
};
