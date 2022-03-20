import axios from "axios";
import { AxiosInstance, AxiosRequestConfig } from "axios";

class CKhttp {
    instance: AxiosInstance
    constructor(config:AxiosRequestConfig) {
        this.instance = axios.create(config)
        
        this.instance.interceptors.response.use((res) => {
            console.log('实例响应')
            return res.data
        },
        (err) => {
            // if( err.response.status = 404) {
            //     console.log('请求服务器失败')
            // } else {
            //     console.log('请求服务器失败')
            // }
            console.log('请求服务器失败')
            return new Promise(err)
        }
        )
    }
    getInstance() {
        return this.instance
    }
}

export default CKhttp