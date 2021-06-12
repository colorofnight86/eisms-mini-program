// pages/personal/personal.js
// 个人中心

import config from "../../utils/config";
import {logout} from "../../utils/function";

let startY = 0; // 手指起始的坐标
let moveY = 0; // 手指移动的坐标
let moveDistance = 0; // 手指移动的距离

Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundUrl:'',
    cardUrl:'',
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo: {}, // 用户信息
    login:false,
    personalUser:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取登录信息
    let login = wx.getStorageSync('login');
    if(login) {
      // 读取用户的基本信息
      let token = wx.getStorageSync('token');
      let userInfo = wx.getStorageSync('userInfo');
      let personalUser = wx.getStorageSync('personalUser');
      if (userInfo !== '') {
        this.setData({
          userInfo: userInfo,
          login: login,
          personalUser:personalUser
        })
      } else {
        wx.showToast({
          title: '获取信息失败，请尝试刷新页面或重新登录',
          icon: 'none'
        })
      }
    }
  },

  //  界面随手指滑动而滑动
  handleTouchStart(event){
    this.setData({
      coverTransition: ''
    })
    // 获取手指起始坐标
    startY = event.touches[0].clientY
  },
  handleTouchMove(event){
    moveY = event.touches[0].clientY
    moveDistance = moveY - startY

    if(moveDistance <= 0){
      return
    }
    if(moveDistance >= 80){
      moveDistance = 80
    }
    // 动态更新coverTransform的状态值
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd(){
    //  动态更新coverTransform的状态值
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: 'transform 0.5s linear'
    })
  },

  //跳转至index界面
  toIndex(){
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },

  //  跳转至登录页面
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  //  跳转至用户信息界面
  toUserInfo(){
    wx.navigateTo({
      url: '/pages/userInfo/userInfo'
    })
  },

  //  跳转至上传界面
  toUpload(){
    wx.switchTab({
      url: '/pages/upload/upload'
    })
  },

  //  开启调试模式
  debug(){
    wx.setEnableDebug({
      enableDebug: true
    })
    wx.showToast({
      title:'调试模式已打开',
      icon:'success'
    })
  },

  //  跳转至装扮设置
  toSkin(){
    wx.navigateTo({
      url: '/pages/skin/skin'
    })
  },

  //  跳转至发票列表界面
  toReceipt(){
    wx.switchTab({
      url: '/pages/receipt/receipt'
    })
  },

  //  跳转至申请界面
  toApplication(){
    wx.navigateTo({
      url: '/pages/application/application'
    })
  },

  //  跳转至数据统计页面
  toStatistic(){
    wx.navigateTo({
      url: '/pages/statistic/statistic'
    })
  },

  //  跳转至消费预测页面
  toPrediction(){
    wx.navigateTo({
      url: '/pages/prediction/prediction'
    })
  },

  //  注销
  logout(){
    logout()
  },

  //  跳转到端口设置
  toPort(){
    console.log("toPort")
    wx.navigateTo({
      url:'/pages/port/port'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
    // console.log(this.data.userInfo.imageUrl==null)
    let skin = wx.getStorageSync('skin')
    if(skin!=='') {
      this.setData({
        backgroundUrl: skin[0]?config.bgImgPath + skin[0] + config.bgImgSuffix:'',
        cardUrl:skin[1]?config.cardImgPath + skin[1] + config.cardImgSuffix:''
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
  onShareAppMessage: function () {

  }
})
