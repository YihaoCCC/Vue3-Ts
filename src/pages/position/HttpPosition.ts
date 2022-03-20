import ckHttp from "@/service";

const positionInstance = ckHttp.getInstance()

function publicMethod(path:string, type:string, data?:any) {
    let result
    if ( type === 'get') {
        console.log('get职位')
        result = positionInstance.get(path).then(res => {
            console.log(res)
            return res
        })
    } else if (type === 'post' || type === 'put') {
        console.log('post添加、修改职位')
        result = positionInstance.post(path, data).then(res => {
            console.log(res)
            return res
        })
    } else if(type === 'delete') {
        console.log('delete职位')
        result = positionInstance.delete(path).then(res => {
            console.log(res)
            return res
        })
    }
    return result
}

export function HTTPGetPosition() {
    return publicMethod('/api/position/queryAll', 'get')
}
export function HTTAddPosition(data:any) {
    return publicMethod('/api/position/add', 'post' ,data)
}
export function HTTPUpdataPosition(data:any) {
    return publicMethod('/api/position/update', 'put', data)
}
export function HTTPDeletePosition(id:number ){
    return publicMethod(`/api/position/delete/${id}`, 'delete')
}