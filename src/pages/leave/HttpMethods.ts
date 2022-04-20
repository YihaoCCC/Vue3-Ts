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
export function HTTPGetLeaveSelective(data:any) {
    return  publicMethod('/api/leave/querySelective', 'post',data) 
}
export function HTTPAddLeave(data:any) {
    return publicMethod('/api/leave/add', 'post', data)
}
export function HTTPGetLeaveRequest(id:string) {
    return  publicMethod(`/api/leave/queryUnapproved/${id}`, 'get') 
}
export function HTTPGetLeaveRequestSelective(data:any) {
    return  publicMethod('/api/leave/queryUnapprovedSelective', 'post',data) 
}
export function HTTPUpdataLeaveRequest(id:number) {
    return publicMethod(`/api/leave/update/${id}`,'put')
}
export function HTTPGetDepartment() {
    return  publicMethod('/api/department/queryUseAll', 'get')
}


