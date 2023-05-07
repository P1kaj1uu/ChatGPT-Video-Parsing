/*
 * @Description: 封装获取当前的时间的函数
 * @Author: 不见水星记（P1kaj1uu）
*/
export const getTime = () => {
  const now = new Date()
  // 获取当前年份，返回四位数字
  const year = now.getFullYear()
  // 获取当前月份，注意要加1
  const month = now.getMonth() + 1
  const day = now.getDate()
  // 获取当前小时数（00-23）
  const hour = now.getHours().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
  // 获取当前分钟数（00-59）
  const minute = now.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
  // 获取当前秒数（00-59）
  const second = now.getSeconds().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
  return `${year}/${month}/${day} ${hour}:${minute}:${second}`
}