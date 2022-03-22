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
        <n-form >
          <n-form-item label='职位' >
            <n-select placeholder="请选择职位" v-model:value="form.positionId" :options="positionOptions">

            </n-select>
          </n-form-item>
          <n-form-item label='每天薪资' >
            <n-input-number placeholder="请输入每天薪资" v-model:value="form.money">
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
//删除     Delete    /salarySystem/delete/{id}
import { h, defineComponent, ref, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ handleActivate,deleteMoneyInstitution }) => {
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
      title: 'Action',
      key: 'actions',
      render (row) {
        const button = [1,2].map((item) => {
            if(item === 1) {
                return h(
                    NButton,
                    {
                        style: {
                            marginRight: '6px'
                        },
                        size: 'small',
                        onClick: () => handleActivate(1,row)
                    },
                    
                    { default: () => '修改' }
                )
            } else {
                return h(
                            NButton,
                            {
                                type: 'error',
                                dashed: true,    
                                style: {
                                    marginRight: '6px',
                                },
                                
                                size: 'small',
                                onClick: () => deleteMoneyInstitution(row.id)
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



import {HTTPGetMoneyInstitution, HTTPAddMoneyInstitution, HTTPUpdataMoneyInstitution, HTTPDeleteMoneyInstitution,HTTPGetPosition} from './HttpMethods'
export default defineComponent({
  setup () {
    const active = ref(false)
    let form = ref({
          positionId: null,
          money: ''
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
    const addMoneyInstitution = () => {
      if( !actionType.value ) {
        HTTPAddMoneyInstitution(form.value).then(res =>{
          if(res.code === 200){
            getMoneyInstitution()
          }
        })
      } else {
        HTTPUpdataMoneyInstitution(form.value).then(res =>{
          if(res.code === 200){
            getMoneyInstitution()
          }
        })
      }
      active.value = false
    }
    //删除
    const deleteMoneyInstitution = (id) => {
      HTTPDeleteMoneyInstitution(id).then(res =>{
          if(res.code === 200){
            getMoneyInstitution()
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
          money: ''
        }
        actionType.value = 0
      } 
    }
    return {
      form,
      actionType,
      addMoneyInstitution,
      deleteMoneyInstitution,
      positionOptions,
      active,
      handleActivate,
      data,
      columns: createColumns({
        handleActivate,
        deleteMoneyInstitution
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>