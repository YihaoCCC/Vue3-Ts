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
              考勤时间制度信息
            </template>
            <n-form >
              <n-form-item label='考勤时间制度名称' >
                <n-input  v-model:value="form.name">

                </n-input>
              </n-form-item>
              <n-form-item label='时间' >
                <n-time-picker v-model:formatted-value="form.time" value-format="HH:mm:ss" />
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
//表格数据  GET     /workTime/queryAll
//修改  Put   /workTime/update     json{id,name,time}  只能修改时间
import { h, defineComponent, ref, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ handleActivate }) => {
  return [
    {
      title: '考勤时间制度名称',
      key: 'name'
    },
    {
      title: '时间',
      key: 'time'
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
                    
                    { default: () => '修改' }
                )
            }
        })
        return button
      }
    }
  ]
}


import {HTTPGetAttendanceTime,HTTPUpdAtaattendanceTime} from './HttpMethods'
export default defineComponent({
  setup () {
    const active = ref(false)
    let form = ref({
          name: '',
          time: null
    })
    const data = ref([])
    onMounted(() => {
      getAttendanceTime()
    })
    //表格中的数据
    const getAttendanceTime = () => {
      HTTPGetAttendanceTime().then(res => {
        data.value = res
      })
    }
    //修改
    const update = () => {
      HTTPUpdAtaattendanceTime(form.value).then(res =>{
          if(res.code === 200){
            getAttendanceTime()
          }
        })
        active.value = false
    }
    const handleActivate = (item) => {
      active.value = true
      form.value = item
      console.log(form.value)
    }
    return {
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