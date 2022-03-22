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
//表格数据  GET     /travel/queryUnapproved/{userId}
//批准  Put    /travel/update/{id}       
import { h, defineComponent, ref, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ WorkOutRequest }) => {
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
      title: '出差原因',
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
      title: 'Action',
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
                        onClick: () => WorkOutRequest(row)
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

import {HTTPGetWorkOutRequest,HTTPUpdataWorkOutRequest} from './HttpMethods'
export default defineComponent({
  setup () {
    const data = ref([])
    onMounted(() => {
      getWorkOutRequest()
    })
    //表格中的数据
    const getWorkOutRequest = () => {
      let id = localStorage.getItem("USERID")
      HTTPGetWorkOutRequest(id).then(res => {
        data.value = res
      })
    }
    //审批
    const WorkOutRequest = (row) => {
      HTTPUpdataWorkOutRequest(row).then(res =>{
          if(res.code === 200){
            getWorkOutRequest()
          }
        })
    }
    return {
      data,
      columns: createColumns({
        WorkOutRequest
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>