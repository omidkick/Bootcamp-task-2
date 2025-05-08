export default function truncateToLastDigits(num, digits = 2) {
  const str = String(num);
  if (str.length <= digits) return num;
  return Number(str.slice(-digits));
}
