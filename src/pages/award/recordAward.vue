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
        <n-form> 
          <n-form-item label='员工姓名' >
            <n-select placeholder="请选择员工" v-model:value="form.userId" :options="userOptions">

            </n-select>
          </n-form-item>
          <n-form-item label='奖惩名' >
            <n-select placeholder="请选择奖惩名" v-model:value="form.jiangchengId" :options="institutionOptions">

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
import { h, defineComponent, ref,  onMounted } from 'vue'
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
      title: '奖惩原因',
      key: 'jiangchengSystem.name'
    },
    {
      title: '奖惩金额',
      key: 'jiangchengSystem.money'
    },
    {
      title: '奖惩类型',
      key: 'jiangchengSystem.type'
    },
    // {
    //   title: '奖惩类型',
    //   key: 'name',
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
    // },
    {
      title: '奖惩时间',
      key: 'date'
    }
  ]
}

import {HTTPGetRecordAward, HTTPAddRecordAward} from './HttpMethods'
export default defineComponent({
  setup () {
    const active = ref(false)
    let form = ref({
          userId: '',
          jiangchengId: ''
    })
    const data = ref([])
    const userOptions = ref([])
    const institutionOptions = ref([])
    onMounted(() => {
      getRecordAward()
      getOptions()
    })
    const getOptions = () => {
      // HTTPGetDepartment().then(res =>{
      //   res.forEach(element => {
      //     departmentOptions.value.push({
      //       value: element.id,
      //       lable: element.name
      //       })
      //     });
      // })
      // HTTPGetPosition().then( res =>{
      //   res.forEach(element => {
      //     positionOptions.value.push({
      //       value: element.id,
      //       lable: element.name
      //       })
      //     });
      // })
    }
    //表格中的数据  Get请求     /jiangcheng/query/{userId}
    const getRecordAward = () => {
      HTTPGetRecordAward().then(res => {
        data.value = res
      })
    }
    //添加  Post   /user/add       json{userId,jiangchengId}
    const addRecordAward = () => {
      HTTPAddRecordAward(form.value).then(res =>{
          if(res.code === 200){
            getRecordAward()
          }
      })
      active.value = false
    }
    const handleActivate= (type, item) => {
      active.value = true
    }
    return {
      form,
      userOptions,
      institutionOptions,
      addRecordAward,
      handleActivate,
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