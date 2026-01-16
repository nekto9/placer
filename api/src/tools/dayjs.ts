/**
 * Настроенный экземпляр Day.js с дополнительными плагинами
 *
 * Этот модуль предоставляет предварительно настроенный экземпляр Day.js
 * с подключенными плагинами для работы с ISO неделями.
 *
 * @module dayjs
 * @description Настроенный Day.js для работы с датами в приложении
 *
 *
 */

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

// Подключение плагина для работы с ISO неделями
// Позволяет использовать методы isoWeekday(), startOf('isoWeek'), endOf('isoWeek')
dayjs.extend(isoWeek);

/**
 * Экспорт настроенного экземпляра Day.js
 *
 * @default dayjs
 * @description Day.js с подключенными плагинами для работы с ISO неделями
 */
export default dayjs;
