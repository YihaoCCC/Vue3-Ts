import ckHttp from "../../service";

const instance = ckHttp.getInstance()

function publicMethod(path:string, type:string, data?:any) {
    let result
    if ( type === 'get') {
        console.log('get部门')
        result = instance.get(path).then(res => {
            console.log(res)
            return res
        })
    } else if (type === 'post' || type === 'put') {
        console.log('post添加、修改部门')
        result = instance.post(path, data).then(res => {
            console.log(res)
            return res
        })
    } else if(type === 'delete') {
        console.log('delete部门')
        result = instance.delete(path).then(res => {
            console.log(res)
            return res
        })
    }
    return result
}
export function HTTPGetDepartment() {
    return  publicMethod('/api/get', 'get')
}
export function HTTPAddDepartMent(data:any) {
    return publicMethod('/api/department/add', 'post', data)
}
export function HTTPUpdataDepartMent(data:any) {
    return publicMethod('/api/department/update','put',data)
}
export function HTTPDeleteDepartment(id:number) {
    return publicMethod(`/api/department/delete/${id}`,'delete')
}
// class departmentData extends CKhttp {
//     constructor() {
//         super({})
//     }
//     testHttp() {
//         const p = super.instance.get('/get').then(res => {
//            console.log(res)
//            return [1,2,3,4,5,6,7,8,9]
//        })
//        return p
//    }
// }

// const departmentDataInstance = new departmentData


// export default departmentDataInstance