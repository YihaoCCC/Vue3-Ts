import CKhttp from "./service";
import { TIME_OUT } from "./config";


 const ckHttp = new CKhttp({
    // baseURL: BASE_URL,
    timeout: TIME_OUT,
    timeoutErrorMessage: '第一个柴渴请求传输链接超时5s'
})

export default ckHttp