export default (number) => {
  if (number > 1024 * 1024 * 1024) {
    return `${Math.floor(number / (1024 * 1024 * 1024))}GB`;
  } else if (number > 1024 * 1024) {
    return `${Math.floor(number / (1024 * 1024))}MB`;
  } else if (number > 1024) {
    return `${Math.floor(number / (1024))}KB`;
  } else {
    return `${number}B`;
  }
};