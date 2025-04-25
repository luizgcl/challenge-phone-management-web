export function generateQueryString(params: Record<any, any>): string {
  let queryString = '';

  let counter = 0;
  for (let key in params) {
    if (params[key]) {
      queryString += `${key}=${params[key]}`;
      let paramsLength = Object.values(params).filter((value) => value).length;
      if (counter < paramsLength - 1) {
        queryString += `&`;
      }
      counter++;
    }
  }

  return queryString;
}
