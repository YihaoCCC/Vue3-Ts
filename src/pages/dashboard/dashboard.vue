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
              <n-message-provider>
                <Avatar></Avatar>

              </n-message-provider>
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
              style="height: 92.5vh;overflow: visible !important;"
              :value='currentMenu'
              @update:value="handleUpdateMenu"
            />
          </n-layout-sider>
          <n-layout-content >
            <div class="dashboard">
              <n-notification-provider>
             
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
               </n-notification-provider>

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
          HomeOutline,
          NotificationsOutline,
          SettingsOutline,
          BarChartOutline,
          CheckmarkCircleOutline,
          LogoUsd,
          ClipboardOutline
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
      this.currentName = this.$route.meta.label
  },
  setup () {
    const $isAuth = getCurrentInstance()?.appContext.config.globalProperties.isAuth
    const menuOptions = [
      {
        label: '首页',
        value: 'home',
        key: 'home',
        icon: renderIcon(HomeOutline),
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
        routerLink: '/department',
        disabled: $isAuth('DEPARTMENT')
      },
      {
        label: '职位管理',
        key: 'position',
        routerLink: '/position',    
        icon: renderIcon(PersonOutline),
        disabled: $isAuth('POSITION')
      },
      {
        label: '员工管理',
        key: 'user',
        icon: renderIcon(PersonOutline),
        routerLink: '/user',
        disabled: $isAuth('USER')
      },
      {
        label: '奖惩管理',
        key: 'pinball-1973',
        icon: renderIcon(RibbonOutline),
        disabled: $isAuth('JIANGCHENG'),
        children: [
          {
            label: '奖惩记录',
            key: 'recordAward',
            icon: renderIcon(RibbonOutline),
            routerLink: '/recordAward',
            disabled: $isAuth('JIANGCHENG_RECORD')
          },
          {
            label: '奖惩审批',
            key: 'awardApprove',
            icon: renderIcon(CheckmarkCircleOutline),
            routerLink: '/awardApprove',
            disabled: $isAuth('JIANGCHENG_APPROVE')
          },
          {
            label: '奖惩制度',
            key: 'institution',
            icon: renderIcon(SettingsOutline),
            routerLink: '/institution',
            disabled: $isAuth('JIANGCHENG_SYSTEM')
          }
        ]
      },
      {
        label: '请假管理',
        key: 'leave',
        icon: renderIcon(PersonOutline),
        disabled: $isAuth('LEAVE'),
        children: [
          {
            label: '请假记录',
            key: 'leave',
            icon: renderIcon(PersonOutline),
            routerLink: '/leave',
            disabled: $isAuth('LEAVE_RECORD')
          },
          {
            label: '请假审批',
            key: 'leaveRequest',
            icon: renderIcon(CheckmarkCircleOutline),
            routerLink: '/leaveRequest',
            disabled: $isAuth('LEAVE_APPROVE')
          }
        ]
      },
      {
        label: '出差管理',
        key: 'out',
        icon: renderIcon(PersonOutline),
        disabled: $isAuth('TRAVEL'),
        children: [
          {
            label: '出差记录',
            key: 'workout',
            icon: renderIcon(PersonOutline),
            routerLink: '/workout', 
            disabled: $isAuth('TRAVEL_RECORD')   
            
          },
          {
            label: '出差审批',
            key: 'workoutRequest',
            icon: renderIcon(CheckmarkCircleOutline),
            routerLink: '/workoutRequest',  
            disabled: $isAuth('TRAVEL_APPROVE')  
            
          }
        ]
      },
      {
        label: '公告管理',
        key: 'message',
        icon: renderIcon(NotificationsOutline),
        routerLink: '/message',
        disabled: $isAuth('MESSAGE')
      },
      {
        label: '薪资管理',
        key: 'money',
        icon: renderIcon(LogoUsd),
        disabled: $isAuth('SALARY'),
        children: [
          {
            label: '薪资记录',
            key: 'moneyRecord',
            icon: renderIcon(LogoUsd),
            routerLink: '/moneyRecord',
            disabled: $isAuth('SALARY_RECORD')
          },
          {
            label: '薪资制度',
            key: 'moneyInstitution',
            icon: renderIcon(SettingsOutline),
            routerLink: '/moneyInstitution',
            disabled: $isAuth('SALARY_SYSTEM')
          },
          {
            label: '计算薪资',
            key: 'compute',
            icon: renderIcon(LogoUsd),
            routerLink: '/compute',
            disabled: $isAuth('SALARY_COMPUTE')
          }
        ]
      },
      {
        label: '考勤管理',
        key: 'Attendance',
        icon: renderIcon(PersonOutline),
        disabled: $isAuth('SIGN'),
        children: [
              {
                label: '考勤记录',
                key: 'signRecord',
                icon: renderIcon(PersonOutline),
                routerLink: '/signRecord',
                disabled: $isAuth('SIGN_RECORD')
              },
              {
                label: '考勤类型制度',
                key: 'attendanceType',
                icon: renderIcon(SettingsOutline),
                routerLink: '/attendanceType',
                disabled: $isAuth('SIGN_TYPE')
              },
              {
                label: '考勤时间制度',
                key: 'attendanceTime',
                icon: renderIcon(SettingsOutline),
                routerLink: '/attendanceTime',
                disabled: $isAuth('SIGN_TIME')
              },
        ]
      },
      {
        label: '任务管理',
        key: 'task',
        icon: renderIcon(ClipboardOutline),
        disabled: $isAuth('TASK'),
        children: [
              {
                label: '任务记录',
                key: 'task',
                icon: renderIcon(ClipboardOutline),
                routerLink: '/task',
                disabled: $isAuth('TASK_RECORD')
              },
              {
                label: '我的任务',
                key: 'taskSubmit',
                icon: renderIcon(ClipboardOutline),
                routerLink: '/taskSubmit',
                disabled: $isAuth('TASK_SUBMIT')
              }
        ]
      },
      {
        label: '统计管理',
        key: 'stats',
        icon: renderIcon(BarChartOutline),
        routerLink: '/stats',
        disabled: $isAuth('STATS')
      },
]
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
      theme: ref(false),
      handleUpdateMenu,
      title: process.env.VUE_APP_TITLE
    }
  }
})
</script>


<style lang="less" scoped>
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
