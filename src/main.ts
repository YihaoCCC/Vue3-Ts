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
ckHttp.testHttp()
const app = createApp(App)

app.config.globalProperties.$ckHttp = ckHttp

app.config.globalProperties.isAuth = function (tag:string) {
    let flag = true
    console.log(tag)
    const result = ['USER:UPDATE','USER:SELECT']
    let item
    for ( item of result ) {
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
