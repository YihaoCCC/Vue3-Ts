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
//表格数据    Get  /userTask/queryByUserId/{userId}&{pageNum}
//提交      Put    /userTask/update    json{id,taskId,userId,content,state}  其实就是修改
import { h, defineComponent } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ sendMail }) => {
  return [
    {
      title: '任务内容',
      key: 'task.content'
    },
    {
      title: '发布人员工号',
      key: 'task.userId'
    },
    {
      title: '发布人姓名',
      key: 'task.name'
    },
    {
      title: '任务所属部门',
      key: 'task.department.name'
    },
    {
      title: '开始时间',
      key: 'task.beginDate'
    },
    {
      title: '提交的内容',
      key: 'content'
    },
    {
      title: '结束时间',
      key: 'task.endDate'
    },
    {
      title: '任务状态',
      key: 'state'
    },
    {
      title: 'Action',
      key: 'actions',
      render (row) {
        const button = [1,2].map((item) => {
            if(item === 1) {
                return h(
                    NButton,
                    {
                        style: {
                            marginRight: '6px'
                        },
                        size: 'small',
                        onClick: () => sendMail(row)
                    },
                    
                    { default: () => '提交' }
                )
            } else {
                return h(
                            NButton,
                            {
                                type: 'error',
                                dashed: true,    
                                style: {
                                    marginRight: '6px',
                                },
                                
                                size: 'small',
                                onClick: () => sendMail(row)
                            },
                            
                            { default: () => 'Send Email' }
                        )
                }
        })
        return button
      }
    }
  ]
}

const createData = () => [
  {
    key: 0,
    content: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: 1,
    content: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['wow']
  },
  {
    key: 2,
    content: 'Joe Black',
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