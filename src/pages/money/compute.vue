<template>
  <n-card hoverable>
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="data"
      :pagination="pagination"
    />
    <br/>
    <br/>
    <n-card
    v-if="active"
    title="薪资记录"
    :segmented="{
      content: true,
      footer: 'soft'
    }"
    hoverable
    >
      <n-data-table
        :bordered="false"
        :columns="columns1"
        :data="data1"
        :pagination="pagination"
      />
    </n-card>
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
                        type: 'info',
                        text: true,
                        style: {
                            marginRight: '6px'
                        },
                        size: 'small',
                        onClick: () => compute(row.id)
                    },
                    { default: () => '计算上个月薪资' }
                )
            }
        })
        return button
      }
    }
  ]
}
const createColumns1 = () => {
  return [
    {
      title: '员工号',
      key: 'userId'
    },
    {
      title: '员工姓名',
      key: 'user.name'
    },
    {
      title: '部门',
      key: 'user.department.name'
    },
    {
      title: '薪资日期（年）',
      key: 'year'
    },
    {
      title: '薪资日期（月）',
      key: 'month'
    },
    {
      title: '基本薪资',
      key: 'work'
    },
    {
      title: '迟到扣除',
      key: 'late'
    },
    {
      title: '旷工扣除',
      key: 'notWork'
    },
    {
      title: '出差补贴薪资',
      key: 'travel'
    },
    {
      title: '奖惩薪资',
      key: 'jiangcheng'
    },
    {
      title: '具体薪资',
      key: 'money'
    }
  ]
}

import {HTTPGetDepartment,HTTPGetCompute,HTTPGetMoneyRecordLastMonth} from './HttpMethods'
export default defineComponent({
  setup () {
    const message = useMessage()
    const active = ref(false)
    const data = ref([])
    const data1 = ref([])
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
            message.success(res.message)
          }else{
            message.error(res.message)
          }
          HTTPGetMoneyRecordLastMonth(id).then(res =>{
            data1.value = res
            active.value = true
          })
          
        })
    }
    return {
      data,
      data1,
      active,
      columns: createColumns({
        compute
      }),
      columns1: createColumns1({
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>