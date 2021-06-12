// pages/skin/skin.js
import {get_token} from "../../utils/function";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg:'',
    card:'',
    backgroundUrl:'/static/images/personal/bgImg',
    cardUrl:'/static/images/personal/vip-card-bg-'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //  改背景
  changeBg(event){
    this.setData({
      bg:event.currentTarget.id
    })
    console.log("bg",this.data.bg)
  },
  //  改卡片样式
  changeCard(event){
    this.setData({
      card:event.currentTarget.id
    })
    console.log("card",this.data.card)
  },

  //  确定修改
  confirm(){
    if(!get_token(false)){
      wx.showToast({
        title:'请先登录',
        icon:'none'
      })
      return
    }
    wx.setStorageSync('skin',[this.data.bg,this.data.card])
    wx.navigateBack({
      url:'/pages/personal/personal'
    })
  },

  //  取消修改
  cancel(){
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
