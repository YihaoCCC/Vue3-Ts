import {App }from "vue";
import {
    ElTable,
    ElTableColumn,
    ElButton
}
from 'element-plus'

const component = [
    ElTable,
    ElTableColumn,
    ElButton
]

export function useElementPlus(app:App):void {
    for(const item of component) {
        app.component(item.name, item)
    }
}