// pages/prediction/prediction.js

import * as echarts from '../../ec-canvas/echarts';
import {request_token} from "../../utils/requests";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    expenseValue:[],
    expenseDate:[],
    ecBar: {
      lazyLoad: true
    },

    ecLine: {
      lazyLoad: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //  获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-multi-bar');
    this.ecComponent2 = this.selectComponent('#mychart-dom-multi-line');
  },

  // 初始化条形图
  initBar(){
    this.ecComponent.init((canvas, width, height, dpr)=>{
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      canvas.setChart(barChart);

      barChart.setOption(getBarOption(this));
      return barChart;
    })
  },

  //  初始化折线图
  initLine(){
    this.ecComponent2.init((canvas, width, height, dpr)=>{
      const lineChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      canvas.setChart(lineChart);

      let date = [];
      let expense = [];
      this.data.expenseDate.forEach((value) => {
        date.push(value["date"]);
        expense.push(value.expense);
      });
      lineChart.setOption(getLineOption(date, expense));
      return lineChart;
    })
  },

  //  处理条形图数据
  getExpenseValue(data){
    let expenseValue = []
    for (let i = 0; i < data.length; i++) {
      expenseValue.push(data[i].value);
    }
    this.setData({expenseValue:expenseValue})
  },

  //  处理折线图数据
  getExpenseDate(data){
    this.setData({
      expenseDate:data
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    let result = await request_token('/statistic/predicate')
    if(result.code===200){
      this.getExpenseValue(result.data)
      this.initBar()
      console.log("expenseValue",this.data.expenseValue)
    }else{
      wx.showToast({
        title:"出现错误："+result.msg,
        icon:'none'
      })
    }

    let result2 = await request_token('/statistic/expenseDate?startDate=2020-03-01&endDate=2021-03-01')
    if(result2.code===200){
      this.getExpenseDate(result2.data)
      this.initLine()
      console.log("expenseDate",this.data.expenseDate)
    }else{
      wx.showToast({
        title:"出现错误："+result.msg,
        icon:'none'
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '看看你的消费趋势吧！',
      path: '/pages/prediction/prediction',
      success: function () { },
      fail: function () { }
    }
  },
});

//  获取柱状图的各项参数
function getBarOption(that) {

  let option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA"],
    title: {
      text: "本月消费预测图",
    },
    textStyle: {
      fontSize: 12,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      top: 40,
      left: "2%",
      right: "2%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: ["差旅", "餐饮", "文娱", "通讯", "医疗", "交通", "其他"],
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisTick: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: "金额",
        type: "bar",
        stack: "vistors",
        barWidth: "60%",
        data: that.data.expenseValue,
        animationDuration:6000,
      },
    ],
  }
  return option

}

//  获取线形图的各项参数
function getLineOption(date, expense) {

  let option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA"],
    title: {
      text: "消费趋势",
      left: "0",
    },
    grid: {
      left: 10,
      right: 10,
      bottom: 20,
      top: 60,
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: date,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: expense,
        type: "line",
        smooth: true,
      },
    ],
  }
  return option

}
