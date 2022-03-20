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
          添加职位
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
        <n-form >
          <n-form-item label='职位名称' >
            <n-input placeholder="请输入职位名称" v-model:value="form.name"   >

            </n-input>
          </n-form-item>
          <n-form-item label='职位所属部门'>
            <n-select placeholder="请选择职位所属部门" v-model:value="form.departmentId" :options="options" clearable>

            </n-select>
          </n-form-item>
          <n-form-item label='菜单权限' >
            <n-select placeholder="请选择职位菜单权限" v-model:value="form.menu" :options="options" clearable>

            </n-select>
          </n-form-item>
          <n-form-item label='职位操作权限' >
            <n-select placeholder="请选择职位操作权限" v-model:value="form.permission" :options="options" clearable>

            </n-select>
          </n-form-item>
        </n-form>
        <n-button @click="addPosition" type="primary">
          添加该职位
        </n-button>
        <template #footer>
          <n-button>Footer</n-button>
        </template>
      </n-drawer-content>
    </n-drawer>
  </n-card>

</template>

<script>
import { h, defineComponent, ref, reactive, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ updataPosition, deletePosition }) => {
  return [
    {
      title: '职位名称',
      key: 'name'
    },
    {
      title: '部门',
      key: 'department.name'
    },
    {
      title: '职位菜单权限',
      key: 'menu'
    },
    {
      title: '职位操作权限',
      key: 'permission'
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
                        onClick: () => updataPosition(row)
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
                                onClick: () => deletePosition(row.id)
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
    age: 32,
    address: 'New York No. 1 Lake Park',
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
import { HTTPGetPosition, HTTAddPosition, HTTPUpdataPosition , HTTPDeletePosition } from './HttpPosition'

// name，departmentId，menu，permission
export default defineComponent({
  setup () {
    const message = useMessage()
    const active = ref(false)
    const activate = () => {
      active.value = true
    }
    const form = ref({
      name: '',
      departmentId: '',
      menu: [],
      permission: []
    })
    onMounted(() => {
      getPosition()
    })
//表格数据  GET     /position/queryAll/{pageNum}

    const getPosition =()=> {
      HTTPGetPosition()
    }
//添加职位  Post    /position/add       json{name，departmentId，menu，permission}
//修改     PUT     /position/update    json{id,name，departmentId，menu，permission}
    const addPosition = () => {
      HTTAddPosition(form)
    }

    const updataPosition = (item) => {
      console.log(item)
      HTTPUpdataPosition(form)
    }
//删除     Delete    /position/delete/{id}

    const deletePosition =(id) => {
      HTTPDeletePosition(id).then((res) => {
         console.log(res)
      }).catch(() => {
          message.error('删除失败')
      })
    }
    return {
      form,
      addPosition,
      updataPosition,
      deletePosition,
      active,
      activate,
      data: createData(),
      columns: createColumns({
        updataPosition,
        deletePosition,
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>