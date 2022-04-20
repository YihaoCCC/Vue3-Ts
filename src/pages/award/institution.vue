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
      <n-form-item label='制度名字:' >
        <n-input placeholder="请输入制度名字"  v-model:value="form1.name" clearable style="width: 140px">
        </n-input>
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
    <template #header-extra>
      <n-button tertiary type="primary" @click="handleActivate(0)">
          添加奖惩制度
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
          部门信息
        </template>
        <n-form ref="formRef" :model="form" :rules="rules">
          <n-form-item label='奖惩制度名字：' path="name">
            <n-input placeholder="请输入奖惩制度名字"  v-model:value="form.name" >

            </n-input>
          </n-form-item>
          <n-form-item label='奖惩类型：' path="type">
            <n-radio-group v-model:value="form.type" name="radiogroup">
              <n-radio value="奖励">奖励</n-radio>
              <n-radio value='惩罚'>惩罚</n-radio>
            </n-radio-group>
          </n-form-item>
          <n-form-item label='奖惩金额：' path="money">
            <n-input-number placeholder="请输入奖惩金额" v-model:value="form.money">
                <template #prefix>￥</template>
            </n-input-number>
          </n-form-item>
        </n-form>
        <n-button @click="addInstitution" type="primary">
          {{!actionType ? '添加' : '修改'}}
        </n-button>
      </n-drawer-content>
    </n-drawer>
  </n-card>

</template>

<script>
//表格数据  GET     /jiangchengSystem/queryAll
//添加  Post    /jiangchengSystem/add       json{name，money，type}
//修改     PUT     /jiangchengSystem/update    json{id,name，money，type}
import { h, defineComponent, ref, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ handleActivate }) => {
  return [
    {
      title: '奖惩制度名字',
      key: 'name'
    },
    {
      title: '奖惩类型',
      key: 'type',
      render(row) {
          return h(
            NTag,
            {
              round: true,
              style: {
                marginRight: '6px',
              },
              type: row.type === '奖励' ? 'success' : 'error'
            },
            {
              default: () => row.type
            }
          )
      }
    },
    {
      title: '奖惩金额',
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
                        onClick: () => handleActivate(1,row)
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

import {HTTPGetInstitution, HTTPAddInstitution, HTTPUpdataInstitution,HTTPGetInstitutionSelective} from './HttpMethods'
export default defineComponent({
  setup () {
    const message = useMessage()
    const formRef = ref(null)
    const active = ref(false)
    const form = ref({
          name: '',
          type: '',
          money: ''
    })
    const form1 = ref({
          name: null,
          type: null
    })
    const rules = ref({
      name: {
            required: true,
            message: '请输入奖惩制度名字',
            trigger: ['input', 'blur']
          },
      type: {
            required: true,
            message: '请选择奖惩类型',
            trigger: ['change', 'blur']
          },
      money: {
            type: 'number',
            required: true,
            message: '请输入奖惩金额',
            trigger: ['input', 'blur']
          }
    })
    const data = ref([])
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
      getInstitution()
    })
    const query = () => {
      console.log(form1.value)
      if(form1.value.name === ''){
        form1.value.name = null
      }
      HTTPGetInstitutionSelective(form1.value).then(res =>{
        data.value = res
      })
    }
    const actionType = ref(0)  // 0代表增加，1代表修改
    //表格中的数据
    const getInstitution = () => {
      HTTPGetInstitution().then(res => {
        data.value = res
      })
    }
    //添加
    //修改
    const addInstitution = (e) => {
      e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            if( !actionType.value ) {
              HTTPAddInstitution(form.value).then(res =>{
                if(res.code === 200){
                  getInstitution()
                  message.success(res.message)
                }else{
                  message.error(res.message)
                }
              })
            } else {
              HTTPUpdataInstitution(form.value).then(res =>{
                if(res.code === 200){
                  getInstitution()
                  message.success(res.message)
                }else{
                  message.error(res.message)
                }
              })
            }
            active.value = false
          }
        })
    }
    const handleActivate= (type, item) => {
      active.value = true
      if( type ) {
        form.value = item
        actionType.value = 1
      } else {
        form.value = {
          name: '',
          type: '',
          money: ''
        }
        actionType.value = 0
      } 
    }
    return {
      formRef,
      rules,
      form,
      form1,
      actionType,
      typeOptions,
      addInstitution,
      active,
      handleActivate,
      query,
      data,
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