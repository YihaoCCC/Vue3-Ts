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
export function HTTPGetDepartment() {
    return  publicMethod('/api/department/queryUseAll', 'get')
}
export function HTTPGetDeptAward(data:any) {
    return  publicMethod('/api/jiangcheng/queryDept', 'post',data)
}
export function HTTPGetUserSign(data:any) {
    return  publicMethod('/api/signIn/querySign', 'post',data)
}
