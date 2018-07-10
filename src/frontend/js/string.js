/**
 * 
 * @param {str} str - string to be converted to object
 */
export function strToObj(str) {
  let parts = str.split(":");
  let key = parts[0].trim();
  let obj = {}
  obj[key] = parts[1].trim();
  return `${JSON.stringify(obj)},`;
}

/**
 * 
 * @param {obj} obj - obj to be converted to string
 */ 
export function objToStr(obj) {
  let key = Object.keys(obj)[0]
  let value = obj[key];
  return `${key}: ${value}`
}
