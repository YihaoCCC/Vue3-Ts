<template>
  <n-card
    title="卡片分段示例"
    :segmented="{
      content: true,
      footer: 'soft'
    }"
    hoverable
  >
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="data"
      :pagination="pagination"
    />
  </n-card>

</template>

<script>
//表格数据  GET     /leave/queryUnapproved/{userId}
//批准  Put    /leave/update/{id}       
import { h, defineComponent, ref, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ AwardApprove }) => {
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
    },
    {
      title:'奖惩状态',
      key: 'state'
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
                        style: {
                            marginRight: '6px'
                        },
                        size: 'small',
                        onClick: () => AwardApprove(row.id)
                    },
                    
                    { default: () => '批准' }
                )
            } 
        })
        return button
      }
    }
  ]
}

import {HTTPGetAwardApprove,HTTPUpdataAwardApprove} from './HttpMethods'
export default defineComponent({
  setup () {
    const data = ref([])
    onMounted(() => {
      getAwardApprove()
    })
    //表格中的数据
    const getAwardApprove = () => {
      HTTPGetAwardApprove().then(res => {
        data.value = res
      })
    }
    //审批
    const AwardApprove = (id) => {
      HTTPUpdataAwardApprove(id).then(res =>{
          if(res.code === 200){
            getAwardApprove()
          }
        })
    }
    return {
      data,
      columns: createColumns({
        AwardApprove
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>