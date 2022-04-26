<template>
  <n-card
    title="卡片分段示例"
    :segmented="{
      content: true,
      footer: 'soft'
    }"
    hoverable
  >
  <template #header>
    <n-form inline label-placement="left" >
      <n-form-item label='任务名字:'>
        <n-input placeholder="请输入任务名字"  v-model:value="form3.name" clearable style="width: 145px">
        </n-input>
      </n-form-item>
      <n-form-item label='任务状态:' >
        <n-select placeholder="请选择任务状态" v-model:value="form3.state" :options="stateOptions" clearable style="width: 135px">
        </n-select>
      </n-form-item>
      <n-form-item>
      <n-button tertiary type="primary" @click="query">
        查询
      </n-button>
    </n-form-item>
    </n-form>
  </template>
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
        <n-form ref="formRef" :model="form" :rules="rules"
        label-placement="left" label-width="auto" require-mark-placement="right-hanging">
          <n-form-item label='任务名字:' path="name">
            <n-input placeholder="请输入任务名字" v-model:value="form.name" >
            </n-input>
          </n-form-item>
          <n-form-item label='任务内容:' path="content">
            <n-input placeholder="请输入任务内容" type='textarea' v-model:value="form.content" >
            </n-input>
          </n-form-item>
          <n-form-item label='任务时间:' path="date">
            <n-date-picker v-model:formatted-value="form.date" value-format="yyyy-MM-dd" type="daterange" clearable />
          </n-form-item>
          <n-form-item label='任务状态:' path="state" v-if="actionType">
            <n-radio-group v-model:value="form.state" name="radiogroup">
              <n-radio value="完成">完成</n-radio>
              <n-radio value='未完成'>未完成</n-radio>
            </n-radio-group>
          </n-form-item>
        </n-form>
        <n-button @click="addTask" type="primary" tertiary>
          {{!actionType ? '添加' : '修改'}}
        </n-button>
      </n-drawer-content>
    </n-drawer>

    <n-drawer v-model:show="active1" :width="502">
      <n-drawer-content>
        <template #header>
          添加员工
        </template>
        <n-form ref="formRef1" :model="form1" :rules="rules1"
        label-placement="left" label-width="auto" require-mark-placement="right-hanging">
          <n-form-item label='员工:' path="userId">
            <n-select placeholder="请选择员工" v-model:value="form1.userId" :options="userOptions">
            </n-select>
          </n-form-item>
          <n-form-item label='任务要求:' path="taskWork">
            <n-input placeholder="请输入任务要求" type='textarea' v-model:value="form1.taskWork" >
            </n-input>
          </n-form-item>
        </n-form>
        <n-button @click="addUser" type="primary" tertiary>
          添加
        </n-button>
      </n-drawer-content>
    </n-drawer>
    <br/>
    <br/>
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
        <n-form ref="formRef2" :model="form2" :rules="rules2"
        label-placement="left" label-width="auto" require-mark-placement="right-hanging">
          <n-form-item label='员工号:' path="userId">
            {{form2.userId}}
          </n-form-item>
          <n-form-item label='员工姓名:' path="user.name">
            {{form2.user.name}}
          </n-form-item>
          <n-form-item label='任务要求:' path="taskWork">
            <n-input placeholder="请输入任务要求" type='textarea' v-model:value="form2.taskWork" >
            </n-input>
          </n-form-item>
          <n-form-item label='任务提交的内容:' path="content">
            {{form2.content}}
          </n-form-item>
          <n-form-item label='任务意见:' path="view">
            <n-input placeholder="请输入任务意见" type='textarea' v-model:value="form2.view" >
            </n-input>
          </n-form-item>
          <n-form-item label='任务状态:' path="state">
            <n-radio-group v-model:value="form2.state" name="radiogroup">
              <n-radio value="完成">完成</n-radio>
              <n-radio value='未完成'>未完成</n-radio>
            </n-radio-group>
          </n-form-item>
        </n-form>
        <n-button @click="updateUserTask" type="primary" tertiary>
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
      key: 'name',
      width: 150,
      // ellipsis: {
      //   tooltip: true
      // }
    },
    {
      title: '任务内容',
      key: 'content',
      width: 500,
      // ellipsis: {
      //   tooltip: true
      // }
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
      key: 'state',
      render(row) {
          return h(
            NTag,
            {
              round: true,
              style: {
                marginRight: '6px',
              },
              type: row.state === '完成' ? 'success' : 'error'
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
        const button = [1,2,3].map((item) => {
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
            }else if(item === 2) {
                return h(
                    NButton,
                    {
                        type: 'info',
                        text: true,
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
                                type: 'info',
                                text: true,
                                style: {
                                    marginRight: '6px',
                                },
                                
                                size: 'small',
                                onClick: () => show(row.id)
                            },
                            
                            { default: () => '任务员工详情' }
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
      key: 'taskWork',
      width: 300,
      // ellipsis: {
      //   tooltip: true
      // }
    },
    {
      title: '任务提交内容',
      key: 'content',
      width: 300,
      // ellipsis: {
      //   tooltip: true
      // }
    },
    {
      title: '任务意见',
      key: 'view',
      width: 300,
      // ellipsis: {
      //   tooltip: true
      // }
    },
    {
      title: '任务状态',
      key: 'state',
      render(row) {
          return h(
            NTag,
            {
              round: true,
              style: {
                marginRight: '6px',
              },
              type: row.state === '完成' ? 'success' : 'error'
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
                        onClick: () => handleActivate2(row)
                    },
                    
                    { default: () => '修改' }
                )
            } else {
                return h(
                            NButton,
                            {
                                type: 'info',
                                text: true,
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

import {HTTPGetTask, HTTPAddTask, HTTPUpdateTask,HTTPGetUser,HTTPAddUserTask,HTTPGetTaskUser,HTTPUpdateUserTask,HTTPDeleteTaskUser,HTTPGetTaskSelective} from './HttpMethods'
export default defineComponent({
  setup () {
    const formRef = ref(null)
    const formRef1 = ref(null)
    const formRef2 = ref(null)
    const message = useMessage()
    const active = ref(false)
    const active1 = ref(false)
    const active2 = ref(false)
    const active3 = ref(false)
    const form = ref({
      name:'',
      beginDate:null,
      endDate:null,
      content:'',
      date:null,
      state:''
    })
    const rules = ref({
      name: {
            required: true,
            message: '请输入任务名字',
            trigger: ['input', 'blur']
          },
      content: {
            required: true,
            message: '请输入任务内容',
            trigger: ['input', 'blur']
          },
      date: {
            type: 'array',
            required: true,
            message: '请选择任务时间',
            trigger: ['change', 'blur']
          },
      state: {
            required: true,
            message: '请选择任务状态',
            trigger: ['change', 'blur']
          }
    })
    const form1 = ref({
      taskId:'',
      userId:'',
      taskWork:'',
    })
    const rules1 = ref({
      userId: {
            required: true,
            message: '请选择员工',
            trigger: ['change', 'blur']
          },
      taskWork: {
            required: true,
            message: '请输入任务要求',
            trigger: ['input', 'blur']
          },
    })
    const form2 = ref({
      taskWork:'',
      state:''
    })
    const rules2 = ref({
      taskWork: {
            required: true,
            message: '请输入任务要求',
            trigger: ['input', 'blur']
          },
      state: {
            required: true,
            message: '请选择任务状态',
            trigger: ['change', 'blur']
          }
    })
    const form3 = ref({
      userId:localStorage.getItem('USERID'),
      name: null,
      state:null
    })
    const stateOptions = ref([
      {
        value:"完成",
        label:"完成"
      },
      {
        value:"未完成",
        label:"未完成"
      },
    ])
    const userOptions = ref([])
    const data = ref([])
    const data1 = ref([])
    onMounted(() => {
      getTask()
      getOptions()
    })
    const query = () => {
      console.log(form3.value)
      if(form3.value.name === ''){
        form3.value.name = null
      }
      HTTPGetTaskSelective(form3.value).then(res =>{
        data.value = res
      })
    }
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
    const addTask = (e) => {
      e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            form.value.beginDate = form.value?.date[0]
            form.value.endDate = form.value.date[1]
            form.value.userId = localStorage.getItem('USERID')
            if( !actionType.value ) {
              console.log(form.value)
              HTTPAddTask(form.value).then(res =>{
                if(res.code === 200){
                  getTask()
                  message.success(res.message)
                }else{
                  message.error(res.message)
                }
              })
            } else {
              HTTPUpdateTask(form.value).then(res =>{
                if(res.code === 200){
                  getTask()
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
      form1.value.taskId = id
    }
    const handleActivate2= (item) => {
      active3.value = true
      form2.value = item
    }
    const updateUserTask = (e) =>{
      e.preventDefault()
        formRef2.value?.validate((errors) => {
          if (!errors) {
             HTTPUpdateUserTask(form2.value).then(res =>{
              if(res.code === 200){
                  show(form2.value.taskId)
                  message.success(res.message)
                }else{
                  message.error(res.message)
                }
            })
            active3.value = false
          }
        })
    }
    const deleteUser = (item) =>{
      HTTPDeleteTaskUser(item.id).then(res =>{
        if(res.code === 200){
            show(item.taskId)
            message.success(res.message)
          }else{
            message.error(res.message)
          }
      })
    }
    const addUser = (e) =>{
      e.preventDefault()
        formRef1.value?.validate((errors) => {
          if (!errors) {
            console.log(form1.value)
            HTTPAddUserTask(form1.value).then(res =>{
                if(res.code === 200){
                  show(form1.value.taskId)
                  message.success(res.message)
                }else{
                  message.error(res.message)
                }
              })
            active1.value = false
          }
        })
    }
    const show = (id) =>{
      HTTPGetTaskUser(id).then(res =>{
        data1.value = res
        active2.value = true
      })
    }
    return {
      formRef,
      formRef1,
      formRef2,
      rules,
      rules1,
      rules2,
      form,
      form1,
      form2,
      form3,
      stateOptions,
      actionType,
      userOptions,
      addTask,
      addUser,
      updateUserTask,
      query,
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