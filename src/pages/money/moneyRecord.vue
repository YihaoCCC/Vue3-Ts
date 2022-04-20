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
      <n-form-item label='部门：' v-if="!isAuthPre('SALARY_RECORD:SELECTALL')">
        <n-select placeholder="请选择部门" v-model:value="form.departmentId" :options="departmentOptions" clearable style="width: 135px">
        </n-select>
      </n-form-item>
      <n-form-item label='员工姓名：' v-if="!isAuthPre('SALARY_RECORD:SELECTALL') || !isAuthPre('SALARY_RECORD:SELECTDEPT')">
        <n-input placeholder="请输入员工姓名"  v-model:value="form.userName" clearable style="width: 140px">
        </n-input>
      </n-form-item>
      <n-form-item label='年份：'>
        <n-date-picker placeholder="请选择年份" value-format="yyyy" v-model:formatted-value="form.year" type="year" clearable style="width: 135px"/>
      </n-form-item>
      <n-form-item label='月份：'>
        <n-date-picker placeholder="请选择月份" value-format="yyyy-MM" v-model:formatted-value="form.month" type="month" clearable style="width: 135px"/>
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
//表格数据  GET     /salary/query/{userId}
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
      title: '薪资日期（年）',
      key: 'year'
    },
    {
      title: '薪资日期（月）',
      key: 'month'
    },
    {
      title: '基本薪资',
      key: 'work'
    },
    {
      title: '迟到扣除',
      key: 'late'
    },
    {
      title: '旷工扣除',
      key: 'notWork'
    },
    {
      title: '出差补贴薪资',
      key: 'travel'
    },
    {
      title: '奖惩薪资',
      key: 'jiangcheng'
    },
    {
      title: '具体薪资',
      key: 'money'
    }
  ]
}

import {HTTPGetMoneyRecord,HTTPGetDepartment,HTTPGetMoneyRecordSelective} from './HttpMethods'
export default defineComponent({
  setup () {
    const message = useMessage()
    const isAuthPre= getCurrentInstance()?.appContext.config.globalProperties.isAuthPer
    const data = ref([])
    const form = ref({
      userId:localStorage.getItem('USERID'),
      userName: null,
      departmentId:null,
      year:null,
      month:null
    })
    const departmentOptions = ref([])
    onMounted(() => {
      getMoneyRecord()
      getOptions()
    })
    const query = () => {
      console.log(form.value)
      if(form.value.userName === ''){
        form.value.userName = null
      }
      HTTPGetMoneyRecordSelective(form.value).then(res =>{
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
    const getMoneyRecord = () => {
      let id = localStorage.getItem("USERID")
      HTTPGetMoneyRecord(id).then(res => {
        data.value = res
      })
    }
    return {
      isAuthPre,
      form,
      query,
      departmentOptions,
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