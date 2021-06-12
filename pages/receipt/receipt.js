// pages/receipt/receipt.js
//  发票列表

import {request_add_receipt, request_token,request_update_receipt} from "../../utils/requests";
import {purchaseDict, purchaseTypeDict, purchaseColorDict} from "../../utils/dictionary";
import {get_token} from "../../utils/function";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiptList:[],  //发票列表
    purchaseDict:[],  //消费类型字典
    purchaseTypeDict:[],  //消费类型数组
    purchaseColorDict:[],  //消费颜色数组
    purchaseType:'',  //消费类型
    searchName:'',  //搜索词
    coverTransform: '', //侧边栏偏移
    coverTransition: '',  //侧边栏变换
    show:true, //侧边栏下一次点击显示状态
    startDate:'', //起始日期
    endDate:'', //结束日期
    minExpense:'',  //最小金额
    maxExpense:'',  //最大金额
    pageSize:20,  //每页个数
    currentPage:1,  //当前页面
    totalPage:0   //总页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      purchaseDict:purchaseDict,
      purchaseTypeDict:purchaseTypeDict,
      purchaseColorDict:purchaseColorDict,
    })
  },

  //  绑定下拉选择器
  bindPickerChange(e) {
    this.setData({
      purchaseType: parseInt(e.detail.value)+1
    })
    console.log('消费类型改变，携带值为', this.data.purchaseType )
  },
  //  绑定日期选择器
  bindDateChange(event) {
    let type=event.currentTarget.id
    this.setData({
      [type]: event.detail.value
    })
    console.log(type,'选择改变，携带值为', event.detail.value )
  },


  //  输入框数据绑定
  handleInput(event){
    let type = event.currentTarget.id
    console.log(type, event.detail.value)
    this.setData({
      [type]:event.detail.value
    })
  },

  // 重置筛选条件
  resetFilter(){
    this.setData({
      purchaseType:'',
      searchName:'',
      startDate:'',
      endDate:'',
      minExpense:'',
      maxExpense:''
    })
    this.search().then(r=>{

    })
  },
  resetSearch(){
    this.resetFilter()
    this.toggleSider()
  },

  //  改变侧边栏显示方式
  toggleSider(){
    this.setData({
      show:!this.data.show,
      coverTransform:this.data.show?'translateX(-100vw)':'translateX(0)',
      coverTransition:this.data.show?'transform 1s ease-out':'transform 0.2s linear'
    })
  },

  //  阻止滑动穿透
  preventTouchmove(){},

  //  筛选搜索
  confirmSearch(){
    this.search().then(r => {
      this.toggleSider()
    })
  },

  goSearch(){
    this.search().then(r=>{})
  },

  //  搜索
  async search(currentPage= 1,firstTime = true){
    //  获取token
    if(!get_token())  return

    let receiptList = []
    //  数据处理
    let searchName=this.data.searchName
    let purchaseType=this.data.purchaseType
    let startDate=this.data.startDate
    let endDate=this.data.endDate
    if(parseInt(this.data.minExpense)>parseInt(this.data.maxExpense)){
      this.setData({
        minExpense:this.data.maxExpense,
        maxExpense:this.data.minExpense
      })
    }
    let minExpense = this.data.minExpense!==''?this.data.minExpense:0
    minExpense='&totalTaxExpense='+minExpense
    let maxExpense = this.data.maxExpense!==''?this.data.maxExpense:999999
    maxExpense='&totalTaxExpense='+maxExpense
    if(searchName!==''){
      searchName='&sellerName='+searchName
    }
    if(purchaseType!==''){
      purchaseType='&purchaseType='+purchaseType
    }
    if(startDate!==''){
      startDate='&invoiceDate='+startDate

      if(endDate!==''){
        endDate='&invoiceDate='+endDate
      }else{
        endDate='&invoiceDate=null'
      }
    }
    if(startDate===''&&endDate!==''){
      startDate='&invoiceDate=null'
      endDate='&invoiceDate='+endDate
    }

    console.log("currentPage",currentPage)

    //  查询请求
    let result = await request_token(
        '/invoice/list?pageSize='+this.data.pageSize+'&currentPage='+currentPage+purchaseType+searchName+minExpense+maxExpense+startDate+endDate)
    if(result.code===200){
      if(firstTime) {
        wx.showToast({
          title: '搜索到' + result.data.totalCount + "条记录",
          icon: 'none'
        })
      }else{
        receiptList = this.data.receiptList
      }
      this.setData({
        receiptList:receiptList.concat(result.data.list),
        currentPage:currentPage+1,
        totalPage:result.data.totalPage
      })
      console.log("receiptList",result.data.list)
    }else if(result.code===500){
      wx.showToast({
        title:"出现错误："+result.msg,
        icon:'none'

      })
    }
    return result.data.list
  },

  //  显示使用情况
  showUse(event) {
    let message = event.currentTarget.dataset.use==='1' ? '发票已使用' : '发票未使用'
    wx.showToast({
      title:message,
      icon:'none'
    })
  }
  ,

  //  修改发票
  reviseReceipt(event){
    let index = event.currentTarget.dataset.index
    let info = this.data.receiptList[index]
    wx.setStorageSync("receiptInfo",info)
    wx.navigateTo({
      url:'/pages/receiptInfo/receiptInfo?revise=1'
    })
  },

  //  删除发票
  async deleteReceipt(event){
    // 获取token
    if(!get_token())  return

    let id = event.currentTarget.dataset.id
    console.log("删除发票id=",id)
    let result = await request_token('/invoice/delete?id='+id,'DELETE')
    if(result.code===200){
      wx.reLaunch({
        url:'/pages/receipt/receipt'
      })
      wx.showToast({
        title:'删除成功',
        icon:'success'
      })
    }else{
      wx.showToast({
        title:result.msg,
        icon:'none'
      })
    }
  },

  //  跳转发票详细信息
  toInfo(event){
    let index = event.currentTarget.dataset.index
    let info = this.data.receiptList[index]
    wx.setStorageSync("receiptInfo",info)
    wx.navigateTo({
      url:'/pages/receiptInfo/receiptInfo?revise=-1'
    })
  },

  //  处理touchstart事件
  handleTouchStart(e) {
    this.startX = e.touches[0].pageX
    this.startY = e.touches[0].pageY
  },

  //  处理touchend事件
  handleTouchEnd(e) {
    if(Math.abs(e.changedTouches[0].pageX-this.startX)>Math.abs(e.changedTouches[0].pageY-this.startY)) {
      if (e.changedTouches[0].pageX - this.startX <= -40) {
        this.showDeleteButton(e)
      } else if (e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX < 40) {
        this.showDeleteButton(e)
      }else {
        this.hideDeleteButton(e)
      }
    }else {
      this.hideDeleteButton(e)
    }
  },

  //  隐藏删除按钮
  hideDeleteButton: function (e) {
    let index = e.currentTarget.dataset.index
    this.setXmove(index, 0)
  },

  //  显示删除按钮
  showDeleteButton: function (e) {
    let index = e.currentTarget.dataset.index
    this.setXmove(index, -120)
  },

  //  设置movable-view位移
  setXmove: function (index, x) {
    let receiptList = this.data.receiptList
    receiptList[index].x = x
    this.setData({
      receiptList: receiptList
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
  async onShow() {
    console.log("onShow")
    this.search().then(r=>{})
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
    console.log("刷新")
    this.search().then(r=>{
      wx.showToast({
        title:'刷新成功',
        icon:'success'
      })
      wx.stopPullDownRefresh()
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.currentPage <= this.data.totalPage) {
      wx.showToast({
        title: '下拉加载',
        icon: 'success'
      })
      this.search(this.data.currentPage,false).then(r => {})
    }else{
      wx.showToast({
        title: '到底了',
        icon: 'none'
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
