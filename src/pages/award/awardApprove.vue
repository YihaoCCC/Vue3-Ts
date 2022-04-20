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
      <n-form-item label='部门:' >
        <n-select placeholder="请选择部门" v-model:value="form1.departmentId" :options="departmentOptions" clearable style="width: 135px">
        </n-select>
      </n-form-item>
      <n-form-item label='员工姓名:' >
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
import { h, defineComponent, ref, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ AwardApprove }) => {
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
                        onClick: () => AwardApprove(row.id)
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

import {HTTPGetAwardApprove,HTTPUpdataAwardApprove,HTTPGetInstitution,HTTPGetDepartment,HTTPGetAwardApprovSelective} from './HttpMethods'
export default defineComponent({
  setup () {
    const message = useMessage()
    const data = ref([])
    const form1 = ref({
      userId:localStorage.getItem('USERID'),
      userName: null,
      departmentId:null,
      jiangchengId:null,
      type:null,
    })
    const departmentOptions = ref([])
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
    onMounted(() => {
      getAwardApprove()
      getOptions()
    })
    const getOptions = () => {
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
    const query = () => {
      console.log(form1.value)
      if(form1.value.userName === ''){
        form1.value.userName = null
      }
      HTTPGetAwardApprovSelective(form1.value).then(res =>{
        data.value = res
      })
    }
    //表格中的数据
    const getAwardApprove = () => {
      HTTPGetAwardApprove().then(res => {
        data.value = res
      })
    }
    //审批
    const AwardApprove = (id) => {
      HTTPUpdataAwardApprove(id).then(res =>{
          if(res.code === 200){
            getAwardApprove()
            message.success(res.message)
          }else{
            message.error(res.message)
          }
        })
    }
    return {
      form1,
      data,
      departmentOptions,
      institutionOptions,
      typeOptions,
      query,
      columns: createColumns({
        AwardApprove
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>