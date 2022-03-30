<template>
        <div>
            <n-card hoverable>
            <div class="homeContent">
              <div class="contentLeft">
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />    
                <span> 欢迎您！{{username}}， 祝您办公愉快！</span>
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
                    部门：</em>{{DEPT}}</span>
                   
                  </div>
                  <div class="content">
                    <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="">
                    <em>职位：{{POSITION}}</em>
                    </div>
                    <div class="footer">
                      <span>
                        <em>员工号：</em> {{USERID}}
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

import { h, defineComponent, ref, onMounted, getCurrentInstance } from 'vue'
import { useNotification, NotificationType } from 'naive-ui'
import {HTTPAddSignIn,HTTPGetUserTask} from './HttpMethods'
interface data {
  userId: string,
  name: string,
}
export default defineComponent({
  
  setup () {
    const data = ref([])
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
      getTask()?.then(res =>{
        data.value = res
        init()
      })
      
    })
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
      return HTTPGetUserTask(id)?.then((res:any) =>{
        console.log(res)
        const data:any = []
        res.forEach((element:any) => {
          data.push({value:1,name:element.task.name})
        });
        console.log(data)
        return data
      })
    }
    const signIn = () => {
        const data:data ={
            userId : localStorage.getItem("USERID") || '',
            name : localStorage.getItem("USERNAME") || ''
        }
        HTTPAddSignIn(data)?.then((res:any) =>{
          if(res.code === 200){
              notice('success', res.message)
          } else {
              notice('error', res.message)
          }
        })
    }
    
    return {
      signIn,
      notice,
      USERID: localStorage.getItem('USERID'),
      POSITION: localStorage.getItem('POSITION'),
      DEPT: localStorage.getItem('DEPT'),
      workDay:localStorage.getItem('WORKDAY'),
      username: localStorage.getItem('USERNAME')
    }
  }
})
</script>
    
<style lang='less'>
    @import url('./home.less');

</style>