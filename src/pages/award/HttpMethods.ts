import ckHttp from "../../service";

const instance = ckHttp.getInstance()

function publicMethod(path:string, type:string, data?:any) {
    let result
    if ( type === 'get') {
        result = instance.get(path).then(res => {
            console.log(res)
            return res
        })
    } else if (type === 'post') {
        result = instance.post(path, data).then(res => {
            console.log(res)
            return res
        })
    }else if (type === 'put') {
        result = instance.put(path, data).then(res => {
            console.log(res)
            return res
        })
    }
     else if(type === 'delete') {
        result = instance.delete(path).then(res => {
            console.log(res)
            return res
        })
    }
    return result
}
export function HTTPGetRecordAward(id:string) {
    return  publicMethod(`/api/jiangcheng/query/${id}`, 'get') 
}
export function HTTPAddRecordAward(data:any) {
    return publicMethod('/api/jiangcheng/add', 'post', data)
}
export function HTTPGetInstitution() {
    return  publicMethod('/api/jiangchengSystem/queryAll', 'get') 
}
export function HTTPAddInstitution(data:any) {
    return publicMethod('/api/jiangchengSystem/add', 'post', data)
}
export function HTTPUpdataInstitution(data:any) {
    return publicMethod('/api/department/update','put',data)
}


