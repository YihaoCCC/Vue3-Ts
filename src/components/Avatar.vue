<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div class="avatar">
        <n-avatar
            round
            size="small"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
    />
    <span class="name">
        {{name}}
    </span>
    </div>
    
  </n-dropdown>
  <n-modal v-model:show="showModal" preset="dialog" title="Dialog">
    <template #header>
      <div>修改密码</div>
    </template>
    <password-form @successClick='showModal = false'></password-form>
    
  </n-modal>
</template>

<script lang="ts">
import { h, defineComponent, ref } from 'vue'
import type { Component } from 'vue'
import { NIcon} from 'naive-ui'
import {
  PersonCircleOutline as UserIcon,
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon
} from '@vicons/ionicons5'
import {useRouter} from 'vue-router'
import PasswordForm from './PasswordForm.vue'
const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

export default defineComponent({
  components: {
    PasswordForm
  },
  setup () {
    const router = useRouter()
    const name = ref(localStorage.getItem('USERNAME'))
    const showModal = ref(false)
    const formRef = ref(null)
    return {
      formRef,
      name,
      showModal,
      options: [
        {
          label: '修改密码',
          key: 'editProfile',
          icon: renderIcon(EditIcon)
        },
        {
          label: '退出登录',
          key: 'logout',
          icon: renderIcon(LogoutIcon)
        }
      ],
      handleSelect (key: string | number) {
        if ( key === 'logout') {
          localStorage.clear()
          router.push('/login')
        } else {
          showModal.value = true
        }
      }
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