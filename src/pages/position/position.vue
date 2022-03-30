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
          添加职位
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
          职位信息
        </template>
        <n-form >
          <n-form-item label='职位名称' >
            <n-input placeholder="请输入职位名称" v-model:value="form.name"   >

            </n-input>
          </n-form-item>
          <n-form-item label='菜单权限' >
            <n-tree-select
              placeholder="请选择职位菜单权限"
              multiple
              default-expand-all
              checkable
              filterable
              :clear-filter-after-select="false"
              v-model:value="menuArray"
              :options="menuOptions"
              clearable
            />
          </n-form-item>
          <n-form-item label='职位操作权限' >
            <n-select placeholder="请选择职位操作权限"
              multiple
              v-model:value="permissionArray" :options="permissionOptions" clearable>
            </n-select>
          </n-form-item>
        </n-form>
        <n-button @click="addPosition" type="primary">
          {{!actionType ? '添加' : '修改'}}
        </n-button>
      </n-drawer-content>
    </n-drawer>
  </n-card>

</template>

<script>
import { h, defineComponent, ref, reactive, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ handleActivate, deletePosition }) => {
  return [
    {
      title: '职位名称',
      key: 'name'
    },
    {
      title: '职位菜单权限',
      key: 'menu1'
    },
    {
      title: '职位操作权限',
      key: 'permission1'
    },
    {
      title: '操作',
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
                                onClick: () => deletePosition(row.id)
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


import { HTTPGetPosition, HTTPAddPosition, HTTPUpdataPosition , HTTPDeletePosition, HTTPGetMenu, HTTPGetPermission } from './HttpPosition'

// name，departmentId，menu，permission
export default defineComponent({
  setup () {
    const active = ref(false)
    const actionType = ref(0) // 0增加 1修改
    const data = ref([])
    const menuOptions = ref([])
    const permissionOptions = ref([])
    const menuArray = ref([])
    const permissionArray = ref([])
    const form = ref({
      name: ''
    })
    onMounted(() => {
      getPosition()
      getOptions()
    })
    const getOptions = () => {
      HTTPGetMenu().then(res =>{
        let n = 0
        res.forEach(element => {
          if(element.pid === 0){
            n = n + 1
            menuOptions.value.push({
              key: element.id,
              label: element.name,
              children: []
            })
          }else{
            menuOptions.value[n - 1].children.push({
              key: element.id,
              label: element.name
            })
          }
          });
      })
      HTTPGetPermission().then( res =>{
        res.forEach(element => {
          permissionOptions.value.push({
            value: element.id,
            label: element.name
            })
          });
      })
    }
    //表格数据  GET     /position/queryAll
    const getPosition =()=> {
      HTTPGetPosition().then(res =>{
        data.value = res
      })
    }
    //添加职位  Post  
    //修改     PUT   
    const addPosition = () => {
      console.log(menuArray.value)
      form.value.menuId = menuArray.value
      form.value.permissionId = permissionArray.value
      console.log(form.value)
      if( !actionType.value ) {
        HTTPAddPosition(form.value).then(res =>{
          if(res.code === 200){
            getPosition()
          }
        })
      } else {
        HTTPUpdataPosition(form.value).then(res =>{
          if(res.code === 200){
            getPosition()
          }
        })
      }
      active.value = false
    }
    //删除     Delete    /position/delete/{id}
    const deletePosition =(id) => {
      HTTPDeletePosition(id).then((res) => {
         if(res.code === 200){
           getPosition()
         }
      })
    }
    const handleActivate= (type, item) => {
      active.value = true
      menuArray.value = []
      permissionArray.value = []
      if( type ) {
        form.value = item
        console.log(item)
        form.value?.permission.forEach((item) => {
          permissionArray.value.push(item.id)
        })
        form.value?.menu.forEach((item) => {
          menuArray.value.push(item.id)
        })
        actionType.value = 1
      } else {
        form.value = {
             name: ''
        }
        actionType.value = 0
      } 
    }
    return {
      form,
      actionType,
      addPosition,
      deletePosition,
      handleActivate,
      menuOptions,
      permissionOptions,
      menuArray,
      permissionArray,
      active,
      data,
      columns: createColumns({
        handleActivate,
        deletePosition,
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>