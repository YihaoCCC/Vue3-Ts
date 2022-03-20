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
        <n-form inline >
          <n-form-item label='用户姓名' >
            <n-input placeholder="用户姓名"  v-model:value="form.name" >

            </n-input>
          </n-form-item>
          <n-form-item label='用户性别'>
            <n-radio-group v-model:value="form.sex" name="radiogroup">
              <n-radio value="1">男 </n-radio>
              <n-radio value='2'>女</n-radio>
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
        <n-form inline >
            <n-form-item label='身份证号' >
              <n-input-number placeholder="请输入身份证号" type='textarea' v-model:value="form.idNumber">

              </n-input-number>
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
          <n-form-item label='入职日期' >
            <n-date-picker
              placeholder="请选择入职日期"
              v-model:formatted-value="form.beginDate"
              value-format="yyyy-MM-dd"
              type="date"
              clearable
            />
          </n-form-item>
        </n-form>
        <n-form> 
          <n-form-item label='所在部门' >
            <n-select placeholder="请选择所在部门" v-model:value="form.department">

            </n-select>
          </n-form-item>
          <n-form-item label='职位' >
            <n-select placeholder="请选择职位" type='textarea' v-model:value="form.position.name">

            </n-select>
          </n-form-item>
        </n-form>
        <n-button @click="addOrUpdataUser" type="primary">
          {{!actionType ? '添加该用户' : '修改该用户'}}
        </n-button>
        <template #footer>
          <n-button>Footer</n-button>
        </template>
      </n-drawer-content>
    </n-drawer>
  </n-card>

</template>

<script>
//表格中的数据  Get请求     /user/query/{userId}&{pageNum}
//添加员工  Post   /user/add       json{password，name，sex，birthday，idNumber，email，nativePlace，address，phone，departmentId，positionId}
//修改  Put    /user/update    json{userId,password，name，sex，birthday，idNumber，email，nativePlace，address，phone，departmentId，positionId}
//删除  Put  /user/delete/{userId}
import { h, defineComponent, ref, onMounted } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const createColumns = ({ handleActivate, deleteUser }) => {
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
      key: 'position.name'
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

const createData = () => [
  {
    userId: "180101",
    name: 'John Brown',
    sex: "1",
    birthday: "2000-11-22",
    idNumber: "1231",
    email: "sss",
    nativePlace: null,
    address: null,
    phone: "16622903269",
    beginDate: "2000-11-22",
    department:{
      id: 1,
      name: "人事部",
      email: "1",
      describe: "1",
    },
    position:{
      id: 1,
      name: "人事经理",
      departmentId: 1,
      menu: "1",
    }
  },
  {
    userId: "180102",
    name: 'John Brown',
    sex: "1",
    birthday: "1999-06-15",
    idNumber: "1231",
    email: "sss",
    nativePlace: null,
    address: null,
    phone: "sss",
    beginDate: "2000-11-22",
    department:null,
    position:{
      id: 1,
      name: "人事经理",
      departmentId: 1,
      menu: "1",
    }
  }
]
import  { HTTPGetUser, HTTPAddUser, HTTPUpdataUser , HTTPDeleteUser }from './HttpUser'
export default defineComponent({
  setup () {
    const message = useMessage()
    const active = ref(false)
    const actionType = ref(0) // 0增加 1修改
    const form = ref({
        name: '',
        sex: "",
        birthday: null,
        idNumber: "1231",
        email: "sss",
        nativePlace: null,
        address: null,
        phone: "sss",
        beginDate: null,
        department:null,
        position:{
          id: 1,
          name: "人事经理",
          departmentId: 1,
          menu: "1",
      }
    })
    onMounted(() => {
      getUser()
    })
    const getUser = () => {
        let id = 1
        HTTPGetUser(id)
    }
    const addOrUpdataUser = () => {
      if( !actionType.value ) {
        HTTPAddUser(form.value)
      } else {
        HTTPUpdataUser(form.value)
      }
    }
    const deleteUser = (id) => {
      HTTPDeleteUser(id)
    }
    const handleActivate= (type, item) => {
      active.value = true
      if( type ) {
        form.value = item
        actionType.value = 1
      } else {
        form.value = {
            name: '',
            sex: "",
            birthday: null,
            idNumber: "",
            email: "",
            nativePlace: null,
            address: null,
            phone: "",
            beginDate: null,
            department:null,
            position:{
              id: 1,
              name: "人事经理",
              departmentId: 1,
              menu: "1",
          }
        }
        actionType.value = 0
      } 
    }
    return {
      active,
      actionType,
      form,
      handleActivate,
      addOrUpdataUser,
      deleteUser,
      data: createData(),
      columns: createColumns({
        handleActivate,
        deleteUser,
        sendMail (rowData) {
          message.info('send mail to ' + rowData.name)
        }
      }),
      pagination: {
        pageSize: 10
      }
    }
  }
})
</script>