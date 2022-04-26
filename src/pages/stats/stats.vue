<template>
    <n-card hoverable>
        <n-space justify="space-around" size="large">
            <n-card hoverable v-if="!isAuthPre('STATS:DEPTUSERNUM')">
                <div style="min-height:58px"></div>
                <div style="text-align:center;font-size:16px">
                    部门员工人数图
                </div>
                <div id="deptUserNum" style="width: 600px;height:320px;" >
                </div>
            </n-card>
            <n-card hoverable >
                <n-form inline label-placement="left" >
                    <n-form-item label='部门:' v-if="!isAuthPre('STATS:DEPTJIANGCHENGALL')">
                        <n-select placeholder="请选择部门" v-model:value="form.departmentId" :options="departmentOptions" clearable style="width: 135px">
                        </n-select>
                    </n-form-item>
                    <n-form-item label='年月:'>
                        <n-date-picker 
                        placeholder="请选择月份" 
                        value-format="yyyy-MM" 
                        v-model:formatted-value="form.date" 
                        type="month" 
                        :is-date-disabled="disablePreviousDate"
                        clearable 
                        style="width: 135px"/>
                    </n-form-item>
                    <n-form-item>
                        <n-button tertiary type="primary" @click="deptAward">
                            查询
                        </n-button>
                    </n-form-item>
                </n-form>
                <div style="text-align:center;font-size:16px">
                    部门奖惩记录图
                </div>
                <div id="deptAward" style="width: 600px;height:320px;" >
                </div>
            </n-card>
            <n-card hoverable >
                <n-form inline label-placement="left" >
                    <n-form-item label='部门:' v-if="!isAuthPre('STATS:USERSIGNALL')">
                        <n-select placeholder="请选择部门" v-model:value="form1.departmentId" :options="departmentOptions" clearable style="width: 135px">
                        </n-select>
                    </n-form-item>
                    <n-form-item label='年月:'>
                        <n-date-picker 
                        placeholder="请选择月份" 
                        value-format="yyyy-MM" 
                        v-model:formatted-value="form1.date" 
                        type="month" 
                        :is-date-disabled="disablePreviousDate"
                        clearable 
                        style="width: 135px"/>
                    </n-form-item>
                    <n-form-item>
                        <n-button tertiary type="primary" @click="userSign">
                            查询
                        </n-button>
                    </n-form-item>
                </n-form>
                <div style="text-align:center;font-size:16px">
                    员工考勤记录图
                </div>
                <div id="userSign" style="width: 600px;height:320px;" >
                </div>
            </n-card>
        </n-space>
    </n-card>
</template>
<script>
import { h, defineComponent, ref, onMounted,getCurrentInstance } from 'vue'
import { NTag, NButton, useMessage,  } from 'naive-ui'

import * as echarts from 'echarts';


import {HTTPGetDepartment,HTTPGetDeptAward,HTTPGetUserSign} from './HttpMethods'
export default defineComponent({
  setup () {
    const isAuthPre= getCurrentInstance()?.appContext.config.globalProperties.isAuthPer
    const message = useMessage()
    const deptUserNumData = ref([])
    const deptAwardData = ref([])
    const form = ref({
        userId: localStorage.getItem('USERID'),
        departmentId:null,
        date:null
    })
    const departmentOptions = ref([])
    const userSignData = ref([])
    const form1 = ref({
        userId: localStorage.getItem('USERID'),
        departmentId:null,
        date:null
    })
    onMounted(() =>{
        if(!isAuthPre('STATS:DEPTUSERNUM')){
            deptUserNum()
        }
      deptAward()
      userSign()
    })
    const deptUserNum = ()=>{
      HTTPGetDepartment().then(res =>{
          res.forEach(element => {
          departmentOptions.value.push({
            value: element.id,
            label: element.name
            })
          });
          const data = []
          res.forEach((element) => {
            data.push({value:element.userNum,name:element.name})
          });
          deptUserNumData.value = data
          deptUserNumInit()
      })
    }
    const deptUserNumInit = ()=>{
        var chartDom = document.getElementById('deptUserNum');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}人 ({d}%)'
        },
        label: {
            fontSize: 20
        },
        series: [
            {
            name: '部门：',
            type: 'pie',
            radius: '70%',
            data: deptUserNumData.value,
            emphasis: {
            itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
                }
            }
            ]
            };
        option && myChart.setOption(option);
    }
    const deptAward = () =>{
        HTTPGetDeptAward(form.value).then(res =>{
            deptAwardData.value = res
            deptAwardInit()
        })
    }
    const deptAwardInit = () =>{
        var myChart = echarts.getInstanceByDom(document.getElementById('deptAward'))
        if(myChart == null){
            var chartDom = document.getElementById('deptAward');
            myChart = echarts.init(chartDom);
        }
        var option;
        option = {
        legend: {},
        tooltip: {trigger: 'axis',},
        dataset: {
            dimensions: ['name', 'jiangli', 'chengfa'],
            source: deptAwardData.value
        },
        dataZoom: [
            {
                type: 'slider',
                show: true,
                start: 0,
                end: 100
            }
        ],
        xAxis: { type: 'category', axisLabel: { interval: 0 }, },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
            { 
            type: 'bar',
            name:'奖励次数' ,
            color:'#67c23ae0'
            }, 
            { 
            type: 'bar',
            name:'惩罚次数' ,
            color:'#f72c2ce8'
            }
            ]
        };
        option && myChart.setOption(option);
    }
    const userSign = ()=>{
        HTTPGetUserSign(form1.value).then(res =>{
            userSignData.value = res
            userSignInit()
        })
    }
    const userSignInit = ()=>{
        var myChart = echarts.getInstanceByDom(document.getElementById('userSign'))
        if(myChart == null){
            var chartDom = document.getElementById('userSign');
            myChart = echarts.init(chartDom);
        }
        var option;
        option = {
        legend: {},
        tooltip: {trigger: 'axis',},
        dataset: {
            dimensions: ['name', 'signDays', 'lateDays','traveDays','leaveDays','notWorkDays'],
            source: userSignData.value
        },
        dataZoom: [
            {
                type: 'slider',
                show: true,
                start: 0,
                end: 100
            }
        ],
        xAxis: { type: 'category', axisLabel: { interval: 0 }, },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
            { 
            type: 'bar',
            name:'签到天数' 
            }, 
            { 
            type: 'bar',
            name:'迟到天数' 
            },
            { 
            type: 'bar',
            name:'出差天数' 
            }, 
            { 
            type: 'bar',
            name:'请假天数' 
            }, 
            { 
            type: 'bar',
            name:'旷工天数' 
            }, 
            ]
        };
        option && myChart.setOption(option);
    }
    return {
        isAuthPre,
        deptAward,
        departmentOptions,
        form,
        form1,
        userSign,
        disablePreviousDate(ts) {
        return ts >= Date.now();
      }
    }
  }
})
</script>