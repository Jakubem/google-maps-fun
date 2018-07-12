/**
 * 
 * @param {str} str - string to be converted to object (supports multiline)
 */
export function strToObj(str) {
  let textAreaLines = str.split(',\n');
  let splittedLines = textAreaLines.map((el) => {
    let parts = el.split(":");
    let key = parts[0].trim();
    let val = parts[1].trim();
    return `"${key}": "${val}"`;
  });
  return `{${splittedLines}},`;
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
