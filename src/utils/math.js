export const sumBy = (arr, fn) => arr.reduce((a, x)=>a + (fn(x)||0), 0);
