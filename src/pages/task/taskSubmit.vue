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
      <n-form-item label='任务名字：'>
        <n-input placeholder="请输入任务名字"  v-model:value="form1.name" clearable style="width: 145px">
        </n-input>
      </n-form-item>
      <n-form-item label='任务状态:' >
        <n-select placeholder="请选择任务状态" v-model:value="form1.state" :options="stateOptions" clearable style="width: 135px">
        </n-select>
      </n-form-item>
      <n-form-item>
      <n-button tertiary type="primary" @click="query">
        查询
      </n-button>
    </n-form-item>
    </n-form>
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
        <n-form label-placement="left" ref="formRef" :model="form" :rules="rules"
        label-width="auto" require-mark-placement="right-hanging">
          <n-form-item label='任务名字：' >
            {{form.task.name}}
          </n-form-item>
          <n-form-item label='任务内容：' >
            {{form.task.content}}
          </n-form-item>
          <n-form-item label='任务要求：' >
            {{form.taskWork}}
          </n-form-item>
          <n-form-item label='提交内容：' path="content">
            <n-input placeholder="请输入提交内容" type='textarea' v-model:value="form.content" >
            </n-input>
          </n-form-item>
          <n-form-item label='任务意见：' >
            {{form.view}}
          </n-form-item>
          <n-form-item label='任务状态：' >
            {{form.state}}
          </n-form-item>
        </n-form>
        <n-button @click="submit" type="primary">
          提交
        </n-button>
      </n-drawer-content>
    </n-drawer>
  </n-card>

</template>

<script>
//表格数据    Get  /userTask/queryByUserId/{userId}
//提交      Put    /userTask/update    json{id,taskId,userId,content,state}  其实就是修改
import { h, defineComponent, ref, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ handleActivate }) => {
  return [
    {
      title:'任务名字',
      key:'task.name',
      width: 100,
    },
    {
      title: '任务内容',
      key: 'task.content',
      width: 200,
      // ellipsis: {
      //   tooltip: true
      // }
    },
    {
      title: '任务要求',
      key: 'taskWork',
      width: 200,
      // ellipsis: {
      //   tooltip: true
      // }
    },
    // {
    //   title: '发布人员工号',
    //   key: 'task.userId'
    // },
    {
      title: '发布人',
      key: 'task.user.name'
    },
    {
      title: '开始时间',
      key: 'task.beginDate'
    },
    {
      title: '结束时间',
      key: 'task.endDate'
    },
    {
      title: '提交的内容',
      key: 'content',
      width: 200,
      // ellipsis: {
      //   tooltip: true
      // }
    },
    {
      title: '任务意见',
      key: 'view',
      width: 200,
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
        const button = [1].map((item) => {
            if(item === 1) {
                return h(
                    NButton,
                    {
                        type:'info',
                        text: true,
                        style: {
                            marginRight: '6px'
                        },
                        size: 'small',
                        onClick: () => handleActivate(row)
                    },
                    
                    { default: () => '提交' }
                )
            } 
        })
        return button
      }
    }
  ]
}


import {HTTPGetUserTask, HTTPUpdateUserTask,HTTPGetUserTaskSelective} from './HttpMethods'
export default defineComponent({
  setup () {
    const formRef = ref(null)
    const message = useMessage()
    const active = ref(false)
    const form = ref({
      content:''
    })
    const form1 = ref({
      userId:localStorage.getItem('USERID'),
      name: null,
      state:null
    })
    const rules = ref({
      content: {
            required: true,
            message: '请输入任务内容',
            trigger: ['input', 'blur']
          },
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
    const data = ref([])
    onMounted(() => {
      getUserTask()
    })
    const query = () => {
      console.log(form1.value)
      if(form1.value.name === ''){
        form1.value.name = null
      }
      HTTPGetUserTaskSelective(form1.value).then(res =>{
        data.value = res
      })
    }
    //表格中的数据
    const getUserTask = () => {
      let id = localStorage.getItem("USERID")
      HTTPGetUserTask(id).then(res => {
        data.value = res
      })
    }
    //修改
    const submit = (e) => {
      e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            HTTPUpdateUserTask(form.value).then(res =>{
              if(res.code === 200){
                getUserTask()
                message.success(res.message)
              }else{
                message.error(res.message)
              }
            })
          active.value = false
          }
        })
    }
    const handleActivate= (item) => {
      active.value = true
      form.value = item
      console.log(form.value)
    }
    return {
      formRef,
      form1,
      rules,
      stateOptions,
      form,
      active,
      data,
      query,
      submit,
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