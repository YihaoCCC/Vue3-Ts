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
      <n-button tertiary type="primary" @click="handleActivate(0)">
          添加部门
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
          部门信息
        </template>
        <n-form >
          <n-form-item label='部门名称' >
            <n-input placeholder="请输入部门名称"  v-model:value="form.name" >

            </n-input>
          </n-form-item>
          <n-form-item label='部门邮箱'>
            <n-input placeholder="请输入部门邮箱"  v-model:value="form.email">

            </n-input>
          </n-form-item>
          <n-form-item label='部门描述' >
            <n-input placeholder="请输入部门描述" type='textarea' v-model:value="form.describe">

            </n-input>
          </n-form-item>
        </n-form>
        <n-button @click="addDepartment" type="primary">
          {{!actionType ? '添加该部门' : '修改该部门'}}
        </n-button>
        <template #footer>
          <n-button>Footer</n-button>
        </template>
      </n-drawer-content>
    </n-drawer>
  </n-card>
  
</template>

<script>
import { h, defineComponent, ref,  onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ handleActivate,deleteDepartment }) => {
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
                        onClick: () => handleActivate(1,row)
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
                                onClick: () => deleteDepartment(row.id)
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
  ,
  {
    id: 3,
    name: 'Joe Black',
    email: 32,
    describe: 'Sidney No. 1 Lake Park',
  }
  ,
  {
    id: 4,
    name: 'Joe Black',
    email: 32,
    describe: 'Sidney No. 1 Lake Park',
  }
  ,
  {
    id: 5,
    name: 'Joe Black',
    email: 32,
    describe: 'Sidney No. 1 Lake Park',
  }
  ,
  {
    id: 6,
    name: 'Joe Black',
    email: 32,
    describe: 'Sidney No. 1 Lake Park',
  },
  {
    id: 2,
    name: 'Joe Black',
    email: 32,
    describe: 'Sidney No. 1 Lake Park',
  },
  {
    id: 2,
    name: 'Joe Black',
    email: 32,
    describe: 'Sidney No. 1 Lake Park',
  },
  {
    id: 2,
    name: 'Joe Black',
    email: 32,
    describe: 'Sidney No. 1 Lake Park',
  },
  {
    id: 2,
    name: 'Joe Black',
    email: 32,
    describe: 'Sidney No. 1 Lake Park',
  }
]
import {HTTPGetDepartment, HTTPAddDepartMent, HTTPUpdataDepartMent, HTTPDeleteDepartment} from './HttpMethods'
export default defineComponent({
  
  setup () {
    const message = useMessage()
    const active = ref(false)
    let form = ref({
          name: '',
          email: '',
          describe: ''
    })

    onMounted(() => {
      getDepartment()
    })
    const actionType = ref(0)  // 0代表增加，1代表修改
    //表格中的数据  Get请求 /department/queryAll/{pageNum}
    const getDepartment = () => {
      HTTPGetDepartment().then(res => console.log(res))
    }
    //添加部门  Post   /department/add       json{name，email，describe}
    //修改部门  Put    /department/update    json{id,name，email，describe}
    const addDepartment = () => {
      if( !actionType.value ) {
        HTTPAddDepartMent(form.value)
      } else {
        HTTPUpdataDepartMent(form.value)
      }
    }
    //删除部门  Delete  /department/delete/{id}
    const deleteDepartment = (id) => {
      HTTPDeleteDepartment(id)
    }
    const handleActivate= (type, item) => {
      active.value = true
      if( type ) {
        form.value = item
        actionType.value = 1
      } else {
        form.value = {
          name: '',
          email: '',
          describe: ''
        }
        actionType.value = 0
      } 
    }
    return {
      form,
      actionType,
      addDepartment,
      deleteDepartment,
      active,
      handleActivate,
      data: createData(),
      columns: createColumns({
        handleActivate,
        deleteDepartment
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>