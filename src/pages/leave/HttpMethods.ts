import ckHttp from "../../service";

const instance = ckHttp.getInstance()

function publicMethod(path:string, type:string, data?:any) {
    let result
    if ( type === 'get') {
        result = instance.get(path).then(res => {
            return res
        })
    } else if (type === 'post') {
        result = instance.post(path, data).then(res => {
            return res
        })
    }else if (type === 'put') {
        result = instance.put(path, data).then(res => {
            return res
        })
    }
     else if(type === 'delete') {
        result = instance.delete(path).then(res => {
            return res
        })
    }
    return result
}
export function HTTPGetLeave(id:string) {
    return  publicMethod(`/api/leave/query/${id}`, 'get') 
}
export function HTTPAddLeave(data:any) {
    return publicMethod('/api/leave/add', 'post', data)
}
export function HTTPGetLeaveRequest(id:string) {
    return  publicMethod(`/api/leave/queryUnapproved/${id}`, 'get') 
}
export function HTTPUpdataLeaveRequest(data:any) {
    return publicMethod('/api/leave/update','put',data)
}


