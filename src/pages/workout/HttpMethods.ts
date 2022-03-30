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
export function HTTPGetWorkOut(id:string) {
    return  publicMethod(`/api/travel/query/${id}`, 'get') 
}
export function HTTPAddWorkOut(data:any) {
    return publicMethod('/api/travel/add', 'post', data)
}
export function HTTPGetWorkOutRequest(id:string) {
    return  publicMethod(`/api/travel/queryUnapproved/${id}`, 'get') 
}
export function HTTPUpdataWorkOutRequest(id:number) {
    return publicMethod(`/api/travel/update/${id}`,'put')
}


