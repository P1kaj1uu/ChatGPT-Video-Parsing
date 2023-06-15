/*
 * @Description: 封装操作token的函数
 * @Author: 不见水星记（P1kaj1uu）
*/
const key = 'WEBS_TOKEN'

// 设置token
export const setToken = (token) => localStorage.setItem(key, token)

// 获取token
export const getToken = () => localStorage.getItem(key)

// 移除token
export const removeToken = () => localStorage.removeItem(key)