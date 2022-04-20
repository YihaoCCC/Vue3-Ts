<template>
    <n-card hoverable>
        <n-data-table
        :bordered="false"
        :columns="columns"
        :data="data"
        :pagination="pagination"
        />
        <n-drawer v-model:show="active" :width="502">
          <n-drawer-content>
            <template #header>
              考勤类型制度信息
            </template>
            <n-form ref="formRef" :model="form" :rules="rules">
              <n-form-item label='考勤类型制度名称：' path="name">
                {{form.name}}
                <!-- <n-input  v-model:value="form.name" disabled>
                </n-input> -->
              </n-form-item>
              <n-form-item label='奖罚金额：' path="money">
                <n-input-number placeholder="请输入奖罚金额" v-model:value="form.money" clearable>
                  <template #prefix>￥</template>
                </n-input-number>
              </n-form-item>
            </n-form>
            <n-button @click="update" type="primary">
              修改
            </n-button>
          </n-drawer-content>
        </n-drawer>
    </n-card>
</template>
    
<script>
//表格数据  GET     /signinSystem/queryAll
//修改  Put   /signinSystem/update     json{id,name,money}  只能修改奖罚金额
import { h, defineComponent, ref, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ handleActivate }) => {
  return [
    {
      title: '考勤类型制度名称',
      key: 'name',
      width: 400
    },
    {
      title: '奖罚金额',
      key: 'money'
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
                        onClick: () => handleActivate(row)
                    },
                    
                    { default: () => '修改' }
                )
            }
        })
        return button
      }
    }
  ]
}


import {HTTPGetAttendanceType,HTTPUpdAtaattendanceType} from './HttpMethods'
export default defineComponent({
  setup () {
    const formRef = ref(null)
    const message = useMessage()
    const active = ref(false)
    let form = ref({
          name: '',
          money: ''
    })
    const data = ref([])
    const rules = ref({
      name: {
            required: true,
            message: '请输入考勤类型制度名称',
            trigger: ['input', 'blur']
          },
      money: {
            type: 'number',
            required: true,
            message: '请输入奖罚金额',
            trigger: ['input', 'blur']
          }
    })
    onMounted(() => {
      getAttendanceType()
    })
    //表格中的数据
    const getAttendanceType = () => {
      HTTPGetAttendanceType().then(res => {
        data.value = res
      })
    }
    //修改
    const update = (e) => {
      e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            HTTPUpdAtaattendanceType(form.value).then(res =>{
              if(res.code === 200){
                getAttendanceType()
                message.success(res.message)
              }else{
                message.error(res.message)
              }
            })
            active.value = false
          } 
        })
     
    }
    const handleActivate = (item) => {
      active.value = true
      form.value = item
    }
    return {
      formRef,
      rules,
      form,
      data,
      handleActivate,
      active,
      update,
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