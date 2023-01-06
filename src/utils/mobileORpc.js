/*
 * @Description: 判断是否为移动端设备
 * @Author: 不见水星记（P1kaj1uu）
 */
// 封装判断是否为移动端设备
export const isMobile = () => {
    const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
    return flag
}