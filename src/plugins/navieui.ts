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
        ]
      })
      app.use(naive)
}


export default setNavieUiComponents
