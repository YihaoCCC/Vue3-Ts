import {
  // create naive ui
  create,
  // component
  NConfigProvider,
  NButton,
  NScrollbar,
  NSpace,
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NLayoutContent,
  NMenu,
  NLayoutFooter,
  NSwitch,
  NCard,
  NAvatar,
  NDropdown,
  NPopover,
  NInput,
  NIcon,
  NMessageProvider,
  NDataTable,
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NSelect,
  NDatePicker,
  NRadioGroup,
  NRadio,
  NInputNumber,
  NTimePicker,
  NTreeSelect,
  NNotificationProvider,
  NModal,
} from 'naive-ui'


function setNavieUiComponents(app: {use:(naive:any) => void}):void {
    const naive = create({
        components: [
            NConfigProvider,
            NButton,
            NModal,
            NScrollbar,
            NSpace,
            NLayout,
            NLayoutHeader,
            NLayoutSider,
            NLayoutContent,
            NMenu,
            NLayoutFooter,
            NSwitch,
            NCard,
            NAvatar,
            NDropdown,
            NPopover,
            NInput,
            NIcon,
            NMessageProvider,
            NDataTable,
            NDrawer,
            NDrawerContent,
            NForm,
            NFormItem,
            NSelect,
            NDatePicker,
            NRadioGroup,
            NRadio,
            NInputNumber,
            NTimePicker,
            NTreeSelect,
            NNotificationProvider,
        ]
      })
      app.use(naive)
}


export default setNavieUiComponents
