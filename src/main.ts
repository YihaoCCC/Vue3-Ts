import { createApp } from "vue";
import App from "./App.vue";

import router from './router'
import store from "./store";
import ckHttp from "./service";
import  setNavieUiComponents from "./plugins/navieui";


import 'animate.css';

// 测试axios
ckHttp.testHttp()
const app = createApp(App)

setNavieUiComponents(app)

app.use(router)
app.use(store)
app.mount("#app");
