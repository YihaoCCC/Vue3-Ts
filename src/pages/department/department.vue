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
          {{!actionType ? '添加' : '修改'}}
        </n-button>
      </n-drawer-content>
    </n-drawer>
  </n-card>
  
</template>

<script>
import { h, defineComponent, ref, onMounted } from 'vue'
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
      title: '操作',
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


import {HTTPGetDepartment, HTTPAddDepartMent, HTTPUpdataDepartMent, HTTPDeleteDepartment} from './HttpMethods'
export default defineComponent({
  setup () {
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
    const actionType = ref(0)  // 0代表增加，1代表修改
    //表格中的数据  Get请求 /department/queryAll/{pageNum}
    const getDepartment = () => {
      HTTPGetDepartment().then(res => {
        data.value = res
      })
    }
    //添加部门  Post   /department/add       json{name，email，describe}
    //修改部门  Put    /department/update    json{id,name，email，describe}
    const addDepartment = () => {
      if( !actionType.value ) {
        HTTPAddDepartMent(form.value).then(res =>{
          if(res.code === 200){
            getDepartment()
          }
        })
      } else {
        HTTPUpdataDepartMent(form.value).then(res =>{
          if(res.code === 200){
            getDepartment()
          }
        })
      }
      active.value = false
    }
    //删除部门  Delete  /department/delete/{id}
    const deleteDepartment = (id) => {
      HTTPDeleteDepartment(id).then(res =>{
          if(res.code === 200){
            getDepartment()
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
      form,
      actionType,
      addDepartment,
      deleteDepartment,
      active,
      handleActivate,
      data,
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