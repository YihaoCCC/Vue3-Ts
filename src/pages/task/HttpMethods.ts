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
export function HTTPGetTask(id:string) {
    return  publicMethod(`/api/task/query/${id}`, 'get') 
}
export function HTTPAddTask(data:any) {
    return publicMethod('/api/task/add', 'post', data)
}
export function HTTPUpdateTask(data:any) {
    return publicMethod('/api/task/update', 'piut', data)
}

export function HTTPGetTaskSubmit(id:string) {
    return  publicMethod(`/api/userTask/queryByUserId/${id}`, 'get') 
}
export function HTTPUpdateTaskSubmit(data:any) {
    return publicMethod('/api/userTask/update','put',data)
}


