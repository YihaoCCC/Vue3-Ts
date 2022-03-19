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
//表格数据  GET     /salary/query/{userId}&{pageNum}
import { h, defineComponent } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ sendMail }) => {
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

const createData = () => [
  {
    key: 0,
    userId: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: 1,
    userId: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['wow']
  },
  {
    key: 2,
    userId: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
]

export default defineComponent({
  setup () {
    const message = useMessage()
    return {
      data: createData(),
      columns: createColumns({
        sendMail (rowData) {
          message.info('send mail to ' + rowData.name)
        }
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>