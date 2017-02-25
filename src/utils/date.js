import moment from 'moment';

export default {
  /**
   * split a date range into small pieces by step
   * @param begin - YYYY-MM-DD
   * @param end - YYYY-MM-DD
   * @param step - step of days, > 0
   * @return ranges - [[begin, end]]
   */
  splitDateRange(begin, end, step) {
    const beginDate = moment(begin);
    const endDate = moment(end);
    if (!beginDate.isValid() || !endDate.isValid() || beginDate.isAfter(endDate)) {
      throw new Error('invalid date range');
    }

    const format = 'YYYY-MM-DD';
    const ranges = [];
    while (!beginDate.isAfter(endDate)) {
      const beginDateString = beginDate.format(format);
      beginDate.add(step - 1, 'days');
      const minDate = moment.min(beginDate, endDate);
      const endDateString = minDate.format(format);
      ranges.push([beginDateString, endDateString]);
      beginDate.add(1, 'days');
    }
    return ranges;
  }
}