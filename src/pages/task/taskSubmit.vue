<template>
  <n-card
    title="卡片分段示例"
    :segmented="{
      content: true,
      footer: 'soft'
    }"
    hoverable
  >
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
          <n-form-item label='提交内容' >
            <n-input placeholder="请输入提交内容" type='textarea' v-model:value="form.content" >

            </n-input>
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
      title: '任务内容',
      key: 'task.content'
    },
    {
      title: '发布人员工号',
      key: 'task.userId'
    },
    {
      title: '发布人姓名',
      key: 'task.name'
    },
    {
      title: '任务所属部门',
      key: 'task.department.name'
    },
    {
      title: '开始时间',
      key: 'task.beginDate'
    },
    {
      title: '提交的内容',
      key: 'content'
    },
    {
      title: '结束时间',
      key: 'task.endDate'
    },
    {
      title: '任务状态',
      key: 'state'
    },
    {
      title: 'Action',
      key: 'actions',
      render (row) {
        const button = [1].map((item) => {
            if(item === 1) {
                return h(
                    NButton,
                    {
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


import {HTTPGetTaskSubmit, HTTPUpdateTaskSubmit} from './HttpMethods'
export default defineComponent({
  setup () {
    const active = ref(false)
    let form = ref({
      content:''
    })
    const data = ref([])
    onMounted(() => {
      getTaskSubmit()
    })
    //表格中的数据
    const getTaskSubmit = () => {
      let id = localStorage.getItem("USERID")
      HTTPGetTaskSubmit(id).then(res => {
        data.value = res
      })
    }
    //修改
    const submit = () => {
      HTTPUpdateTaskSubmit(form.value).then(res =>{
          if(res.code === 200){
            getTaskSubmit()
          }
        })
      active.value = false
    }
    const handleActivate= (item) => {
      active.value = true
      form.value = item
    }
    return {
      form,
      active,
      data,
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