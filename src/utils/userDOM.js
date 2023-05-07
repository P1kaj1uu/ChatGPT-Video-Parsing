/*
 * @Description: 封装用户输入的内容的DOM结构
 * @Author: 不见水星记（P1kaj1uu）
*/
export const getUserDOM = (value, time) => {
  // 获取内容区域元素
  let content = document.querySelector('.chat-content')
  // 创建一段元素
  const chatWrapper = document.createElement('div')
  chatWrapper.className = 'chat-wrapper'
  chatWrapper.style.height = '0px'
  const chatMe = document.createElement('div')
  chatMe.className = 'chat-me'
  chatMe.style.width = '100%'
  chatMe.style.float = 'right'
  chatMe.style.marginBottom = '20px'
  chatMe.style.position = 'relative'
  chatMe.style.display = 'flex'
  chatMe.style.flexDirection = 'column'
  chatMe.style.justifyContent = 'flex-end'
  chatMe.style.alignItems = 'flex-end'
  const chatText = document.createElement('div')
  chatText.className = 'chat-text'
  chatText.style.float = 'right'
  chatText.style.maxWidth = '90%'
  chatText.style.padding = '15px'
  chatText.style.borderRadius = '20px 20px 5px 20px'
  chatText.style.backgroundColor = '#95ec69'
  chatText.style.color = '#000'
  chatText.style.wordBreak = 'break-all'
  const textSpan = document.createElement('span')
  textSpan.style.fontSize = '16px'
  textSpan.textContent = value
  const infoTime = document.createElement('div')
  infoTime.className = 'info-time'
  infoTime.style.margin = '10px 0'
  infoTime.style.color = '#fff'
  infoTime.style.fontSize = '14px'
  infoTime.style.display = 'flex'
  infoTime.style.justifyContent = 'flex-end'
  infoTime.style.alignItems = 'center'
  const nameSpan = document.createElement('span')
  nameSpan.textContent = '权志龙的小迷弟'
  nameSpan.style.color = 'rgb(101, 104, 115)'
  nameSpan.style.marginRight = '10px'
  nameSpan.style.verticalAlign = 'middle'
  nameSpan.style.height = '30px'
  nameSpan.style.lineHeight = '30px'
  const timeSpan = document.createElement('span')
  timeSpan.textContent = time
  timeSpan.style.lineHeight = '30px'
  const imgElem = document.createElement('img')
  imgElem.src = require('@/assets/images/gpt/user.jpg')
  imgElem.style.width = '30px'
  imgElem.style.height = '30px'
  imgElem.style.borderRadius = '50%'
  imgElem.style.verticalAlign = 'middle'
  imgElem.style.marginLeft = '10px'
  // 将元素添加到父元素中
  chatText.appendChild(textSpan)
  infoTime.appendChild(nameSpan)
  infoTime.appendChild(timeSpan)
  infoTime.appendChild(imgElem)
  chatMe.appendChild(chatText)
  chatMe.appendChild(infoTime)
  chatWrapper.appendChild(chatMe)
  // 追加到DOM中
  content.appendChild(chatWrapper)
}