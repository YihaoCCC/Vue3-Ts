<template>
  <n-card
    title="卡片分段示例"
    :segmented="{
      content: true,
      footer: 'soft'
    }"
    hoverable
  >
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="data"
      :pagination="pagination"
    />
  </n-card>

</template>

<script>
//表格数据  GET     /leave/queryUnapproved/{userId}
//批准  Put    /leave/update/{id}       
import { h, defineComponent, ref, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ LeaveRequest }) => {
  return [
    {
      title: '员工号',
      key: 'userId'
    },
    {
      title: '员工姓名',
      key: 'name'
    },
    {
      title: '请假原因',
      key: 'reason'
    },
    {
      title: '开始时间',
      key: 'beginDate'
    },
    {
      title: '结束时间',
      key: 'endDate'
    },
    {
      title: '审批状态',
      key: 'state'
    },
    // {
    //   title: '审批状态',
    //   key: 'tags',
    //   render (row) {
    //     const tags = row.tags.map((tagKey) => {
    //       return h(
    //         NTag,
    //         {
    //           style: {
    //             marginRight: '6px'
    //           },
    //           type: 'info'
    //         },
    //         {
    //           default: () => tagKey
    //         }
    //       )
    //     })
    //     return tags
    //   }
    // }
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
                        onClick: () => LeaveRequest(row)
                    },
                    
                    { default: () => '批准' }
                )
            } 
        })
        return button
      }
    }
  ]
}

import {HTTPGetLeaveRequest,HTTPUpdataLeaveRequest} from './HttpMethods'
export default defineComponent({
  setup () {
    const data = ref([])
    onMounted(() => {
      getLeaveRequest()
    })
    //表格中的数据
    const getLeaveRequest = () => {
      let id = localStorage.getItem("USERID")
      HTTPGetLeaveRequest(id).then(res => {
        data.value = res
      })
    }
    //审批
    const LeaveRequest = (row) => {
      HTTPUpdataLeaveRequest(row).then(res =>{
          if(res.code === 200){
            getLeaveRequest()
          }
        })
    }
    return {
      data,
      columns: createColumns({
        LeaveRequest
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>