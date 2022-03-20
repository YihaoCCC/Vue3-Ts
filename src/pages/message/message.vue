<template>
<n-card
    title="卡片分段示例"
    :segmented="{
      content: true,
      footer: 'soft'
    }"
    hoverable
  >
    <template #header-extra>
      <n-button tertiary type="primary" @click="activate">
          添加系统公告
      </n-button>
    </template>
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="data"
      :pagination="pagination"
    />
    <n-drawer v-model:show="active" :width="502">
      <n-drawer-content>
        <template #header>
          Header
        </template>
        <template #footer>
          <n-button>Footer</n-button>
        </template>
      </n-drawer-content>
    </n-drawer>
  </n-card>
    
</template>
    
<script>
//表格数据  GET     /message/query/{userId}&{pageNum}
//添加系统公告  Post    /message/add       json{content，userId，name，type，departmentId}
//添加部门公告  Post    /message/add       json{content，userId，name，type，departmentId}
//删除     Delete    /message/delete/{id}
import { h, defineComponent, ref } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ sendMail }) => {
  return [
    {
      title: '公告内容',
      key: 'content'
    },
    {
      title: '发布人员工号',
      key: 'userId'
    },
    {
      title: '发布人姓名',
      key: 'name'
    },
    {
      title: '发布时间',
      key: 'date'
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
                    
                    { default: () => '删除' }
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
    id: 0,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    department:null,
    tags: ['nice', 'developer']
  },
  {
    id: 1,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['wow']
  },
  {
    id: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
]

export default defineComponent({
  setup () {
    const message = useMessage()
    const active = ref(false)
    const activate = () => {
      active.value = true
    }
    return {
      active,
      activate,
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