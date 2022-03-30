<template>
  <n-form ref="formRef" :model="model" :rules="rules">
    <n-form-item path="oldpass" label="旧密码">
      <n-input v-model:value="model.oldpass" type="password" @keydown.enter.prevent />
    </n-form-item>
    <n-form-item path="password" label="新密码">
      <n-input
        v-model:value="model.password"
        type="password"
        @input="handlePasswordInput"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item
      ref="rPasswordFormItemRef"
      first
      path="reenteredPassword"
      label="重复密码"
    >
      <n-input
        v-model:value="model.reenteredPassword"
        :disabled="!model.password"
        type="password"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
            :disabled="model.oldpass === null"
            round
            type="primary"
            @click="handleValidateButtonClick"
          >
            修改密码
          </n-button>
        </div>
      </n-col>
    </n-row>
  </n-form>
</template>

<script lang="ts">
import { defineComponent, ref,defineEmits } from 'vue'
import {
  FormInst,
  FormItemInst,
  FormItemRule,
  useMessage,
  FormRules
} from 'naive-ui'

import {useRouter} from 'vue-router'

import {HTTPUpdatePassword} from './HttpMethods'

interface ModelType {
  oldpass: string | null
  password: string | null
  reenteredPassword: string | null
}

export default defineComponent({
    
    emits:['successClick'],
  setup (proxy, context) {
    const router = useRouter()
    const formRef = ref<FormInst | null>(null)
    const rPasswordFormItemRef = ref<FormItemInst | null>(null)
    const message = useMessage()
    const modelRef = ref<ModelType>({
      oldpass: null,
      password: null,
      reenteredPassword: null
    })
    function validatePasswordStartWith (
      rule: FormItemRule,
      value: string
    ): boolean {
      return (
        !!modelRef.value.password &&
        modelRef.value.password.startsWith(value) &&
        modelRef.value.password.length >= value.length
      )
    }
    function validatePasswordSame (rule: FormItemRule, value: string): boolean {
      return value === modelRef.value.password
    }
    const rules: FormRules = {
      oldpass: [
        {
          required: true,
          validator (rule: FormItemRule, value: string) {
            if (!value) {
              return new Error('需要旧密码')
            }
            return true
          },
          trigger: ['input', 'blur']
        }
      ],
      password: [
        {
          required: true,
          message: '请输入密码'
        }
      ],
      reenteredPassword: [
        {
          required: true,
          message: '请再次输入密码',
          trigger: ['input', 'blur']
        },
        {
          validator: validatePasswordStartWith,
          message: '两次密码输入不一致',
          trigger: 'input'
        },
        {
          validator: validatePasswordSame,
          message: '两次密码输入不一致',
          trigger: ['blur', 'password-input']
        }
      ]
    }
    const handleValidateButtonClick =  (e: MouseEvent) => {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
              // 发送更改密码请求  成功后执行 成功/失败
              let id:any = localStorage.getItem('USERID')
              let password:any = modelRef.value.password
              HTTPUpdatePassword(id,password)?.then((res:any) =>{
                if(res.code === 200){
                    message.success(res.message)
                    localStorage.clear()
                    router.push('/login')
                }else{
                    message.error(res.message)
                }
              })
            context.emit('successClick')
          }
        })
      }
    return {
      formRef,
      handleValidateButtonClick,
      rPasswordFormItemRef,
      model: modelRef,
      rules,
      handlePasswordInput () {
        if (modelRef.value.reenteredPassword) {
          rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
        }
      },
      
    }
  }
})
</script>