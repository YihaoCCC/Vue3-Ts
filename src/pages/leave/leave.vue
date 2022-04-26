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
      <n-form-item label='部门:' v-if="!isAuthPre('LEAVE_RECORD:SELECTALL')">
        <n-select placeholder="请选择部门" v-model:value="form1.departmentId" :options="departmentOptions" clearable style="width: 135px">
        </n-select>
      </n-form-item>
      <n-form-item label='员工姓名:' v-if="!isAuthPre('LEAVE_RECORD:SELECTALL') || !isAuthPre('LEAVE_RECORD:SELECTDEPT')">
        <n-input placeholder="请输入员工姓名"  v-model:value="form1.userName" clearable style="width: 145px">
        </n-input>
      </n-form-item>
      <n-form-item label='审批状态:' >
        <n-select placeholder="请选择审批状态" v-model:value="form1.state" :options="stateOptions" clearable style="width: 135px">
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
      <n-button tertiary type="primary" @click="handleActivate()">
          申请请假
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
          请假记录信息
        </template>
        <n-form ref="formRef" :model="form" :rules="rules"
        label-placement="left" label-width="auto" require-mark-placement="right-hanging"> 
          <n-form-item label='请假时间:' path="date">
            <n-date-picker v-model:formatted-value="form.date" value-format="yyyy-MM-dd" type="daterange" clearable />
          </n-form-item>
          <n-form-item label='请假原因:' path="reason">
             <n-input placeholder="请输入请假原因" type='textarea' v-model:value="form.reason" clearable>
            </n-input>
          </n-form-item>
        </n-form>
        <n-button @click="addLeave" type="primary" tertiary>
          添加
        </n-button>
      </n-drawer-content>
    </n-drawer>
  </n-card>

</template>

<script>
//表格数据  GET     /leave/query/{userId}
//添加  Post    /leave/add       json{userId，name，reason，beginDate，endDate}
import { h, defineComponent, ref, onMounted,getCurrentInstance } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = () => {
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
      title: '部门',
      key: 'user.department.name'
    },
    {
      title: '请假原因',
      key: 'reason',
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
      title: '审批状态',
      key: 'state',
      render(row) {
          return h(
            NTag,
            {
              round: true,
              style: {
                marginRight: '6px',
              },
              type: row.state === '批准' ? 'success' : 'error'
            },
            {
              default: () => row.state
            }
          )
      }
    }
  ]
}

import {HTTPGetLeave, HTTPAddLeave,HTTPGetDepartment,HTTPGetLeaveSelective} from './HttpMethods'

export default defineComponent({
  setup () {
    const formRef = ref(null)
    const message = useMessage()
    const isAuthPre= getCurrentInstance()?.appContext.config.globalProperties.isAuthPer
    const active = ref(false)
    let form = ref({
          userId:localStorage.getItem("USERID"),
          date:null,
          beginDate: '',
          endDate: '',
          reason:''
    })
    const form1 = ref({
      userId:localStorage.getItem('USERID'),
      userName: null,
      departmentId:null,
      state:null
    })
    const departmentOptions = ref([])
    const stateOptions = ref([
      {
        value:"批准",
        label:"批准"
      },
      {
        value:"未批准",
        label:"未批准"
      },
    ])
    const data = ref([])
    const rules = ref({
      date: {
            type: 'array',
            required: true,
            message: '请选择请假时间',
            trigger: ['change', 'blur']
          },
      reason: {
            required: true,
            message: '请输入请假原因',
            trigger: ['input', 'blur']
          }
    })
    onMounted(() => {
      getLeave()
      getOptions()
    })
    const query = () => {
      console.log(form1.value)
      if(form1.value.userName === ''){
        form1.value.userName = null
      }
      HTTPGetLeaveSelective(form1.value).then(res =>{
        data.value = res
      })
    }
    const getOptions = () => {
      HTTPGetDepartment().then(res =>{
        res.forEach(element => {
          departmentOptions.value.push({
            value: element.id,
            label: element.name
            })
          });
      })
    }
    //表格中的数据
    const getLeave = () => {
      let id = localStorage.getItem("USERID")
      HTTPGetLeave(id).then(res => {
        data.value = res
      })
    }
    //添加 
    const addLeave = (e) => {
      e.preventDefault()
      formRef.value?.validate((errors) => {
        if (!errors) {
          form.value.beginDate = form.value.date[0]
          form.value.endDate = form.value.date[1]
          console.log(form.value)
          HTTPAddLeave(form.value).then(res =>{
              if(res.code === 200){
                getLeave()
                message.success(res.message)
              }else{
                message.error(res.message)
              }
          })
          form.value = {
              userId:localStorage.getItem("USERID"),
              date:null,
              beginDate: '',
              endDate: '',
              reason:''
          }
          console.log(form.value)
          active.value = false
        }
      })
    }
    const handleActivate= () => {
      active.value = true
    }
    return {
      formRef,
      rules,
      isAuthPre,
      form,
      form1,
      active,
      data,
      departmentOptions,
      stateOptions,
      query,
      addLeave,
      handleActivate,
      columns: createColumns({
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>