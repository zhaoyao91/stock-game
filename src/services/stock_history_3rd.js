import fetch from 'node-fetch';
import {get} from 'lodash';
import qs from 'qs';

import settings from '../settings';

let service = null;

export default async function () {
  if (!service) {
    service = {
      /**
       * fetch stock history data from 3rd service
       * the whole date range is 31 days
       * @private
       * @param code - stock
       * @param begin - YYYY-MM-DD
       * @param end - YYYY-MM-DD
       */
      async fetchHistory(code, begin, end) {
        const {stockHistory: {endPoint, apiCode}} = settings;

        const headers = {
          Authorization: `APPCODE ${apiCode}`
        };

        const args = {
          code,
          begin,
          end,
        };

        const query = qs.stringify(args);
        const fetchUrl = `${endPoint}?${query}`;

        const result = await fetch(fetchUrl, {headers});
        const jsonResult = await result.json();

        if (get(jsonResult, 'showapi_res_code') !== 0 || get(jsonResult, 'showapi_res_body.ret_code') !== 0) {
          throw new Error('failed to fetch data: ', JSON.stringify(jsonResult));
        }

        return get(jsonResult, 'showapi_res_body.list');
      },
    };
  }
  return service;
}