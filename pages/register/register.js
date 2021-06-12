// pages/index/register/register.js
import {request} from "../../utils/requests";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'asdf',
    password:'123',
    password2:'123',
    email:'a@b.c',
    phoneNumber:'14567890123',
    sex:'1',
    birthday:'1999-01-01'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //  输入框数据绑定
  handleInput(event){
    let type = event.currentTarget.id
    console.log(type, event.detail.value)
    this.setData({
      [type]:event.detail.value
    })
  },

  //  性别选择
  radioChange(event){
    console.log("sex", event.detail.value)
    this.setData({
      sex:event.detail.value
    })
  },

  //  日期改变
  bindDateChange(event) {
    console.log("birthday", event.detail.value)
    this.setData({
      birthday: event.detail.value
    })
  },

  //  注册
  async register(){
    let {username, password, password2, email, phoneNumber} = this.data
    //  前端校验
    if(!password||!password2||!email||!phoneNumber){
      wx.showToast({
        title:'输入不能为空',
        icon:'none'
      })
      return
    }
    if(password!==password2){
      wx.showToast({
        title:'两次密码不一致',
        icon:'none'
      })
      return
    }
    let usernameReg = /^[\w_-]+$/
    if(!usernameReg.test(username)){
      wx.showToast({
        title:'用户名格式错误',
        icon:'none'
      })
      return
    }
    let passwordReg = /^[\w_-]+$/
    if(!passwordReg.test(password)){
      wx.showToast({
        title:'密码格式错误',
        icon:'none'
      })
      return
    }
    let phoneReg = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/
    if(!phoneReg.test(phoneNumber)){
      wx.showToast({
        title:'手机号格式错误',
        icon:'none'
      })
      return
    }
    let emailRge = /^[\w_-]+@[\w_-]+(\.[\w_-]+)+$/
    if(!emailRge.test(email)){
      wx.showToast({
        title:'邮箱错误',
        icon:'none'
      })
      return
    }

    wx.showToast({
      title:'等待响应',
      icon:'loading',
      duration:4000
    })

    //  后端校验
    let data = this.data
    console.log("传入data：",data)
    let result = await request('/auth/register',data,'POST')
    console.log('result',result)
    if(result.code===200){
      wx.showToast({
        title:'注册成功',
        icon:'success'
      })
    }else if(result.code===201){
      wx.showToast({
        title:'用户名已存在',
        icon:'none'
      })
    }else{
      wx.showToast({
        title:'注册失败',
        icon:'none'
      })
    }

  },

  //  跳转登录界面
  toLogin(){
    wx.reLaunch({
      url:'/pages/login/login'
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
