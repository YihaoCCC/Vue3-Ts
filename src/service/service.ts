import axios from "axios";
import { AxiosInstance, AxiosRequestConfig } from "axios";
import router  from '../router'
import { ElMessage } from "element-plus";



class CKhttp {
    instance: AxiosInstance
    constructor(config:AxiosRequestConfig) {
        this.instance = axios.create(config)
        this.instance.interceptors.request.use((config:any) => {
            const token  = localStorage.getItem('token')
            if(token) {
                config.headers.token = token
            }
            return config
        })
        this.instance.interceptors.response.use((res:any) => {
            console.log('实例响应')     
            if( res.data.code === 401 ) {
                localStorage.clear()
                router.push('/login')
                ElMessage.error(res.data.message)
            } else {
                return res.data
            }
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