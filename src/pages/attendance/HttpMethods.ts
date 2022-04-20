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
export function HTTPGetSignRecord(id:string) {
    return  publicMethod(`/api/signIn/query/${id}`, 'get')
}
export function HTTPGetSignRecordSelective(data:any) {
    return  publicMethod('/api/signIn/querySelective', 'post',data)
}
export function HTTPGetAttendanceType() {
    return  publicMethod('/api/signinSystem/queryAll', 'get')
}
export function HTTPUpdAtaattendanceType(data:any) {
    return publicMethod('/api/signinSystem/update','put',data)
}
export function HTTPGetAttendanceTime() {
    return  publicMethod('/api/workTime/queryAll', 'get')
}
export function HTTPUpdAtaattendanceTime(data:any) {
    return publicMethod('/api/workTime/update','put',data)
}
export function HTTPGetDepartment() {
    return  publicMethod('/api/department/queryUseAll', 'get')
}
