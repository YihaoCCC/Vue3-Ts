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
      <n-form-item label='部门:' v-if="!isAuthPre('USER:SELECTALL')">
        <n-select placeholder="请选择部门" v-model:value="form1.departmentId" :options="departmentOptions" clearable style="width: 180px">
        </n-select>
      </n-form-item>
      <n-form-item label='员工姓名:' >
        <n-input placeholder="请输入员工姓名"  v-model:value="form1.name" clearable>
        </n-input>
      </n-form-item>
      <n-form-item>
      <n-button tertiary type="primary" @click="query">
        查询
      </n-button>
    </n-form-item>
    </n-form>
  </template>
    <template #header-extra>
      <n-button tertiary type="primary" @click="handleActivate(0)"  v-if="!isAuthPre('USER:INSERT')">
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
        <n-form ref="formRef" :model="form" :rules="rules" 
        label-placement="left" label-width="auto" require-mark-placement="right-hanging">
          <n-form-item label='员工姓名:' path="name">
            <n-input placeholder="员工姓名"  v-model:value="form.name" >
            </n-input>
          </n-form-item>
          <n-form-item label='员工性别:' path="sex">
            <n-radio-group v-model:value="form.sex" name="radiogroup">
              <n-radio value="男">男 </n-radio>
              <n-radio value='女'>女</n-radio>
            </n-radio-group>
          </n-form-item>
          <n-form-item label='出生日期:' path="birthday">
            <n-date-picker
              size="medium" type="date"
              placeholder="请选择出生日期"
              v-model:formatted-value="form.birthday"
              value-format="yyyy-MM-dd"
              clearable
            />
          </n-form-item>
          <n-form-item label='身份证号:' path="idNumber">
              <n-input placeholder="请输入身份证号"  v-model:value="form.idNumber">
              </n-input>
            </n-form-item>
          <n-form-item label='邮箱:' path="email">
              <n-input placeholder="请输入邮箱"  v-model:value="form.email">

              </n-input>
            </n-form-item>
          <n-form-item label='籍贯:' path="nativePlace">
            <n-input placeholder="请输入籍贯"  v-model:value="form.nativePlace">
            </n-input>
          </n-form-item>
          <n-form-item label='住址:' path="address">
            <n-input placeholder="请输入住址"  v-model:value="form.address">
            </n-input>
          </n-form-item>
          <n-form-item label='手机号:' path="phone">
            <n-input placeholder="请输入手机号" v-model:value="form.phone">

            </n-input>
          </n-form-item>
          <n-form-item label='入职日期:' v-if="actionType" path="beginDate">
            <n-date-picker
              placeholder="请选择入职日期"
              v-model:formatted-value="form.beginDate"
              value-format="yyyy-MM-dd"
              type="date"
              clearable
            />
          </n-form-item>
          <n-form-item label='所在部门:' path="departmentId">
            <n-select placeholder="请选择所在部门" v-model:value="form.departmentId" :options="departmentOptions" clearable>
            </n-select>
          </n-form-item>
          <n-form-item label='职位:' path="positionId">
            <n-select placeholder="请选择职位"
              multiple
              v-model:value="form.positionId" :options="positionOptions" clearable>
            </n-select>
          </n-form-item>
        </n-form>
        <n-button @click="addOrUpdataUser" type="primary" tertiary>
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
      key: 'userId',
      width: 80
    },
    {
      title: '姓名',
      key: 'name',
      width: 80
    },
    {
      title: '性别',
      key: 'sex',
      width: 60
    },
    {
      title: '出生日期',
      key: 'birthday',
      width: 110
    },
    {
      title: '身份证号',
      key: 'idNumber',
      width: 100,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '邮箱',
      key: 'email',
      width: 100,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '籍贯',
      key: 'nativePlace',
      width: 100,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '住址',
      key: 'address',
      width: 100,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '手机号码',
      key: 'phone',
      width: 100,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '入职日期',
      key: 'beginDate',
      width: 110
    },
    {
      title: '所在部门',
      key: 'department.name',
      width: 80
    },
    {
      title: '职位',
      key: 'position',
      // width: 110,
      // ellipsis: {
      //   tooltip: true
      // },
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
      title: '操作',
      key: 'actions',
      render (row) {
        const button = [1,2].map((item) => {
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
                                text: true,    
                                style: {
                                    marginRight: '6px',
                                },
                                
                                size: 'small',
                                disabled:isAuthPre('USER:DELETE'),
                                onClick: () => deleteUser(row.userId)
                            },
                            
                            { default: () => '离职' }
                        )
                }
        })
        return button
      }
    }
  ]
}


import  { HTTPGetUser, HTTPAddUser, HTTPUpdataUser , HTTPDeleteUser, HTTPGetDepartment, HTTPGetPosition,HTTPGetUserSelective }from './HttpUser'
export default defineComponent({
  setup () {
    const formRef = ref(null)
    const message = useMessage()
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
        positionId:[]
    })
    const form1 = ref({
      userId:localStorage.getItem('USERID'),
      name: null,
      departmentId:null,
    })
    const rules = ref({
      name: {
            required: true,
            message: '请输入员工姓名',
            trigger: 'blur'
          },
      sex: {
            required: true,
            message: '请选择员工性别',
            trigger: ['change', 'blur']
          },
      birthday: {
            required: true,
            message: '请选择出生日期',
            trigger: ['change', 'blur']
          },
      idNumber: {
            required: true,
            message: '请输入身份证号',
            trigger: ['input', 'blur']
          },
      email: {
            required: true,
            message: '请输入邮箱',
            trigger: ['input', 'blur']
          },
      nativePlace: {
            required: true,
            message: '请输入籍贯',
            trigger: ['input', 'blur']
          },
      address: {
            required: true,
            message: '请输入住址',
            trigger: ['input', 'blur']
          },
      phone: {
            required: true,
            message: '请输入手机号',
            trigger: ['input', 'blur']
          },
      beginDate: {
            required: true,
            message: '请选择入职日期',
            trigger: ['change', 'blur']
          },
      departmentId: {
            type: 'number',
            required: true,
            message: '请选择所在部门',
            trigger: ['change', 'blur']
          },
      positionId: {
            type: 'array',
            required: true,
            message: '请选择职位',
            trigger: ['change', 'blur']
          }
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
    const query = () => {
      console.log(form1.value)
      if(form1.value.name === ''){
        form1.value.name = null
      }
      HTTPGetUserSelective(form1.value).then(res =>{
        data.value = res
      })
    }
    const getUser = () => {
        let id = localStorage.getItem("USERID")
        HTTPGetUser(id).then(res => {
          data.value = res
        })
    }
    const addOrUpdataUser = (e) => {
      e.preventDefault()
      console.log(form.value)
      formRef.value?.validate((errors) => {
          if (!errors) {
            if( !actionType.value ) {
              HTTPAddUser(form.value).then(res =>{
                if(res.code === 200){
                  getUser()
                  message.success(res.message)
                }else{
                  message.error(res.message)
                }
              })
            } else {
              HTTPUpdataUser(form.value).then(res =>{
                if(res.code === 200){
                  getUser()
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
    const deleteUser = (id) => {
      HTTPDeleteUser(id).then(res =>{
        if(res.code === 200){
            getUser()
            message.success(res.message)
          }else{
            message.error(res.message)
          }
      })
    }
    const handleActivate= (type, item) => {
      active.value = true
      positonArray.value = []
      if( type ) {
        form.value = item
        console.log(form.value)
        form.value?.position.forEach((item) => {
          positonArray.value.push(item.id)
        })
        form.value.positionId = positonArray.value
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
            positionId:[]
        }
        actionType.value = 0
      } 
    }
    return {
      formRef,
      rules,
      isAuthPre,
      active,
      actionType,
      form,
      form1,
      positonArray,
      departmentOptions,
      positionOptions,
      query,
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