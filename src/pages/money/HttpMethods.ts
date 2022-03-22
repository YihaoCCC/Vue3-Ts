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
export function HTTPGetMoneyRecord(id:string) {
    return  publicMethod(`/api/salary/query/${id}`, 'get')
}
export function HTTPGetMoneyInstitution() {
    return  publicMethod('/api/salarySystem/queryAll', 'get')
}
export function HTTPAddMoneyInstitution(data:any) {
    return publicMethod('/api/salarySystem/add', 'post', data)
}
export function HTTPUpdataMoneyInstitution(data:any) {
    return publicMethod('/api/salarySystem/update','put',data)
}
export function HTTPDeleteMoneyInstitution(id:number) {
    return publicMethod(`/api/salarySystem/delete/${id}`,'delete')
}
export function HTTPGetPosition() {
    return publicMethod('/api/position/queryAll', 'get')
}
export function HTTPGetDepartment() {
    return  publicMethod('/api/department/queryAll', 'get')
}
export function HTTPGetCompute(id:string) {
    return  publicMethod(`/api/salary/computeByDepartmentId/${id}`, 'get')
}