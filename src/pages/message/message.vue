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
      <n-button tertiary type="primary" @click="handleActivate()" :disabled="isAuthPre('MESSAGE:INSERT')">
          添加公告
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
          公告信息
        </template>
        <n-form >
          <n-form-item label='公告内容' >
            <n-input placeholder="请输入公告内容" type='textarea' v-model:value="form.content">

            </n-input>
          </n-form-item>
        </n-form>
        <n-button @click="addMessage" type="primary">
          添加
        </n-button>
      </n-drawer-content>
    </n-drawer>
  </n-card>
    
</template>
    
<script>
//表格数据  GET     /message/queryAll
//添加公告  Post    /message/add       json{content，userId，name}
//删除     Delete    /message/delete/{id}
import { h, defineComponent, ref, onMounted, getCurrentInstance } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ deleteMessage,isAuthPre }) => {
  return [
    {
      title: '公告内容',
      key: 'content'
    },
    {
      title: '发布人员工号',
      key: 'userId'
    },
    {
      title: '发布人姓名',
      key: 'name'
    },
    {
      title: '发布时间',
      key: 'date'
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
                        type: 'error',
                        dashed: true,
                        style: {
                            marginRight: '6px'
                        },
                        size: 'small',
                        disabled:isAuthPre('MESSAGE:DELETE'),
                        onClick: () => deleteMessage(row.id)
                    },
                    
                    { default: () => '删除' }
                )
            } 
        })
        return button
      }
    }
  ]
}


import {HTTPGetMessage, HTTPAddMessage, HTTPDeleteMessage} from './HttpMethods'
export default defineComponent({
  setup () {
    const isAuthPre= getCurrentInstance()?.appContext.config.globalProperties.isAuthPer
    const active = ref(false)
    let form = ref({
      content:'',
      name: ''
    })
    const data = ref([])
    onMounted(() => {
      getMessage()
    })
    //表格中的数据
    const getMessage = () => {
      HTTPGetMessage().then(res => {
        data.value = res
      })
    }
    //添加 
    const addMessage = () => {
      form.value.userId = localStorage.getItem("USERID")
      form.value.name = localStorage.getItem("USERNAME")
      HTTPAddMessage(form.value).then(res =>{
          if(res.code === 200){
            getMessage()
          }
      })
      active.value = false
      form.value = {
          content:'',
          name: ''
      }
    }
    //删除
    const deleteMessage = (id) => {
      HTTPDeleteMessage(id).then(res =>{
          if(res.code === 200){
            getMessage()
          }
        })
    }
    const handleActivate= () => {
      active.value = true
    }
    return {
      isAuthPre,
      form,
      active,
      addMessage,
      handleActivate,
      data,
      columns: createColumns({
        deleteMessage,
        isAuthPre
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>