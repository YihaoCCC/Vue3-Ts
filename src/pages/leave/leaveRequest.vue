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
      <n-form-item label='部门:' v-if="!isAuthPre('LEAVE_APPROVE:SELECTALL')">
        <n-select placeholder="请选择部门" v-model:value="form.departmentId" :options="departmentOptions" clearable style="width: 180px">
        </n-select>
      </n-form-item>
      <n-form-item label='员工姓名:' v-if="!isAuthPre('LEAVE_APPROVE:SELECTALL') || !isAuthPre('LEAVE_APPROVE:SELECTDEPT')">
        <n-input placeholder="请输入员工姓名"  v-model:value="form.userName" clearable>
        </n-input>
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
//表格数据  GET     /leave/queryUnapproved/{userId}
//批准  Put    /leave/update/{id}       
import { h, defineComponent, ref, onMounted,getCurrentInstance } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ LeaveRequest }) => {
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
                        type: 'info',
                        text: true,
                        style: {
                            marginRight: '6px'
                        },
                        size: 'small',
                        onClick: () => LeaveRequest(row.id)
                    },
                    
                    { default: () => '批准' }
                )
            } 
        })
        return button
      }
    }
  ]
}

import {HTTPGetLeaveRequest,HTTPUpdataLeaveRequest,HTTPGetDepartment,HTTPGetLeaveRequestSelective} from './HttpMethods'
export default defineComponent({
  setup () {
    const message = useMessage()
    const isAuthPre= getCurrentInstance()?.appContext.config.globalProperties.isAuthPer
    const data = ref([])
    const form = ref({
      userId:localStorage.getItem('USERID'),
      userName: null,
      departmentId:null
    })
    const departmentOptions = ref([])
    onMounted(() => {
      getLeaveRequest()
      getOptions()
    })
    const query = () => {
      console.log(form.value)
      if(form.value.userName === ''){
        form.value.userName = null
      }
      HTTPGetLeaveRequestSelective(form.value).then(res =>{
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
    const getLeaveRequest = () => {
      let id = localStorage.getItem("USERID")
      HTTPGetLeaveRequest(id).then(res => {
        data.value = res
      })
    }
    //审批
    const LeaveRequest = (id) => {
      HTTPUpdataLeaveRequest(id).then(res =>{
          if(res.code === 200){
            getLeaveRequest()
            message.success(res.message)
          }else{
            message.error(res.message)
          }
        })
    }
    return {
      isAuthPre,
      form,
      query,
      departmentOptions,
      data,
      columns: createColumns({
        LeaveRequest
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>