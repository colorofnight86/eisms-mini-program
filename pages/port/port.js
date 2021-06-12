// pages/port/port.js
import config from "../../utils/config";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip:'',
    port:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let host = wx.getStorageSync('host')
    let ip, port
    if(host==='') {
      ip = config.ip
      port = config.port
    }else{
      ip = host.split(":")[1].slice(2)
      port = host.split(":")[2]
    }
    this.setData({
      ip: ip,
      port: port
    })
  },

  handleInput(event){
    let type = event.currentTarget.id
    console.log(type, event.detail.value)
    this.setData({
      [type]:event.detail.value
    })
  },

  //  保存端口配置
  save(){
    let host = 'http://'+this.data.ip+':'+this.data.port
    wx.setStorageSync('host',host)
    wx.showToast({
      title:'请求地址保存为：'+ host,
      icon:'none',
      duration: 2000,
      success: function () {
        setTimeout(function() {
          wx.navigateBack({
            url:'/pages/personal/personal'
          })
        }, 2000);
      }
    })


  },

  //  跳转到个人中心
  toPersonal(){
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
