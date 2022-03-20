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
} from 'naive-ui'


function setNavieUiComponents(app: {use:(naive:any) => void}):void {
    const naive = create({
        components: [
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
        ]
      })
      app.use(naive)
}


export default setNavieUiComponents
