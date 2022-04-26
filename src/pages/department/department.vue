<template>
<n-card
    title=" "
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
        <n-form ref="formRef" :model="form" :rules="rules"
        label-placement="left" label-width="auto" require-mark-placement="right-hanging">
          <n-form-item label='部门名称:' path="name" >
            <n-input placeholder="请输入部门名称"  v-model:value="form.name" clearable>

            </n-input>
          </n-form-item>
          <n-form-item label='部门邮箱:' path="email">
            <n-input placeholder="请输入部门邮箱"  v-model:value="form.email" clearable>

            </n-input>
          </n-form-item>
          <n-form-item label='部门描述:' path="describe">
            <n-input placeholder="请输入部门描述" type='textarea' v-model:value="form.describe" clearable>

            </n-input>
          </n-form-item>
        </n-form>
        <n-button @click="addDepartment" type="primary" tertiary>
          {{!actionType ? '添加' : '修改'}}
        </n-button>
      </n-drawer-content>
    </n-drawer>
  </n-card>
  
</template>

<script>
import { h, defineComponent, ref, onMounted } from 'vue'
import { NTag, NButton, useMessage,  } from 'naive-ui'

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
      title: '部门人数',
      key: 'userNum'
    },
    {
      title: '部门启用状态',
      key: 'state',
      render(row) {
          return h(
            NTag,
            {
              round: true,
              style: {
                marginRight: '6px',
              },
              type: row.state === '启用' ? 'success' : 'error'
            },
            {
              default: () => row.state
            }
          )
      }
    },
    {
      title: '操作',
      key: 'actions',
      render (row) {
        const button = [1,2].map((item) => {
            if(item === 1) {
                return h(
                    NButton,
                    {
                        type: 'info',
                        text: true,
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
                                text: true,   
                                style: {
                                    marginRight: '6px',
                                },
                                
                                size: 'small',
                                onClick: () => deleteDepartment(row.id)
                            },
                            
                            { default: () => row.state === '启用' ? '停用' : '启用' }
                        )
                }
        })
        return button
      }
    }
  ]
}


import {HTTPGetDepartment, HTTPAddDepartMent, HTTPUpdataDepartMent, HTTPDeleteDepartment} from './HttpMethods'
export default defineComponent({
  setup () {
    const formRef = ref(null);
    const message = useMessage()
    const active = ref(false)
    let form = ref({
          name: '',
          email: '',
          describe: ''
    })
    const data = ref([])
    onMounted(() => {
      getDepartment()
    })
    const rules = ref({
      name: {
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
          },
      email: {
            required: true,
            message: '请输入部门邮箱',
            trigger: ['input', 'blur']
          },
      describe: {
            required: true,
            message: '请输入部门描述',
            trigger: ['input', 'blur']
          }
    })
    const actionType = ref(0)  // 0代表增加，1代表修改
    //表格中的数据  Get请求 /department/queryAll/{pageNum}
    const getDepartment = () => {
      HTTPGetDepartment().then(res => {
        data.value = res
      })
    }
    //添加部门  Post   /department/add       json{name，email，describe}
    //修改部门  Put    /department/update    json{id,name，email，describe}
    const addDepartment = (e) => {
      e.preventDefault()
      formRef.value?.validate((errors) => {
          if (!errors) {
            if( !actionType.value ) {
              HTTPAddDepartMent(form.value).then(res =>{
                if(res.code === 200){
                  getDepartment()
                  message.success(res.message)
                }else{
                  message.error(res.message)
                }
              })
            } else {
              HTTPUpdataDepartMent(form.value).then(res =>{
                if(res.code === 200){
                  getDepartment()
                  message.success(res.message)
                }else{
                  message.error(res.message)
                }
              })
            }
            active.value = false
          }
        })
    }
    //停用部门  Delete  /department/delete/{id}
    const deleteDepartment = (id) => {
      HTTPDeleteDepartment(id).then(res =>{
          if(res.code === 200){
            getDepartment()
            message.success(res.message)
          }else{
            message.error(res.message)
          }
        })
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
      formRef,
      form,
      actionType,
      addDepartment,
      deleteDepartment,
      active,
      handleActivate,
      data,
      rules,
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