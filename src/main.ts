import { createApp } from "vue";
import App from "./App.vue";

import router from './router'
import store from "./store";
import ckHttp from "./service";
import  setNavieUiComponents from "./plugins/navieui";
import { useElementPlus } from "./plugins/elementplus";
import 'element-plus/dist/index.css'
import 'animate.css';

// 测试axios
// ckHttp.testHttp()
const app = createApp(App)

// 取消全局挂载，在CKhttp的实例中写一个 getinstance的方法把axios实例返回出去，供外部调用get等方法
// app.config.globalProperties.$ckHttp = ckHttp


app.config.globalProperties.isAuthPer = function (tag:string) {
    let flag = true
    const permisson:any = localStorage.getItem('permission')
    const permissionAaary = permisson.split(',') 
   
    for (const item of permissionAaary ) { 
        if(item === tag) {
            flag = false
            break
        }
    }
    return flag
}

app.config.globalProperties.isAuth = function (tag:string) {
    let flag = true
    const menu:any = localStorage.getItem('MENU')
    const menuArray = menu.split(',')
   
    for (const item of menuArray ) { 
        if(item === tag) {
            flag = false
            break
        }
    }
    return flag
}

setNavieUiComponents(app)
useElementPlus(app)
app.use(router)
app.use(store)
app.mount("#app");
