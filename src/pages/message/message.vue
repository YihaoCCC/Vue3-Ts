<template>
<n-card
    title=" "
    :segmented="{
      content: true,
      footer: 'soft'
    }"
    hoverable
  >
    <template #header-extra>
      <n-button tertiary type="primary" @click="handleActivate()" v-if="!isAuthPre('MESSAGE:INSERT')">
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
        <n-form ref="formRef" :model="form" :rules="rules">
          <n-form-item label='公告内容' path="content">
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
//添加公告  Post    /message/add       json{content，userId}
//删除     Delete    /message/delete/{id}
import { h, defineComponent, ref, onMounted, getCurrentInstance } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ deleteMessage,isAuthPre }) => {
  return [
    {
      title: '公告内容',
      key: 'content',
      width: 600,
      // ellipsis: {
      //   tooltip: true
      // }
    },
    {
      title: '发布人员工号',
      key: 'userId'
    },
    {
      title: '发布人姓名',
      key: 'user.name'
    },
    {
      title: '发布时间',
      key: 'date'
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
                        type: 'error',
                        text: true, 
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
    const formRef = ref(null)
    const message = useMessage()
    const isAuthPre= getCurrentInstance()?.appContext.config.globalProperties.isAuthPer
    const active = ref(false)
    let form = ref({
      userId:localStorage.getItem("USERID"),
      content:''
    })
    const data = ref([])
    const rules = ref({
      content: {
            required: true,
            message: '请输入公告内容',
            trigger: ['input', 'blur']
          }
    })
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
    const addMessage = (e) => {
      e.preventDefault()
      formRef.value?.validate((errors) => {
        if (!errors) {
          HTTPAddMessage(form.value).then(res =>{
            if(res.code === 200){
              getMessage()
              message.success(res.message)
            }else{
              message.error(res.message)
            }
          })
          active.value = false
          form.value = {
              userId:localStorage.getItem("USERID"),
              content:''
          }
        }
      })
    }
    //删除
    const deleteMessage = (id) => {
      HTTPDeleteMessage(id).then(res =>{
          if(res.code === 200){
            getMessage()
            message.success(res.message)
          }else{
            message.error(res.message)
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