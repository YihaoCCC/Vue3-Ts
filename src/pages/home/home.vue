<template>
        <div>
            <n-card hoverable>
            <div class="homeContent">
              <div class="contentLeft">
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />    
                <span> 欢迎您！{{userName}}， 祝您办公愉快！</span>
              </div> 
              <n-button tertiary size='large' type="primary" @click="signIn"  >
                  今日签到
              </n-button> 
            </div>
            </n-card>
            <div style="margin:40px 0"></div>
            <n-space justify="space-around" size="large">
              <n-card  hoverable title="我的信息">
                <div class="profile">
                  <div class="header">
                  <span><em>
                    部门：</em>{{dept}}</span>
                   
                  </div>
                  <div class="content">
                    <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="">
                    <em>职位：{{position}}</em>
                    </div>
                    <div class="footer">
                      <span>
                        <em>员工号：</em> {{userId}}
                      </span>
                      <span>
                          入职天数：{{workDay}}
                      </span>
                      </div>                           
                </div>
              </n-card>
              <n-card  hoverable >
                <div style="text-align:center;font-size:16px">
                  我的任务
                </div>
                <div id="main" style="width: 600px;height:320px;" >
                </div>
              </n-card>
            </n-space>
        </div>
</template>
    
<script lang ='ts'>
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption
} from 'echarts/components';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

import { h, defineComponent, ref, onMounted } from 'vue'
import { useNotification, NotificationType,useMessage } from 'naive-ui'
import {HTTPAddSignIn,HTTPGetUserTask,HTTPGetUser} from './HttpMethods'
interface data {
  userId: string
}
export default defineComponent({
  
  setup () {
    const data = ref([])
    const userId = ref('')
    const userName = ref('')
    const workDay = ref('')
    const position = ref('')
    const dept = ref('')
     echarts.use([
        TooltipComponent,
        LegendComponent,
        PieChart,
        CanvasRenderer,
        LabelLayout
      ]);
      type EChartsOption = echarts.ComposeOption<
        TooltipComponentOption | LegendComponentOption | PieSeriesOption
      >;
    onMounted(()=> {
      getUser()
      getTask()
    })
    const getUser = () => {
      HTTPGetUser()?.then((res:any) =>{
        console.log(res);
        userId.value = res.userId
        userName.value = res.name
        workDay.value = res.workDay
        dept.value = res.department.name
        localStorage.setItem('USERID', res.userId)
        localStorage.setItem('USERNAME',res.name)
        localStorage.setItem('DEPT', res.department.name)
        localStorage.setItem('WORKDAY',res.workDay)
        const positionname:any = []
        res.position.map((item:any) => {
            positionname.push(item.name)
        })
        position.value = positionname.join(",")
        localStorage.setItem('POSITION', JSON.stringify(positionname))
        let permission:any = []
        res.permission.forEach( (element:any) => {
        permission.push( element.code )
        });
        localStorage.setItem('permission', JSON.stringify(permission))
        let menu:any = []
        res.menu.forEach( (element:any) => {
        menu.push( element.code )
        });
        localStorage.setItem('MENU', JSON.stringify(menu))
      })
    } 
    
    const init = ()=>{
      var chartDom = document.getElementById('main')!;
      var myChart = echarts.init(chartDom);
      var option: EChartsOption;
      option = {
        tooltip: {
          trigger: 'item'
        },
        // legend: {
        //   top: '5%',
        //   left: 'center'
        // },
        series: [
          {
            name: '任务名',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              //position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: data.value
          }
        ]
      };
      option && myChart.setOption(option);
    }
    const message = useMessage()
    const notification = useNotification()
    const notice = (string: NotificationType, context:string) => {
      notification[string]({
          content: context,
          meta: string,
          duration: 2000
      })
    }
    const getTask = () =>{
      let id = localStorage.getItem('USERID') || ''
      HTTPGetUserTask(id)?.then((res:any) =>{
        const d:any = []
        res.forEach((element:any) => {
          d.push({value:1,name:element.task.name})
        });
        data.value = d
        init()
      })
    }
    const signIn = () => {
        const data:data ={
            userId : localStorage.getItem("USERID") || ''
        }
        HTTPAddSignIn(data)?.then((res:any) =>{
          if(res.code === 200){
            message.success(res.message)
            //notice('success', res.message)
          } else {
            message.error(res.message)
              //notice('error', res.message)
          }
        })
    }
    
    return {
      signIn,
      notice,
      userId,
      userName,
      workDay,
      dept,
      position,
    }
  }
})
</script>
    
<style lang='less'>
    @import url('./home.less');

</style>