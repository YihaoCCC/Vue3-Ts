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
        <n-form >
          <n-form-item label='奖惩制度名字' >
            <n-input placeholder="请输入奖惩制度名字"  v-model:value="form.name" >

            </n-input>
          </n-form-item>
          <n-form-item label='奖惩类型'>
            <n-radio-group v-model:value="form.type" name="radiogroup">
              <n-radio value="奖励">奖励</n-radio>
              <n-radio value='惩罚'>惩罚</n-radio>
            </n-radio-group>
          </n-form-item>
          <n-form-item label='奖惩金额' >
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
      key: 'type'
    },
    // {
    //   title: '奖惩类型',
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
    // },
    {
      title: '奖惩金额',
      key: 'money'
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

import {HTTPGetInstitution, HTTPAddInstitution, HTTPUpdataInstitution} from './HttpMethods'
export default defineComponent({
  setup () {
    const active = ref(false)
    let form = ref({
          name: '',
          type: '',
          money: ''
    })
    const data = ref([])
    onMounted(() => {
      getInstitution()
    })
    const actionType = ref(0)  // 0代表增加，1代表修改
    //表格中的数据
    const getInstitution = () => {
      HTTPGetInstitution().then(res => {
        data.value = res
      })
    }
    //添加
    //修改
    const addInstitution = () => {
      if( !actionType.value ) {
        HTTPAddInstitution(form.value).then(res =>{
          if(res.code === 200){
            getInstitution()
          }
        })
      } else {
        HTTPUpdataInstitution(form.value).then(res =>{
          if(res.code === 200){
            getInstitution()
          }
        })
      }
      active.value = false
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
      form,
      actionType,
      addInstitution,
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