// pages/login/login.js
import {request, request_token} from '../../utils/requests'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    username:'yipingjian',
    password:'123',
    token:'',
    codeUrl:'',
    code:'',
    uuid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.refreshCode()
  },

  //  输入框数据绑定
  handleInput(event){
    let type = event.currentTarget.id
    console.log(type, event.detail.value)
    this.setData({
      [type]:event.detail.value
    })
  },

  //  获取新的验证码
  refreshCode(){
    this.getCode().then(r=>{
      if(r){
        this.setData({
          codeUrl:'data:image/gif;base64,' + r.img,
          uuid:r.uuid
        })
      }
    })
  },

  //  登录
  async login(){
    let {username, password, code, uuid} = this.data

    //  前端验证
    if(!username||!password){
      wx.showToast({
        title:'输入不能为空',
        icon:'none'
      })
      return
    }

    let usernameReg = /^\w*$/
    if(!usernameReg.test(username)){
      wx.showToast({
        title:'用户名格式错误',
        icon:'none'
      })
      return
    }

    let passwordReg = /^\w*$/
    if(!passwordReg.test(password)){
      wx.showToast({
        title:'密码格式错误',
        icon:'none'
      })
      return
    }
    wx.showToast({
      title:'正在登录',
      icon:'loading',
      duration:4000
    })

    //后端验证
    let data = {username,password,rememberMe:true,code,uuid}
    console.log('传入data：',data)
    let result = await request('/auth/login',data,'POST')
    console.log('登录响应结果：',result)
    if(result.code===200){//  登录成功
      //  保存token和登录状态
      wx.setStorageSync("login",true)
      let token = result.token
      if (token!=='') {
        wx.setStorageSync("token", token)
      }
      let userInfo = await request_token('/auth/getInfo','GET')
      if(userInfo.code===200) {
        wx.setStorageSync("userInfo",userInfo.user)

        wx.setStorageSync("personalUser",userInfo.roles.includes("ROLE_PERSONAL"))

        wx.showToast({
          title:'登录成功',
          icon:'success',
          duration: 2000,
          success: function () {
            setTimeout(function() {
              wx.reLaunch({
                url:'/pages/personal/personal'
              })
            }, 2000);
          }
        })
      }else{
        wx.showToast({
          title:'登录成功，获取信息失败',
          icon:'none'
        })
      }
    }else if(result.code===400){
      wx.showToast({
        title:'用户名不存在',
        icon:'none'
      })
      this.setData({username: ''})
    }else if(result.code===502){
      wx.showToast({
        title:'密码错误',
        icon:'none'
      })
    }else{
      wx.showToast({
        title:result.msg,
        icon:'none'
      })
    }
    this.setData({password: ''})
  },

  //  跳转到注册页面
  toRegister(){
    wx.navigateTo({
      url:'/pages/register/register'
    })
  },

  //  获取验证码
  async getCode(){
    let res = await request('/auth/verifyCode')
    if(res.code===200){
      return res
    }else{
      wx.showToast({
        title:'验证码获取失败',
        icon:'none'
      })
      return false
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {


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
