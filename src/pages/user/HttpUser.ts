import ckHttp from "@/service";

const userInstance = ckHttp.getInstance()

function publicMethod(path:string, type:string, data?:any) {
    let result
    if ( type === 'get') {
        console.log('get User')
        result = userInstance.get(path).then(res => {
            console.log(res)
            return res
        })
    } else if (type === 'post' || type === 'put') {
        console.log('post添加、修改user')
        result = userInstance.post(path, data).then(res => {
            console.log(res)
            return res
        })
    } else if(type === 'delete') {
        console.log('delete user')
        result = userInstance.delete(path).then(res => {
            console.log(res)
            return res
        })
    }
    return result
}
// /user/query/{userId}&{pageNum}
export function HTTPGetUser(id:number) {
    return  publicMethod(`/api/user/query/${id}`, 'get')
}
export function HTTPAddUser(data:any) {
    return publicMethod('/api/user/add', 'post', data)
}
export function HTTPUpdataUser(data:any) {
    return publicMethod('/api/user/update','put',data)
}
export function HTTPDeleteUser(id:number) {
    return publicMethod(`/api/user/delete/${id}`,'delete')
}