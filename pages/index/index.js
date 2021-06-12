// pages/index/index.js
import {request} from '../../utils/requests'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '电子发票',
    slogan: 'Click to check logs',
    userInfo: ''
  },

  getUserInfo(res) {
    console.log(res)
    if (res.detail.userInfo) {
      this.setData({
        userInfo: res.detail.userInfo
      })
    }
  },

  toLogs() {
    console.log('toLogs')
    wx.navigateTo({
      url: '/pages/logs/logs',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log('onLoad')
    // let result = await request('/character')
    // console.log("返回结果:",result)
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
