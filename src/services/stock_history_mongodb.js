import {pick} from 'lodash';
import connectMongodb from './mongodb';

let service = null;

export default async function () {
  if (!service) {
    const mongodb = await connectMongodb();
    const collection = mongodb.collection('StockHistory');
    service = {
      /**
       * fill stock history data into db
       * @param records
       * @param force - default to false
       * @return result
       */
      async fillHistory(records, force = false) {
        if (force) {
          const operations = records.map(record => ({
            updateOne: {filter: pick(record, 'code', 'date'), update: {$set: record}, upsert: true}
          }));
          return await collection.bulkWrite(operations);
        }
        else {
          const operations = records.map(record => ({
            updateOne: {filter: pick(record, 'code', 'date'), update: {$setOnInsert: record}, upsert: true}
          }));
          return await collection.bulkWrite(operations);
        }
      },

      /**
       * find latest record date of specified stock code
       * @param code
       * @return date - YYYY-MM-DD
       */
      async getLatestRecordDate(code) {
        const record = await collection.findOne({code}, {sort: [['date', -1]], fields: {_id: 0, date: 1}});
        if (record) return record.date;
      },

      /**
       * get stock history records
       * @param code
       * @param begin - YYYY-MM-DD
       * @param end - YYYY-MM-DD
       * @return records
       */
      async getHistory(code, begin, end) {
        return await collection.find({code, date: {$gte: begin, $lte: end}}).sort([['date', 1]]).toArray();
      }
    }
  }
  return service;
}