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
//表格中的数据  Get请求 /department/queryAll/{pageNum}
//计算薪资  Get    /salary/computeByDepartmentId/{departmentId}
import { h, defineComponent } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ sendMail }) => {
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
                    
                    { default: () => '计算薪资' }
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
                            
                            { default: () => 'Send Mail' }
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
    id: 0,
    name: 'John Brown',
    email: 32,
    describe: 'New York No. 1 Lake Park',
  },
  {
    id: 1,
    name: 'Jim Green',
    email: 42,
    describe: 'London No. 1 Lake Park',
  },
  {
    id: 2,
    name: 'Joe Black',
    email: 32,
    describe: 'Sidney No. 1 Lake Park',
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