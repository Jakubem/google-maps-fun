/**
 * this function will convert formatted string into object
 * @param {str} str - string to be converted to object
 */
export function strToObj(str) {
  const textAreaLines = str.split(',\n');
  let splittedLines = textAreaLines.map((el) => {
    const parts = el.split(":");
    let key = parts[0].trim();
    let val = parts[1].trim();
    return `"${key}": "${val}"`;
  });
  return JSON.parse(`{${splittedLines}}`);
}

/**
 * this function will convert object to formatted string
 * @param {obj} obj - obj to be converted to string
 */ 
export function objToStr(obj) {
  const keys = Object.keys(obj);
  const lines = keys.map(el => `${el}: ${obj[el]}`);
  const linesJoined = lines.join(',\n');
  return linesJoined;
}
