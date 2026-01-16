import { useEffect, useState } from 'react';
import { dateTime } from '@gravity-ui/date-utils';

interface CountdownTimerProps {
  date: string;
}

export const CountdownTimer = (props: CountdownTimerProps) => {
  // const startDate = dateTime({ input: props.date });

  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const targetDate = dateTime({ input: props.date }).toDate();
    targetDate.setMinutes(targetDate.getMinutes() + 15); // Добавляем 15 минут

    const timer = setInterval(() => {
      const now = new Date();
      const difference = +targetDate - +now;

      if (difference <= 0) {
        setTimeLeft('00:00');
        clearInterval(timer);
      } else {
        const minutes = Math.floor(difference / 1000 / 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(
          `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }
    }, 1000);

    // Очистка интервала при размонтировании
    return () => clearInterval(timer);
  }, [props.date]);

  return (
    <div>
      <h3>Осталось времени:</h3>
      <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{timeLeft}</p>
    </div>
  );
};
