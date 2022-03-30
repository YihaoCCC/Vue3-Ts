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
      <n-button tertiary type="primary" @click="handleActivate(0)" :disabled="isAuthPre('USER:INSERT')">
          添加员工
      </n-button>
    </template>
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="data"
      :pagination="pagination"
    />
    <n-drawer v-model:show="active" :width="602">
      <n-drawer-content>
        <template #header>
          员工信息
        </template>
        <n-form>
          <n-form-item label='用户姓名' >
            <n-input placeholder="用户姓名"  v-model:value="form.name" >

            </n-input>
          </n-form-item>
          <n-form-item label='用户性别'>
            <n-radio-group v-model:value="form.sex" name="radiogroup">
              <n-radio value="男">男 </n-radio>
              <n-radio value='女'>女</n-radio>
            </n-radio-group>
          </n-form-item>
          
        </n-form>
        <n-form-item label='出生日期' >
            <n-date-picker
              size="medium" type="date"
              placeholder="请选择出生日期"
              v-model:formatted-value="form.birthday"
              value-format="yyyy-MM-dd"
              clearable
            />
          </n-form-item>
        <n-form >
            <n-form-item label='身份证号' >
              <n-input placeholder="请输入身份证号"  v-model:value="form.idNumber">
              </n-input>
            </n-form-item>
            <n-form-item label='邮箱' >
              <n-input placeholder="请输入邮箱"  v-model:value="form.email">

              </n-input>
            </n-form-item>
        </n-form>
        <n-form>
          <n-form-item label='住址' >
            <n-input placeholder="请输入住址"  v-model:value="form.nativePlace">
            </n-input>
          </n-form-item>
          <n-form-item label='手机号' >
            <n-input placeholder="请输入手机号" v-model:value="form.phone">

            </n-input>
          </n-form-item>
          <!-- <n-form-item label='入职日期' >
            <n-date-picker
              placeholder="请选择入职日期"
              v-model:formatted-value="form.beginDate"
              value-format="yyyy-MM-dd"
              type="date"
              clearable
            />
          </n-form-item> -->
        </n-form>
        <n-form> 
          <n-form-item label='所在部门' >
            <n-select placeholder="请选择所在部门" v-model:value="form.departmentId" :options="departmentOptions">

            </n-select>
          </n-form-item>
          <n-form-item label='职位' >
            <n-select placeholder="请选择职位"
              multiple
              v-model:value="positonArray" :options="positionOptions">
            </n-select>
          </n-form-item>
        </n-form>
        <n-button @click="addOrUpdataUser" type="primary">
          {{!actionType ? '添加' : '修改'}}
        </n-button>
      </n-drawer-content>
    </n-drawer>
  </n-card>

</template>

<script>
//表格中的数据  Get请求     /user/query/{userId}&{pageNum}
//添加员工  Post   /user/add       json{password，name，sex，birthday，idNumber，email，nativePlace，address，phone，departmentId，positionId}
//修改  Put    /user/update    json{userId,password，name，sex，birthday，idNumber，email，nativePlace，address，phone，departmentId，positionId}
//删除  Put  /user/delete/{userId}
import { h, defineComponent, ref, onMounted, getCurrentInstance } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ handleActivate, deleteUser,isAuthPre }) => {
  return [
    {
      title: '员工号',
      key: 'userId'
    },
    {
      title: '姓名',
      key: 'name'
    },
    {
      title: '性别',
      key: 'sex'
    },
    {
      title: '出生日期',
      key: 'birthday'
    },
    {
      title: '身份证号',
      key: 'idNumber'
    },
    {
      title: '邮箱',
      key: 'email'
    },
    {
      title: '籍贯',
      key: 'nativePlace'
    },
    {
      title: '住址',
      key: 'address'
    },
    {
      title: '手机号码',
      key: 'phone'
    },
    {
      title: '入职日期',
      key: 'beginDate'
    },
    {
      title: '所在部门',
      key: 'department.name'
    },
    {
      title: '职位',
      key: 'position',
      render(row) {
        const tags = row.position.map((tagKey) => {
          return h(
            NTag,
            {
              style: {
                marginRight: '6px'
              },
              type: 'info'
            },
            {
              default: () => tagKey.name
            }
          )
        })
        return tags
      }
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
                        disabled: isAuthPre('USER:UPDATE'),
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
                                disabled:isAuthPre('USER:DELETE'),
                                onClick: () => deleteUser(row.userId)
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


import  { HTTPGetUser, HTTPAddUser, HTTPUpdataUser , HTTPDeleteUser, HTTPGetDepartment, HTTPGetPosition }from './HttpUser'
export default defineComponent({
  setup () {
    const isAuthPre= getCurrentInstance()?.appContext.config.globalProperties.isAuthPer
    const active = ref(false)
    const actionType = ref(0) // 0增加 1修改
    const data = ref([])
    const departmentOptions = ref([])
    const positionOptions = ref([])
    const form = ref({
        name: '',
        sex: '',
        birthday: null,
        idNumber: '',
        email: '',
        nativePlace: null,
        address: null,
        phone:null,
        beginDate: null,
        departmentId:null,
        positionId:null
    })
    const positonArray = ref([])
    onMounted(() => {
      getUser()
      getOptions()
    })
    const getOptions = () => {
      HTTPGetDepartment().then(res =>{
        res.forEach(element => {
          departmentOptions.value.push({
            value: element.id,
            label: element.name
            })
          });
      })
      HTTPGetPosition().then( res =>{
        res.forEach(element => {
          positionOptions.value.push({
            value: element.id,
            label: element.name
            })
          });
      })
    }
    const getUser = () => {
        let id = localStorage.getItem("USERID")
        HTTPGetUser(id).then(res => {
          data.value = res
        })
    }
    const addOrUpdataUser = () => {
      form.value.positionId = positonArray.value 
      console.log(form.value)
      if( !actionType.value ) {
        HTTPAddUser(form.value).then(res =>{
          if(res.code === 200){
            getUser()
          }
        })
      } else {
        HTTPUpdataUser(form.value).then(res =>{
          if(res.code === 200){
            getUser()
          }
        })
      }
      active.value = false
    }
    const deleteUser = (id) => {
      HTTPDeleteUser(id)
    }
    const handleActivate= (type, item) => {
      active.value = true
      positonArray.value = []
      if( type ) {
        form.value = item
        form.value?.position.forEach((item) => {
          positonArray.value.push(item.id)
        })
        actionType.value = 1
      } else {
        form.value = {
            name: '',
            sex: '',
            birthday: null,
            idNumber: '',
            email: '',
            nativePlace: null,
            address: null,
            phone: '',
            beginDate: null,
            departmentId:null,
            positionId:null
        }
        actionType.value = 0
      } 
    }
    return {
      isAuthPre,
      active,
      actionType,
      form,
      positonArray,
      departmentOptions,
      positionOptions,
      handleActivate,
      addOrUpdataUser,
      deleteUser,
      data,
      columns: createColumns({
        handleActivate,
        deleteUser,
        isAuthPre
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>