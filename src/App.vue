<template>
  <n-scrollbar style="max-height: 100vh">
    <n-message-provider>
    <router-view></router-view>
    </n-message-provider>
  </n-scrollbar>
</template>
<style lang='less' >
  .n-menu {
    overflow: visible !important;
  }
  .n-data-table .n-data-table-td { 
    text-align: center !important;
  }
  .n-data-table .n-data-table-th {
    text-align: center !important;
    font-weight: bolder !important;
  }
</style>