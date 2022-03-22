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
export function HTTPGetMessage() {
    return  publicMethod('/api/message/queryAll', 'get')
}
export function HTTPAddMessage(data:any) {
    return publicMethod('/api/message/add', 'post', data)
}
export function HTTPDeleteMessage(id:number) {
    return publicMethod(`/api/message/delete/${id}`,'delete')
}