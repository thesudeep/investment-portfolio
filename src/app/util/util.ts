import * as moment from 'moment';

export function groupBy(key: string) {
  return function group(array: any) {
    return array.reduce((acc: any, obj: any) => {
      if (key === 'date') {
        const property = moment(obj[key]).format('MMM YYYY');
        acc[property] = acc[property] || [];
        acc[property].push(obj);

      } else {
        const property = obj[key];
        acc[property] = acc[property] || [];
        acc[property].push(obj);
      }
      return acc;

    }, {});
  };
}