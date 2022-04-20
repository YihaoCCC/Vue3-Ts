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
      <n-button tertiary type="primary" @click="handleActivate(0)">
          添加薪资制度
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
          <n-form-item label='职位' path="positionId">
            <n-select placeholder="请选择职位" v-model:value="form.positionId" :options="positionOptions" :disabled="actionType === 1 ? true:false" clearable>
            </n-select>
          </n-form-item>
          <n-form-item label='每天薪资' path="money">
            <n-input-number placeholder="请输入每天薪资" v-model:value="form.money" clearable>
              <template #prefix>￥</template>
            </n-input-number>
          </n-form-item>
        </n-form>
        <n-button @click="addMoneyInstitution" type="primary">
          {{!actionType ? '添加' : '修改'}}
        </n-button>
      </n-drawer-content>
    </n-drawer>
  </n-card>

</template>

<script>
//表格数据  GET     /salarySystem/queryAll
//添加     Post    /salarySystem/add       json{positionId,money}
//修改     PUT     /salarySystem/update    json{id,positionId,money}
import { h, defineComponent, ref, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ handleActivate}) => {
  return [
    {
      title: '职位名称',
      key: 'position.name'
    },
    {
      title: '每天薪资',
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



import {HTTPGetMoneyInstitution, HTTPAddMoneyInstitution, HTTPUpdataMoneyInstitution,HTTPGetPosition} from './HttpMethods'
export default defineComponent({
  setup () {
    const formRef = ref(null)
    const message = useMessage()
    const active = ref(false)
    let form = ref({
          positionId: null,
          money: 0
    })
    const rules = ref({
      positionId: {
            type: 'number',
            required: true,
            message: '请选择职位',
            trigger: ['change', 'blur']
          },
      money: {
            type: 'number',
            required: true,
            message: '请输入每天薪资',
            trigger: ['input', 'blur']
          }
    })
    const data = ref([])
    const positionOptions = ref([])
    onMounted(() => {
      getMoneyInstitution()
      getOptions()
    })
    const getOptions = () => {
      HTTPGetPosition().then( res =>{
        res.forEach(element => {
          positionOptions.value.push({
            value: element.id,
            label: element.name
            })
          });
      })
    }
    const actionType = ref(0)  // 0代表增加，1代表修改
    //表格中的数据
    const getMoneyInstitution = () => {
      HTTPGetMoneyInstitution().then(res => {
        data.value = res
      })
    }
    //添加
    //修改
    const addMoneyInstitution = (e) => {
      e.preventDefault()
      formRef.value?.validate((errors) => {
        if (!errors) {
          if( !actionType.value ) {
          HTTPAddMoneyInstitution(form.value).then(res =>{
            if(res.code === 200){
              getMoneyInstitution()
              message.success(res.message)
            }else{
              message.error(res.message)
            }
          })
        } else {
          HTTPUpdataMoneyInstitution(form.value).then(res =>{
            if(res.code === 200){
              getMoneyInstitution()
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
          positionId: null,
          money: 0
        }
        actionType.value = 0
      } 
    }
    return {
      formRef,
      rules,
      form,
      actionType,
      addMoneyInstitution,
      positionOptions,
      active,
      handleActivate,
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