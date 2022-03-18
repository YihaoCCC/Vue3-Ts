<template>
    <n-config-provider :theme="theme ? darkTheme : null ">
    <n-space vertical>
      <n-layout>
        <n-layout-header  bordered>
          <div class="header" >
            <span @click="$router.push('/')" style="cursor:pointer">
              {{title}}
            </span>
            <div class="header-right">
              <n-popover
                placement="bottom"
                trigger="hover"
              >
                <template #trigger>
                    <n-switch v-model:value="theme" />
                </template>
                <span> 切换主题模式</span>
              </n-popover>
              <Avatar></Avatar>
            </div>
          </div>
        </n-layout-header>
        <n-layout has-sider >
          <n-layout-sider
            bordered
            show-trigger
            collapse-mode="width"
            :collapsed-width="64"
            :width="240"
            :native-scrollbar="false"
          >
            <n-menu
              :collapsed-icon-size="22"
              :options="menuOptions"
              style="height: 92.5vh"
              :value='currentMenu'
              @update:value="handleUpdateMenu"
            />
          </n-layout-sider>
          <n-layout-content >
            <div class="dashboard">
              <n-message-provider>

                <n-card embedded class="card">
                  <div style="margin-bottom: 10px;">
                    <n-icon><pricetag-outline/>  </n-icon> <span style="margin-left:10px;font-weight:bolder">{{currentName}}</span>
                  </div>
                        <router-view v-slot="props">
                            <transition 
                                appear 
                                enter-active-class="animate__animated animate__backInDown"
                                leave-active-class="animate__animated animate__backOutDown"
                                mode="out-in"
                            >
                              <component :is="props.Component"></component>
                            </transition>

                        </router-view>
                </n-card>
              </n-message-provider>

            </div>
            
          </n-layout-content>
        </n-layout>
        <n-layout-content content-style="display:none"></n-layout-content>
        <n-layout-footer  bordered style="text-align: center">
          作者： 柴渴  2022-3
        </n-layout-footer>
      </n-layout>
    </n-space>
    </n-config-provider>
</template>

<script lang="ts">
import { h, defineComponent, ref, Component, getCurrentInstance } from 'vue'
import Avatar from 'cyhComponents/Avatar.vue'
import { darkTheme, NIcon } from 'naive-ui'
import { BookOutline as BookIcon, PersonOutline as PersonIcon, WineOutline as WineIcon, 
          BusinessOutline,
          PersonOutline,
          RibbonOutline,
          PricetagOutline,
          } from '@vicons/ionicons5'

import { useRouter} from 'vue-router'




function renderIcon (icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}





export default defineComponent({
  
  components: {
    Avatar,
    PricetagOutline
  },
  created() {
      this.currentMenu= this.$route.name
      console.log(this.$route.name)
      console.log(this.currentMenu)
  },
  setup () {
    const $isAuth = getCurrentInstance()?.appContext.config.globalProperties.isAuth
    const menuOptions = [
      {
        label: '首页',
        value: 'home',
        key: 'home',
        icon: renderIcon(BookIcon),
        routerLink: '/'
      },
      {
        key: 'divider-1',
        type: 'divider',
        props: {
          style: {
            marginLeft: '32px'
          }
        }
      },
      {
        label: '部门管理',
        key: 'department',
        icon: renderIcon(BusinessOutline),
        routerLink: '/department'
      },
      {
        label: '员工管理',
        key: 'User',
        icon: renderIcon(PersonOutline),
        routerLink: '/user'
      },
      {
        label: '奖惩管理',
        key: 'pinball-1973',
        icon: renderIcon(RibbonOutline),
        children: [
          {
            label: '奖惩记录',
            key: 'rat',
            routerLink: '/recordAward',
            disabled: $isAuth('USER:UPDATE')
          },
          {
            label: '奖惩制度',
            key: 'rat2',
            routerLink: '/institution',
            disabled: $isAuth('USER:UPDATE')
          }
        ]
      },
      {
        label: '请假管理',
        key: 'leave',
        icon: renderIcon(PersonOutline),
        routerLink: '/leave'
      },
      {
        label: '公告管理',
        key: 'message',
        icon: renderIcon(PersonOutline),
        routerLink: '/message'
      },
      {
        label: '职位管理',
        key: 'a-wild-sheep-chase',
        routerLink: '/position',    
        icon: renderIcon(BookIcon)
      },
      {
        label: '薪资管理',
        key: 'money',
        icon: renderIcon(BookIcon),
        children: [
          {
            label: '薪资记录',
            key: 'money1',
            routerLink: '/moneyRecord',
            disabled: $isAuth('USER:UPDATE')
          },
          {
            label: '薪资制度',
            key: 'money2',
            routerLink: '/moneyInstitution',
            disabled: $isAuth('USER:UPDATE')
          }
        ]
      },
      {
        label: '考勤管理',
        key: 'Attendance',
        icon: renderIcon(BookIcon),
        children: [
              {
                label: '签到记录',
                key: 'Attendance1',
                icon: renderIcon(PersonIcon),
                routerLink: '/signRecord'
              },
              {
                label: '考勤记录',
                key: 'Attendance2-man',
                icon: renderIcon(PersonIcon),
                routerLink: 'attendanceRecord'
              },
              {
                label: '考勤制度',
                key: 'Attendance3-man',
                icon: renderIcon(PersonIcon),
                routerLink: '/attendanceInstitution'
              },
        ]
      },
      {
        label: '任务管理',
        key: 'task',
        icon: renderIcon(PersonOutline),
        routerLink: '/task'
      },
      {
        label: '出差管理',
        key: 'out',
        routerLink: '/workout',    
        icon: renderIcon(BookIcon)
      }
]
    console.log()
    const currentMenu = ref()
    const currentName = ref()
    const $router = useRouter()
    const handleUpdateMenu:(age:string,arg2:any) => void = (args:string,currentItem:any) => {    
    $router.push(currentItem.routerLink)
    currentMenu.value = args
    currentName.value = currentItem.label
  }
    return {
      inverted: ref(false),
      menuOptions,
      darkTheme,
      currentMenu,
      currentName,
      theme: ref(true),
      handleUpdateMenu,
      title: process.env.VUE_APP_TITLE
    }
  }
})
</script>


<style lang="less">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0px 0 30px;
  height: 50px;
  font-size: 20px;
  letter-spacing: 4px;
  .header-right {
    display: flex;
    align-items: center;
    justify-content: space-between;
    letter-spacing: 2px;
  }
}
.dashboard {
  margin-top: 18px;
  padding: 0px 10px 0  10px;
  width: 100%;
  height: 96%;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 40px;
  .card {
    height: 100%;
    border: none;
  }
}

</style>
