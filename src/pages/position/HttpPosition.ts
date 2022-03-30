import ckHttp from "@/service";

const positionInstance = ckHttp.getInstance()

function publicMethod(path:string, type:string, data?:any) {
    let result
    if ( type === 'get') {
        result = positionInstance.get(path).then(res => {
            return res
        })
    } else if (type === 'post') {
        result = positionInstance.post(path, data).then(res => {
            return res
        })
    }else if (type === 'put') {
        result = positionInstance.put(path, data).then(res => {
            return res
        })
    }else if(type === 'delete') {
        result = positionInstance.delete(path).then(res => {
            return res
        })
    }
    return result
}

export function HTTPGetPosition() {
    return publicMethod('/api/position/queryAll', 'get')
}
export function HTTPAddPosition(data:any) {
    return publicMethod('/api/position/add', 'post' ,data)
}
export function HTTPUpdataPosition(data:any) {
    return publicMethod('/api/position/update', 'put', data)
}
export function HTTPDeletePosition(id:number ){
    return publicMethod(`/api/position/delete/${id}`, 'delete')
}
export function HTTPGetMenu() {
    return publicMethod('/api/menu/queryAll', 'get')
}
export function HTTPGetPermission() {
    return publicMethod('/api/permission/queryAll', 'get')
}