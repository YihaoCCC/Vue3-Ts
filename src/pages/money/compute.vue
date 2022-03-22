<template>
<n-card hoverable>
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="data"
      :pagination="pagination"
    />
  </n-card>
  
</template>

<script>
//表格中的数据  Get请求 /department/queryAll
//计算薪资  Get    /salary/computeByDepartmentId/{departmentId}
import { h, defineComponent, ref, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ compute }) => {
  return [
    {
      title: '部门名称',
      key: 'name'
    },
    {
      title: '部门邮箱',
      key: 'email'
    },
    {
      title: '部门职责描述',
      key: 'describe'
    },
    {
      title: '操作',
      key: 'actions',
      render (row) {
        const button = [1].map((item) => {
            if(item === 1) {
                return h(
                    NButton,
                    {
                        style: {
                            marginRight: '6px'
                        },
                        size: 'small',
                        onClick: () => compute(row.id)
                    },
                    
                    { default: () => '计算薪资' }
                )
            }
        })
        return button
      }
    }
  ]
}

import {HTTPGetDepartment,HTTPGetCompute} from './HttpMethods'
export default defineComponent({
  setup () {
    const data = ref([])
    onMounted(() => {
      getDepartment()
    })
    //表格中的数据
    const getDepartment = () => {
      HTTPGetDepartment().then(res => {
        data.value = res
      })
    }
    //计算薪资
    const compute = (id) => {
      HTTPGetCompute(id).then(res =>{
          if(res.code === 200){
            console.log(1)
          }
        })
    }
    return {
      data,
      columns: createColumns({
        compute
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>