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
      <n-form-item label='部门:' v-if="!isAuthPre('JIANGCHENG_RECORD:SELECTALL')">
        <n-select placeholder="请选择部门" v-model:value="form1.departmentId" :options="departmentOptions" clearable style="width: 135px">
        </n-select>
      </n-form-item>
      <n-form-item label='员工姓名:' v-if="!isAuthPre('JIANGCHENG_RECORD:SELECTALL') || !isAuthPre('JIANGCHENG_RECORD:SELECTDEPT')">
        <n-input placeholder="请输入员工姓名"  v-model:value="form1.userName" clearable style="width: 140px">
        </n-input>
      </n-form-item>
      <n-form-item label='奖惩原因:'>
        <n-select placeholder="请选择奖惩原因" v-model:value="form1.jiangchengId" :options="institutionOptions" clearable style="width: 135px">
        </n-select>
      </n-form-item>
      <n-form-item label='奖惩类型:' >
        <n-select placeholder="请选择奖惩类型" v-model:value="form1.type" :options="typeOptions" clearable style="width: 135px">
        </n-select>
      </n-form-item>
      <n-form-item label='奖惩状态:' >
        <n-select placeholder="请选择奖惩状态" v-model:value="form1.state" :options="stateOptions" clearable style="width: 135px">
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
      <n-button tertiary type="primary" @click="handleActivate()" 
      v-if="!isAuthPre('JIANGCHENG_RECORD:INSERTALL') || !isAuthPre('JIANGCHENG_RECORD:INSERTDEPT')"
      >
          添加奖惩记录
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
          奖惩记录信息
        </template>
        <n-form ref="formRef" :model="form" :rules="rules"> 
          <n-form-item label='员工姓名：' path="userId">
            <n-select placeholder="请选择员工" v-model:value="form.userId" :options="userOptions" clearable>
            </n-select>
          </n-form-item>
          <n-form-item label='奖惩名：' path="jiangchengId">
            <n-select placeholder="请选择奖惩名" v-model:value="form.jiangchengId" :options="institutionOptions" clearable>
            </n-select>
          </n-form-item>
        </n-form>
        <n-button @click="addRecordAward" type="primary">
          添加
        </n-button>
      </n-drawer-content>
    </n-drawer>
  </n-card>

</template>

<script>
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
      title: '奖惩原因',
      key: 'jiangchengSystem.name'
    },
    {
      title: '奖惩金额',
      key: 'jiangchengSystem.money'
    },
    {
      title: '奖惩类型',
      key: 'jiangchengSystem.type',
      render(row) {
          return h(
            NTag,
            {
              round: true,
              style: {
                marginRight: '6px',
              },
              type: row.jiangchengSystem.type === '奖励' ? 'success' : 'error'
            },
            {
              default: () => row.jiangchengSystem.type
            }
          )
      }
    },
    {
      title: '奖惩时间',
      key: 'date'
    },
    {
      title:'奖惩状态',
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
    },
    {
      title: '批准时间',
      key: 'agreeDate'
    },
  ]
}

import {HTTPGetRecordAward, HTTPAddRecordAward,HTTPGetInstitution,HTTPGetUser,HTTPGetDepartment,HTTPGetRecordAwardSelective} from './HttpMethods'
export default defineComponent({
  setup () {
    const formRef = ref(null)
    const message = useMessage()
    const isAuthPre= getCurrentInstance()?.appContext.config.globalProperties.isAuthPer
    const active = ref(false)
    const form = ref({
          userId: '',
          jiangchengId: ''
    })
    const form1 = ref({
      userId:localStorage.getItem('USERID'),
      userName: null,
      departmentId:null,
      jiangchengId:null,
      type:null,
      state:null
    })
    const data = ref([])
    const departmentOptions = ref([])
    const userOptions = ref([])
    const institutionOptions = ref([])
    const typeOptions = ref([
      {
        value:"奖励",
        label:"奖励"
      },
      {
        value:"惩罚",
        label:"惩罚"
      },
    ])
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
    const rules = ref({
      userId: {
            required: true,
            message: '请选择员工',
            trigger: ['change', 'blur']
          },
      jiangchengId: {
            type: 'number',
            required: true,
            message: '请选择奖惩',
            trigger: ['change', 'blur']
          }
    })
    onMounted(() => {
      getRecordAward()
      getOptions()
    })
    const query = () => {
      console.log(form1.value)
      if(form1.value.userName === ''){
        form1.value.userName = null
      }
      HTTPGetRecordAwardSelective(form1.value).then(res =>{
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
      HTTPGetInstitution().then( res =>{
        res.forEach(element => {
          institutionOptions.value.push({
            value: element.id,
            label: element.name
            })
          });
      })
      HTTPGetDepartment().then(res =>{
        res.forEach(element => {
          departmentOptions.value.push({
            value: element.id,
            label: element.name
            })
          });
      })
    }
    //表格中的数据  Get请求     /jiangcheng/query/{userId}
    const getRecordAward = () => {
      let id = localStorage.getItem("USERID")
      HTTPGetRecordAward(id).then(res => {
        data.value = res
      })
    }
    //添加  Post   /user/add       json{userId,jiangchengId}
    const addRecordAward = (e) => {
      e.preventDefault()
      console.log(form.value)
      formRef.value?.validate((errors) => {
          if (!errors) {
            HTTPAddRecordAward(form.value).then(res =>{
                if(res.code === 200){
                  getRecordAward()
                  message.success(res.message)
                }else{
                  message.error(res.message)
                }
            })
            form.value = {
              userId: '',
              jiangchengId: ''
            }
            active.value = false
          }
        })
      
    }
    const handleActivate= () => {
      form.value = {
        userId: '',
        jiangchengId: ''
      }
      active.value = true
    }
    return {
      formRef,
      rules,
      isAuthPre,
      form,
      form1,
      userOptions,
      institutionOptions,
      departmentOptions,
      typeOptions,
      stateOptions,
      addRecordAward,
      handleActivate,
      query,
      active,
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