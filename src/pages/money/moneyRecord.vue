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
//表格数据  GET     /salary/query/{userId}
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

import {HTTPGetMoneyRecord} from './HttpMethods'
export default defineComponent({
  setup () {
    const data = ref([])
    onMounted(() => {
      getMoneyRecord()
    })
    //表格中的数据
    const getMoneyRecord = () => {
      let id = localStorage.getItem("USERID")
      HTTPGetMoneyRecord(id).then(res => {
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