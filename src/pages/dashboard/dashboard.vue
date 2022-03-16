<template>
    <n-config-provider :theme="theme ? darkTheme : null ">
    <n-space vertical>
      <n-layout>
        <n-layout-header  bordered>
          <div class="header" >
            <span @click="$router.push('/')" style="cursor:pointer">
              {{title}}
            </span>
            <n-menu mode="horizontal" :inverted="inverted" :options="menuOptions" />
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
              @update:value="handleUpdateMenu"
              @update:expanded-keys="handleUpdateExpandedKeys"
            />
          </n-layout-sider>
          <n-layout-content >
            <div class="dashboard">
                <n-card embedded class="card">
                    
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
import { h, defineComponent, ref, Component } from 'vue'
import Avatar from 'cyhComponents/Avatar.vue'
import { darkTheme } from 'naive-ui'
import { NIcon } from 'naive-ui'
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon
} from '@vicons/ionicons5'

function renderIcon (icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
  {
    label: '首页',
    key: 'hear-the-wind-sing',
    icon: renderIcon(BookIcon)
  },
  {
    label: '人事管理',
    key: 'pinball-1973',
    icon: renderIcon(BookIcon),
    children: [
      {
        label: '人员管理',
        key: 'rat'
      }
    ]
  },
  {
    label: '请假管理',
    key: 'a-wild-sheep-chase',
    disabled: true,
    icon: renderIcon(BookIcon)
  },
  {
    label: '系统管理',
    key: 'dance-dance-dance',
    icon: renderIcon(BookIcon),
    children: [
      {
        type: 'group',
        label: '人物',
        key: 'people',
        children: [
          {
            label: '叙事者',
            key: 'narrator',
            icon: renderIcon(PersonIcon)
          },
          {
            label: '羊男',
            key: 'sheep-man',
            icon: renderIcon(PersonIcon)
          }
        ]
      },
      {
        label: '饮品',
        key: 'beverage',
        icon: renderIcon(WineIcon),
        children: [
          {
            label: '威士忌',
            key: 'whisky'
          }
        ]
      },
      {
        label: '食物',
        key: 'food',
        children: [
          {
            label: '三明治',
            key: 'sandwich'
          }
        ]
      },
      {
        label: '过去增多，未来减少',
        key: 'the-past-increases-the-future-recedes'
      }
    ]
  }
]

export default defineComponent({
  components: {
    Avatar
  },
  setup () {
    return {
      inverted: ref(false),
      menuOptions,
      darkTheme,
      theme: ref(true),
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
