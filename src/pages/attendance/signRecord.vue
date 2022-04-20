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
      <n-form-item label='部门：' v-if="!isAuthPre('SIGN_RECORD:SELECTALL')">
        <n-select placeholder="请选择部门" v-model:value="form.departmentId" :options="departmentOptions" clearable style="width: 135px">
        </n-select>
      </n-form-item>
      <n-form-item label='员工姓名：' v-if="!isAuthPre('SIGN_RECORD:SELECTALL') || !isAuthPre('SIGN_RECORD:SELECTDEPT')">
        <n-input placeholder="请输入员工姓名"  v-model:value="form.userName" clearable style="width: 140px">
        </n-input>
      </n-form-item>
      <n-form-item label='年份：'>
        <n-date-picker placeholder="请选择年份" value-format="yyyy" v-model:formatted-value="form.year" type="year" clearable style="width: 135px"/>
      </n-form-item>
      <n-form-item label='月份：'>
        <n-date-picker placeholder="请选择月份" value-format="yyyy-MM" v-model:formatted-value="form.month" type="month" clearable style="width: 135px"/>
      </n-form-item>
      <n-form-item label='签到类型:' >
        <n-select placeholder="请选择签到类型" v-model:value="form.signinId" :options="signinOptions" clearable style="width: 135px">
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
  </n-card>
</template>
    
<script>
//表格数据  GET     /signIn/query/{userId}
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
      title: '签到时间（年）',
      key: 'year'
    },
    {
      title: '签到时间（月）',
      key: 'month'
    },
    {
      title: '签到时间（日）',
      key: 'day'
    },
    {
      title: '签到具体时间',
      key: 'time'
    },
    {
      title: '签到类型',
      key: 'signinSystem.name',
      render(row) {
          return h(
            NTag,
            {
              round: true,
              style: {
                marginRight: '6px',
              },
              type: row.signinSystem.name === '出勤' ? 'success' : 'error'
            },
            {
              default: () => row.signinSystem.name
            }
          )
      }
    }
  ]
}


import {HTTPGetSignRecord,HTTPGetDepartment,HTTPGetSignRecordSelective} from './HttpMethods'
export default defineComponent({
  setup () {
    const message = useMessage()
    const isAuthPre= getCurrentInstance()?.appContext.config.globalProperties.isAuthPer
    const data = ref([])
    onMounted(() => {
      getSignRecord()
      getOptions()
    })
    const form = ref({
      userId:localStorage.getItem('USERID'),
      userName: null,
      departmentId:null,
      year:null,
      month:null,
      signinId:null,
    })
    const departmentOptions = ref([])
    const signinOptions = ref([
      {
        value:1,
        label:"出勤"
      },
      {
        value:2,
        label:"迟到"
      },
    ])
    const query = () => {
      console.log(form.value)
      if(form.value.userName === ''){
        form.value.userName = null
      }
      HTTPGetSignRecordSelective(form.value).then(res =>{
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
    const getSignRecord = () => {
      let id = localStorage.getItem("USERID")
      HTTPGetSignRecord(id).then(res => {
        data.value = res
      })
    }
    return {
      isAuthPre,
      form,
      query,
      departmentOptions,
      signinOptions,
      data,
      columns: createColumns({
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>