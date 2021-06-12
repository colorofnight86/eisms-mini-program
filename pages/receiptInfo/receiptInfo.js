// pages/receiptInfo/receiptInfo.js
//  发票详情

import {request_add_receipt,request_update_receipt} from "../../utils/requests";
import {typeDict,purchaseDict} from "../../utils/dictionary";
import {get_token} from "../../utils/function";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    typeDict:[],
    purchaseDict:[],
    revise:0,
    checkCode: "",
    id: null,
    invoiceCode: "",
    invoiceDate: "",
    invoiceNumber: "",
    invoiceStatus: null,
    machineCode: "",
    purchaseType: null,
    purchaserAddrTel: "",
    purchaserBankCode: "",
    purchaserCode: "",
    purchaserName: "",
    saveUrl: "",
    sellerAddrTel: "",
    sellerBankCode: "",
    sellerCode: "",
    sellerName: "",
    title: "",
    totalExpense: null,
    totalTax: null,
    totalTaxExpense: null,
    totalTaxExpenseZh: "",
    type: 0,
    uploadDate: null,
    userId: null,
    serviceDetails:[{
      serviceName: "",
      specification: null,
      expense: null,
      taxRate: null,
      taxExpense: null,
      unitPrice: null,
      count: null,
      unit: null
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.revise){
      this.setData({
        revise:options.revise
      })
    }
    let info = wx.getStorageSync("receiptInfo")
    if(info===''){
      return
    }
    for(let key in info){
      // 循环赋值
      if(key==='revise'){
        continue
      }
      this.setData({
        [key]:info[key]
      })
    }
    this.setData({
      typeDict:typeDict,
      purchaseDict:purchaseDict
    })
  },

  //  绑定选择器
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      type: e.detail.value
    })
  },
  bindPickerChange2(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      purchaseType: parseInt(e.detail.value)+1
    })
    console.log("purchaseType",this.data.purchaseType)
  },

  //  输入框数据绑定
  handleInput(event){
    let type = event.currentTarget.id
    console.log(type, event.detail.value)
    this.setData({
      [type]:event.detail.value
    })
  },

  //  修改发票信息
  async update(){
    // 获取token
    let token = get_token()
    if(token==='')  return

    console.log("上传")
    let result = await request_update_receipt('/invoice/update',this.data)
    if(result.code===200){
      // console.log("result",result)
      wx.navigateBack()
      wx.showToast({
        title: '发票上传成功',
        icon:'success'
      })
    }else if(result.code===500){
      wx.showToast({
        title: result.msg,
        icon:'none'
      })
    }else{
      wx.showToast({
        title: '上传失败，请检查网络',
        icon:'none'
      })
    }
  },

  //  上传发票信息
  async upload(){
    // 获取token
    let token = get_token()
    if(token==='')  return

    console.log("上传")
    let result = await request_add_receipt('/invoice/batchAdd',this.data)
    if(result.code===200){
      // console.log("result",result)
      wx.navigateBack()
      wx.showToast({
        title: '发票上传成功',
        icon:'success'
      })
    }else if(result.code===500){
      wx.showToast({
        title: result.msg,
        icon:'none'
      })
    }else{
      wx.showToast({
        title: '上传失败，请检查网络',
        icon:'none'
      })
    }
  },

  //  返回上传界面
  toUpload(){
    wx.reLaunch({
      url:'/pages/upload/upload'
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
    console.log("onUnload")
    //  清除缓存中的发票数据
    wx.setStorageSync("receiptInfo",'')
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
