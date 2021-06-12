// pages/statistic/statistic.js
import * as echarts from "../../ec-canvas/echarts";
import {request_token} from "../../utils/requests";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    expenseValue:[],
    expenseUsed:[],
    max:0,
    ecRadar: {
      lazyLoad: true
    },

    ecPie: {
      lazyLoad: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-multi-radar');
    this.ecComponent2 = this.selectComponent('#mychart-dom-multi-pie');
  },

  //  初始化雷达图
  initRadar(){
    this.ecComponent.init((canvas, width, height, dpr)=>{
      const radarChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      canvas.setChart(radarChart);

      radarChart.setOption(getRadarOption(this));
      return radarChart;
    })
  },

  //  初始化饼状图
  initPie(){
    this.ecComponent2.init((canvas, width, height, dpr)=>{
      const pieChart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      canvas.setChart(pieChart);

      pieChart.setOption(getPieOption(this));
      return pieChart;
    })
  },

  //  处理雷达图数据
  getExpenseValue(data) {
    let expenseValue = []
    for (let i = 0; i < data.length; i++) {
      if (this.data.max < data[i].value) {
        this.setData({
          max:data[i].value
        });
      }
      expenseValue.push(data[i].value);
    }
    this.setData({expenseValue:expenseValue})
    if (this.data.max === 0) {
      this.setData({max:1})
    }
  },

  //  处理饼状图数据
  getExpenseUsed(data){
    this.setData({
      expenseUsed:data
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    let result = await request_token('/statistic/expenseType?startDate=2020-02-01&endDate=2021-03-01')
    if(result.code===200){
      this.getExpenseValue(result.data)
      this.initRadar()
      console.log("expenseValue",this.data.expenseValue)
    }else{
      wx.showToast({
        title:"出现错误："+result.msg,
        icon:'none'
      })
    }

    let result2 = await request_token('/statistic/expenseUsed?startDate=2021-02-01&endDate=2021-03-01')
    if(result2.code===200){
      this.getExpenseUsed(result2.data)
      this.initPie()
      console.log("expenseUsed",this.data.expenseUsed)
    }else{
      wx.showToast({
        title:"出现错误："+result.msg,
        icon:'none'
      })
    }
    // return result.data.list

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
      title: '看看你的消费情况吧！',
      path: '/pages/statistic/statistic',
      success: (res)=> { },
      fail: (res)=>{ }
    }
  },
});

//  获取雷达图的各项参数
function getRadarOption(that) {

  let option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA"],
    title: {
      text: '近一个月消费分类'
    },
    tooltip: {
      trigger: "item"
    },
    legend: {
      left: "center",
      bottom: "10",
      data: ["消费"],
    },
    radar: {
      radius: "66%",
      center: ["50%", "45%"],
      splitNumber: 8,
      splitArea: {
        areaStyle: {
          color: "rgba(127,95,132,.3)",
          opacity: 1,
          shadowBlur: 45,
          shadowColor: "rgba(0,0,0,.5)",
          shadowOffsetX: 0,
          shadowOffsetY: 15,
        },
      },
      indicator: [
        { text: "差旅", max: that.data.max },
        { text: "餐饮", max: that.data.max },
        { text: "文娱", max: that.data.max },
        { text: "通讯", max: that.data.max },
        { text: "医疗", max: that.data.max },
        { text: "交通", max: that.data.max },
        { text: "其他", max: that.data.max },
      ],
    },
    series:[
      {
        type: "radar",
        symbolSize: 0,
        areaStyle: {
          normal: {
            shadowBlur: 13,
            shadowColor: "rgba(0,0,0,.2)",
            shadowOffsetX: 0,
            shadowOffsetY: 10,
            opacity: 1,
          },
        },
        data: [
          {
            value: that.data.expenseValue,
            name: "消费",
          },
        ],
        animationDuration: 3000,
      },
    ],
  }
  return option

}

//  获取饼状图的各项参数
function getPieOption(that) {

  let option = {
    title: {
      text: "近一个月内预算额度统计",
    },
    color: ["#A2D405","#37A2DA"],
    tooltip: {
      trigger: "item",
      formatter: "{a} {b} : {c} ({d}%)",
    },
    legend: {
      bottom: "10",
      left: "center",
    },
    series: [
      {
        name: "报销额度统计",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: that.data.expenseUsed.total - that.data.expenseUsed.used,
            name: "剩余",
          },
          {
            value: that.data.expenseUsed.used,
            name: "已使用",
          },
        ],
        animationEasing: "cubicInOut",
        animationDuration: 1000,
      },
    ],
  }
  return option

}
