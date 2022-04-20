import ckHttp from "@/service";

const userInstance = ckHttp.getInstance()

function publicMethod(path:string, type:string, data?:any) {
    let result
    if ( type === 'get') {
        result = userInstance.get(path).then(res => {
            return res
        })
    } else if (type === 'post') {
        result = userInstance.post(path, data).then(res => {
            return res
        })
    }else if (type === 'put') {
        result = userInstance.put(path, data).then(res => {
            return res
        })
    }else if(type === 'delete') {
        result = userInstance.delete(path).then(res => {
            return res
        })
    }
    return result
}
// /user/query/{userId}&{pageNum}
export function HTTPGetUser(id:string) {
    return  publicMethod(`/api/user/query/${id}`, 'get')
}
export function HTTPGetUserSelective(data:any) {
    return  publicMethod('/api/user/querySelective', 'post',data)
}
export function HTTPAddUser(data:any) {
    return publicMethod('/api/user/add', 'post', data)
}
export function HTTPUpdataUser(data:any) {
    return publicMethod('/api/user/update','put',data)
}
export function HTTPDeleteUser(id:string) {
    return publicMethod(`/api/user/delete/${id}`,'delete')
}
export function HTTPGetDepartment() {
    return  publicMethod('/api/department/queryUseAll', 'get')
}
export function HTTPGetPosition() {
    return publicMethod('/api/position/queryUseAll', 'get')
}