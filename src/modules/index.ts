export function kmbtFormatter(number: number) {
  if (number >= 1e12) {
    return (number / 1e12).toFixed(1).replace(/\.0$/, "") + "tr";
  } else if (number >= 1e9) {
    return (number / 1e9).toFixed(1).replace(/\.0$/, "") + "my";
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(1).replace(/\.0$/, "") + "jt";
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(1).replace(/\.0$/, "") + "rb";
  } else {
    return number.toString();
  }
}
export function thousandSeparator(number: number): string {
  if (isNaN(number)) {
    return number.toString();
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
export function numberItemListFormatter(
  index: number,
  page: number,
  item: number
) {
  const num_value = (page - 1) * item + 1;
  return thousandSeparator(num_value + index);
}
export function dataCountFormatter(
  page: number,
  item: number,
  count: number,
  showed: number
): string {
  if (showed > 0) {
    const value = item * page;
    return `${thousandSeparator((page - 1) * item + 1)} - ${
      value <= count ? thousandSeparator(value) : thousandSeparator(count)
    } dari ${thousandSeparator(count)} Data`;
  }
  return "0 - 0 dari 0 Data";
}
export function setPaginationLength(item: number, data_length: number): number {
  if (data_length == 0) {
    return 1;
  }
  return Math.ceil(data_length / item);
}
