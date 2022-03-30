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
// export function HTTPGetDepartment() {
//     return  publicMethod('/api/department/queryAll', 'get')
// }
export function HTTPAddSignIn(data:any) {
    return publicMethod('/api/signIn/add', 'post', data)
}

export function HTTPGetUserTask(id:string) {
    return  publicMethod(`/api/userTask/queryNoFinishByUserId/${id}`, 'get') 
}
// export function HTTPUpdataDepartMent(data:any) {
//     return publicMethod('/api/department/update','put',data)
// }
// export function HTTPDeleteDepartment(id:number) {
//     return publicMethod(`/api/department/delete/${id}`,'delete')
// }