export const formatNumber = (number) => {
  return (+number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') // 12,345.67
}
