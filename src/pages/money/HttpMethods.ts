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
export function HTTPGetMoneyRecordSelective(data:any) {
    return  publicMethod('/api/salary/querySelective', 'post',data)
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
export function HTTPGetPosition() {
    return publicMethod('/api/position/queryUseAll', 'get')
}
export function HTTPGetDepartment() {
    return  publicMethod('/api/department/queryUseAll', 'get')
}
export function HTTPGetCompute(id:number) {
    return  publicMethod(`/api/salary/computeByDepartmentId/${id}`, 'get')
}
export function HTTPGetMoneyRecordLastMonth(id:number) {
    return  publicMethod(`/api/salary/queryLastMonth/${id}`, 'get')
}