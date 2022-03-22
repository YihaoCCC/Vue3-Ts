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
//表格数据  GET     /signIn/query/{userId}
import { h, defineComponent, ref, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = () => {
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
      title: '签到时间（年）',
      key: 'year'
    },
    {
      title: '签到时间（月）',
      key: 'month'
    },
    {
      title: '签到时间（日）',
      key: 'day'
    },
    {
      title: '签到具体时间',
      key: 'time'
    },
    {
      title: '签到类型',
      key: 'signinSystem.name'
    }
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
  ]
}


import {HTTPGetSignRecord} from './HttpMethods'
export default defineComponent({
  setup () {
    const data = ref([])
    onMounted(() => {
      getSignRecord()
    })
    //表格中的数据
    const getSignRecord = () => {
      let id = localStorage.getItem("USERID")
      HTTPGetSignRecord(id).then(res => {
        data.value = res
      })
    }
    return {
      data,
      columns: createColumns({
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>