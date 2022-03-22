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
          添加任务
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
          任务信息
        </template>
        <n-form >
          <n-form-item label='任务内容' >
            <n-input placeholder="请输入任务内容" type='textarea' v-model:value="form.content" >

            </n-input>
          </n-form-item>
          <n-form-item label='任务时间'>
            <n-date-picker v-model:formatted-value="form.date" value-format="yyyy-MM-dd" type="daterange" clearable />
          </n-form-item>
        </n-form>
        <n-button @click="addTask" type="primary">
          {{!actionType ? '添加' : '修改'}}
        </n-button>
      </n-drawer-content>
    </n-drawer>
  </n-card>

</template>

<script>
//表格数据  Get    /task/query/{userId}
//添加任务  Post   /task/add     json{content，userId，name，departmentId，beginDate，endDate}
//修改     Put    /task/update   json{id,content，userId，name，departmentId，beginDate，endDate}  
//添加员工  Get   
//任务详情  Get   /userTask/queryByTaskId/{userId}
import { h, defineComponent, ref, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ handleActivate }) => {
  return [
    {
      title: '任务内容',
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
      title: '任务所属部门',
      key: 'department.name'
    },
    {
      title: '开始时间',
      key: 'beginDate'
    },
    {
      title: '结束时间',
      key: 'endDate'
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
                                onClick: () => handleActivate(row)
                            },
                            
                            { default: () => '添加员工，任务详情' }
                        )
                }
        })
        return button
      }
    }
  ]
}

import {HTTPGetTask, HTTPAddTask, HTTPUpdateTask} from './HttpMethods'
export default defineComponent({
  setup () {
    const active = ref(false)
    let form = ref({
      beginDate:null,
      endDate:null,
      content:'',
      name: '',
    })
    const data = ref([])
    onMounted(() => {
      getTask()
    })
    const actionType = ref(0)  // 0代表增加，1代表修改
    //表格中的数据
    const getTask = () => {
      let id = localStorage.getItem("USERID")
      HTTPGetTask(id).then(res => {
        data.value = res
      })
    }
    //添加
    //修改
    const addTask = () => {
      if( !actionType.value ) {
        form.value.beginDate = form.value?.date[0]
        form.value.endDate = form.value.date[1]
        console.log(form.value)
        // HTTPAddTask(form.value).then(res =>{
        //   if(res.code === 200){
        //     getTask()
        //   }
        // })
      } else {
        HTTPUpdateTask(form.value).then(res =>{
          if(res.code === 200){
            getTask()
          }
        })
      }
      active.value = false
    }
    const handleActivate= (type, item) => {
      active.value = true
      if( type ) {
        form.value = item
        actionType.value = 1
      } else {
        form.value = {
          beginDate:null,
          endDate:null,
          content:'',
          name: '',
        }
        actionType.value = 0
      } 
    }
    return {
      form,
      actionType,
      addTask,
      active,
      handleActivate,
      data,
      columns: createColumns({
        handleActivate
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>