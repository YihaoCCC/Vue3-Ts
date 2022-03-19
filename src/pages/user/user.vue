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
          添加员工
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
//表格中的数据  Get请求     /user/query/{userId}&{pageNum}
//添加员工  Post   /user/add       json{password，name，sex，birthday，idNumber，email，nativePlace，address，phone，departmentId，positionId}
//修改  Put    /user/update    json{userId,password，name，sex，birthday，idNumber，email，nativePlace，address，phone，departmentId，positionId}
//删除  Put  /user/delete/{userId}
import { h, defineComponent, ref } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ sendMail }) => {
  return [
    {
      title: '员工号',
      key: 'userId'
    },
    {
      title: '姓名',
      key: 'name'
    },
    {
      title: '性别',
      key: 'sex'
    },
    {
      title: '出生日期',
      key: 'birthday'
    },
    {
      title: '身份证号',
      key: 'idNumber'
    },
    {
      title: '邮箱',
      key: 'email'
    },
    {
      title: '籍贯',
      key: 'nativePlace'
    },
    {
      title: '住址',
      key: 'address'
    },
    {
      title: '手机号码',
      key: 'phone'
    },
    {
      title: '入职日期',
      key: 'beginDate'
    },
    {
      title: '所在部门',
      key: 'department.name'
    },
    {
      title: '职位',
      key: 'position.name'
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
                    
                    { default: () => '修改' }
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
                            
                            { default: () => '删除' }
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
    userId: "180101",
    name: 'John Brown',
    sex: "1",
    birthday: "1999-06-15",
    idNumber: "1231",
    email: "sss",
    nativePlace: null,
    address: null,
    phone: "sss",
    beginDate: "2000-11-22",
    department:{
      id: 1,
      name: "人事部",
      email: "1",
      describe: "1",
    },
    position:{
      id: 1,
      name: "人事经理",
      departmentId: 1,
      menu: "1",
    }
  },
  {
    userId: "180102",
    name: 'John Brown',
    sex: "1",
    birthday: "1999-06-15",
    idNumber: "1231",
    email: "sss",
    nativePlace: null,
    address: null,
    phone: "sss",
    beginDate: "2000-11-22",
    department:null,
    position:{
      id: 1,
      name: "人事经理",
      departmentId: 1,
      menu: "1",
    }
  },
  {
    userId: "180103",
    name: 'John Brown',
    sex: "1",
    birthday: "1999-06-15",
    idNumber: "1231",
    email: "sss",
    nativePlace: null,
    address: null,
    phone: "sss",
    beginDate: "2000-11-22",
    department:{
      id: 1,
      name: "人事部",
      email: "1",
      describe: "1",
    },
    position:{
      id: 1,
      name: "人事经理",
      departmentId: 1,
      menu: "1",
    }
  },
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