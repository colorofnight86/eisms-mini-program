// pages/userInfo/userInfo.js
import {request_token} from "../../utils/requests";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let result = await request_token('/auth/getInfo')
    if(result.code===200){
      console.log("result",result)
      this.setData({
        userInfo:result.user
      })
    }else if(result.code===500){
      wx.showToast({
        title: result.msg,
        icon:'none'
      })
    }else{
      wx.showToast({
        title: '个人信息获取失败，请检查网络设置',
        icon:'none'
      })
    }

  },

  //  注销
  logout(){
    console.log('logout')
    wx.setStorageSync('login',false)
    wx.setStorageSync('token','')
    wx.setStorageSync('skin','')
    wx.setStorageSync('personalUser',false)
    wx.reLaunch({
      url:'/pages/personal/personal'
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
  onPullDownRefresh: function () {

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
