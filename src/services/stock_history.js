import {flatten, max, isEmpty} from 'lodash';
import moment from 'moment';

import settings from '../settings';
import dateUtils from '../utils/date';
import getStockHistory3rdService from './stock_history_3rd';
import getStockHistoryMongodbService from './stock_history_mongodb';

let service = null;

export default async function () {
  if (!service) {
    const _3rdService = await getStockHistory3rdService();
    const _mongodbService = await getStockHistoryMongodbService();
    service = {
      /**
       * fetch stock history data from 3rd service
       * @param code - stock
       * @param begin - YYYY-MM-DD
       * @param end - YYYY-MM-DD
       * @return records
       */
      async fetchHistory(code, begin, end) {
        const {stockHistory: {maxStep}} = settings;
        const ranges = dateUtils.splitDateRange(begin, end, maxStep);
        return flatten(await Promise.all(ranges.map(range => _3rdService.fetchHistory(code, ...range))));
      },

      /**
       * fill stock data into data base
       * @param code - stock
       * @return insertedCount
       */
      async fillHistory(code) {
        const {stockHistory: {veryBeginning}} = settings;
        const format = 'YYYY-MM-DD';
        const today = moment().format(format);
        const latestRecordDate = await _mongodbService.getLatestRecordDate(code);
        const latestRecordNextDay = latestRecordDate && moment(latestRecordDate).add(1, 'days').format(format);
        const begin = max([veryBeginning, latestRecordNextDay]);

        const records = await service.fetchHistory(code, begin, today);
        if (isEmpty(records)) return 0;
        const result = await _mongodbService.fillHistory(records);
        return result.upsertedCount;
      },

      /**
       * get stock history records
       * @param code
       * @param [begin] - YYYY-MM-DD, default to very beginning
       * @param [end] - YYYY-MM-DD, default to today
       * @return records
       */
      async getHistory(code, begin, end) {
        begin = begin || settings.stockHistory.veryBeginning;
        end = end || moment().format('YYYY-MM-DD');
        return await _mongodbService.getHistory(code, begin, end);
      }
    };
  }
  return service;
}