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
          <n-form-item label='任务名字' >
            <n-input placeholder="请输入任务名字" v-model:value="form.name" >
            </n-input>
          </n-form-item>
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

    <n-drawer v-model:show="active1" :width="502">
      <n-drawer-content>
        <template #header>
          添加员工
        </template>
        <n-form >
          <n-form-item label='员工姓名' >
            <n-select placeholder="请选择员工" v-model:value="form1.userId" :options="userOptions">
            </n-select>
          </n-form-item>
          <n-form-item label='任务要求' >
            <n-input placeholder="请输入任务要求" type='textarea' v-model:value="form1.taskWork" >
            </n-input>
          </n-form-item>
        </n-form>
        <n-button @click="addUser" type="primary">
          添加
        </n-button>
      </n-drawer-content>
    </n-drawer>
    <n-card
    v-if="active2"
    title="任务员工详情"
    :segmented="{
      content: true,
      footer: 'soft'
    }"
    hoverable
  >
    <n-data-table
      :bordered="false"
      :columns="columns1"
      :data="data1"
      :pagination="pagination"
    />
    <n-drawer v-model:show="active3" :width="502">
      <n-drawer-content>
        <template #header>
          任务信息
        </template>
        <n-form 
        label-placement="left"
        label-width="auto">
          <n-form-item label='员工号：' >
            {{form2.userId}}
          </n-form-item>
          <n-form-item label='员工姓名：' >
            {{form2.user.name}}
          </n-form-item>
          <n-form-item label='任务要求：' >
            {{form2.taskWork}}
          </n-form-item>
          <n-form-item label='任务提交的内容：' >
            {{form2.content}}
          </n-form-item>
          <n-form-item label='任务意见：' >
            <n-input placeholder="请输入任务意见" type='textarea' v-model:value="form2.view" >
            </n-input>
          </n-form-item>
          <n-form-item label='任务状态：'>
            <n-radio-group v-model:value="form2.state" name="radiogroup">
              <n-radio value="完成">完成</n-radio>
              <n-radio value='未完成'>未完成</n-radio>
            </n-radio-group>
          </n-form-item>
        </n-form>
        <n-button @click="updateUserTask" type="primary">
         修改
        </n-button>
      </n-drawer-content>
    </n-drawer>
    </n-card>
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

const createColumns = ({ handleActivate,handleActivate1,show }) => {
  return [
    {
      title: '任务名字',
      key: 'name'
    },
    {
      title: '任务内容',
      key: 'content'
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
        const button = [1,2,3].map((item) => {
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
            }else if(item === 2) {
                return h(
                    NButton,
                    {
                        style: {
                            marginRight: '6px'
                        },
                        size: 'small',
                        onClick: () => handleActivate1(row.id)
                    },
                    
                    { default: () => '添加员工' }
                )
            } else {
                return h(
                            NButton,
                            {
                                  
                                style: {
                                    marginRight: '6px',
                                },
                                
                                size: 'small',
                                onClick: () => show(row.id)
                            },
                            
                            { default: () => '任务详情' }
                        )
                }
        })
        return button
      }
    }
  ]
}
const createColumns1 = ({ handleActivate2,deleteUser }) => {
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
      title: '任务要求',
      key: 'taskWork'
    },
    {
      title: '任务提交内容',
      key: 'content',
      width: 200,
      ellipsis: {
      tooltip: true
    }
    },
    {
      title: '任务意见',
      key: 'view',
      width: 200,
      ellipsis: {
      tooltip: true
    }
    },
    {
      title: '任务状态',
      key: 'state'
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
                        onClick: () => handleActivate2(row)
                    },
                    
                    { default: () => '修改' }
                )
            } else {
                return h(
                            NButton,
                            {
                                  
                                style: {
                                    marginRight: '6px',
                                },
                                
                                size: 'small',
                                onClick: () => deleteUser(row)
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

import {HTTPGetTask, HTTPAddTask, HTTPUpdateTask,HTTPGetUser,HTTPAddUserTask,HTTPGetTaskUser,HTTPUpdateUserTask,HTTPDeleteTaskUser} from './HttpMethods'
export default defineComponent({
  setup () {
    const active = ref(false)
    const active1 = ref(false)
    const active2 = ref(false)
    const active3 = ref(false)
    let form = ref({
      name:'',
      beginDate:null,
      endDate:null,
      content:'',
      date:null
    })
    let form1 = ref({
      taskId:'',
      userId:'',
      taskWork:'',
    })
    let form2 = ref({
      
    })
    const userOptions = ref([])
    const data = ref([])
    const data1 = ref([])
    onMounted(() => {
      getTask()
      getOptions()
    })
    const getOptions = () => {
      let id = localStorage.getItem("USERID")
      HTTPGetUser(id).then(res =>{
        res.forEach(element => {
          userOptions.value.push({
            value: element.userId,
            label: element.name
            })
          });
      })
    }
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
      form.value.beginDate = form.value?.date[0]
        form.value.endDate = form.value.date[1]
        form.value.userId = localStorage.getItem('USERID')
      if( !actionType.value ) {
        console.log(form.value)
        HTTPAddTask(form.value).then(res =>{
          if(res.code === 200){
            getTask()
          }
        })
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
        form.value.date = [item.beginDate,item.endDate]
        actionType.value = 1
      } else {
        form.value = {
          beginDate:null,
          endDate:null,
          content:'',
          name: '',
          date:null
        }
        actionType.value = 0
      } 
    }
    const handleActivate1= (id) => {
      active1.value = true
      form1.value = {
        taskId:id,
        userId:'',
        taskWork:'',
      }
    }
    const handleActivate2= (item) => {
      active3.value = true
      form2.value = item
    }
    const updateUserTask = () =>{
      HTTPUpdateUserTask(form2.value).then(res =>{
        console.log(res)
        show(form2.value.taskId)
      })
      active3.value = false
    }
    const deleteUser = (item) =>{
      HTTPDeleteTaskUser(item.id).then(res =>{
        console.log(res)
        show(item.taskId)
      })
    }
    const addUser = () =>{
      console.log(form1.value)
      HTTPAddUserTask(form1.value).then(res =>{
          console.log(res.message)
        })
      active1.value = false
    }
    const show = (id) =>{
      HTTPGetTaskUser(id).then(res =>{
        data1.value = res
      })
      active2.value = true
    }
    return {
      form,
      form1,
      form2,
      actionType,
      userOptions,
      addTask,
      addUser,
      updateUserTask,
      active,
      active1,
      active2,
      active3,
      handleActivate,
      handleActivate1,
      data,
      data1,
      columns: createColumns({
        handleActivate,
        handleActivate1,
        show,
      }),
      columns1: createColumns1({
        handleActivate2,
        deleteUser,
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>