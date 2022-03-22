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
      <n-button tertiary type="primary" @click="handleActivate()">
          申请出差
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
          出差记录信息
        </template>
        <n-form> 
          <n-form-item label='出差时间' >
            <n-date-picker v-model:formatted-value="form.date" value-format="yyyy-MM-dd" type="daterange" clearable />
          </n-form-item>
          <n-form-item label='出差原因' >
             <n-input placeholder="请输入出差原因"  v-model:value="form.reason">

            </n-input>
          </n-form-item>
        </n-form>
        <n-button @click="addWorkOut" type="primary">
          添加
        </n-button>
      </n-drawer-content>
    </n-drawer>
  </n-card>

</template>

<script>
//表格数据  GET     /travel/query/{userId}
//添加  Post    /travel/add       json{userId，name，reason，beginDate，endDate}
import { h, defineComponent, ref, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = () => {
  return [
    {
      title: '员工号',
      key: 'userId'
    },
    {
      title: '员工姓名',
      key: 'name'
    },
    {
      title: '出差原因',
      key: 'reason'
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
      key: 'state'
    }
    // {
    //   title: '审批状态',
    //   key: 'tags',
    //   render (row) {
    //     const tags = row.tags.map((tagKey) => {
    //       return h(
    //         NTag,
    //         {
    //           style: {
    //             marginRight: '6px'
    //           },
    //           type: 'info'
    //         },
    //         {
    //           default: () => tagKey
    //         }
    //       )
    //     })
    //     return tags
    //   }
    // }
  ]
}

import {HTTPGetWorkOut, HTTPAddWorkOut} from './HttpMethods'
export default defineComponent({
  setup () {
    const active = ref(false)
    let form = ref({
          date:null,
          beginDate: '',
          endDate: '',
          reason:''
    })
    const data = ref([])
    onMounted(() => {
      getWorkOut()
    })
    //表格中的数据
    const getWorkOut = () => {
      let id = localStorage.getItem("USERID")
      HTTPGetWorkOut(id).then(res => {
        data.value = res
      })
    }
    //添加 
    const addWorkOut = () => {
      console.log(form.value)
      // HTTPAddLeave(form.value).then(res =>{
      //     if(res.code === 200){
      //       getLeave()
      //     }
      // })
      active.value = false
    }
    const handleActivate= () => {
      active.value = true
    }
    return {
      form,
      active,
      data,
      addWorkOut,
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