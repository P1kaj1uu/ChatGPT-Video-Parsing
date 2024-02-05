/*
 * @Description: 封装整理使用的element-ui插件
 * @Author: 不见水星记（P1kaj1uu）
 */
import Vue from 'vue'
import {
    Button,
    Container,
    Header,
    Aside,
    Main,
    Footer,
    Menu,
    MenuItem,
    Submenu,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Dialog,
    Form,
    FormItem,
    Select,
    Option,
    Input,
    Notification,
    Message,
    MessageBox,
    Tooltip,
    Loading,
    Backtop,
    Image,
    Slider
  } from 'element-ui'
  
  Vue.use(Button)
  Vue.use(Container)
  Vue.use(Header)
  Vue.use(Aside)
  Vue.use(Main)
  Vue.use(Footer)
  Vue.use(Menu)
  Vue.use(MenuItem)
  Vue.use(Submenu)
  Vue.use(Breadcrumb)
  Vue.use(BreadcrumbItem)
  Vue.use(Card)
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Dialog)
  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Select)
  Vue.use(Option)
  Vue.use(Input)
  Vue.use(Tooltip)
  Vue.use(Backtop)
  Vue.use(Image)
  Vue.use(Slider)

  Vue.prototype.$notify = Notification
  Vue.prototype.$message = Message
  Vue.prototype.$msgbox = MessageBox
  Vue.prototype.$confirm = MessageBox.confirm
  Vue.prototype.$prompt = MessageBox.prompt
  Vue.prototype.$loading = Loading.service