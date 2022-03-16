<template>
  <n-dropdown :options="options">
    <div class="avatar">
        <n-avatar
            round
            size="small"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
    />
    <span class="name">
        {{$store.state.name}}
    </span>
    </div>
    
  </n-dropdown>
</template>

<script lang="ts">
import { h, defineComponent } from 'vue'
import type { Component } from 'vue'
import { NIcon } from 'naive-ui'
import {
  PersonCircleOutline as UserIcon,
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon
} from '@vicons/ionicons5'

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

export default defineComponent({
  setup () {
    return {
      options: [
        {
          label: '用户资料',
          key: 'profile',
          icon: renderIcon(UserIcon)
        },
        {
          label: '编辑用户资料',
          key: 'editProfile',
          icon: renderIcon(EditIcon)
        },
        {
          label: '退出登录',
          key: 'logout',
          icon: renderIcon(LogoutIcon)
        }
      ]
    }
  }
})
</script>
<style lang="less" scoped>
    .avatar {
        display: flex;
        font-size: 16px;
        align-items: center;
        cursor: pointer;
        padding: 24px;
        .name {
            padding-left: 10px;
        }
        &:hover {
            background-color: rgba(190, 190, 190, 0.205);
        }
    }
</style>