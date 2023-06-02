/*
 * @Description: 检测是否版本更新
 * @Author: 不见水星记（P1kaj1uu）
*/
import { sleep } from '@/utils/sleep'

async function check() {
  const res = await fetch(`${location.origin}${location.pathname}?stamp=${Date.now()}`)
  const text = await res.text() // 服务器最新的 html
  const new_hash = text.match(/src="(.*)index(.*).js"><\/script>/)[2]
  const current_hash = document.getElementsByTagName('script')[0].src.match(/index(.*).js/)[1] // 当前hash
  if (new_hash !== current_hash) {
    confirm('有新版本发布, 是否更新？') && location.reload()
  }
}
function checkUpdate () {
  sleep(6000).then(() => {
    check()
  })
}
export default checkUpdate