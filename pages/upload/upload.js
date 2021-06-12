// pages/upload/upload.js
// 上传界面

import {request_upload, request_add_receipt, request_ocr_upload} from "../../utils/requests";
import {extract_info, format_info, format_qrcode, get_token, qrcode_to_json} from "../../utils/function";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    checkCode: "15272504949418507598",
    id: null,
    invoiceCode: "012002000211",
    invoiceDate: "2020年10月30日",
    invoiceNumber: "62784966",
    invoiceStatus: null,
    machineCode: "499099255147",
    purchaseType: null,
    purchaserAddrTel: "",
    purchaserBankCode: "",
    purchaserCode: "91420100591089886L",
    purchaserName: "武汉凡诺软件技术有限公司",
    remark: "",
    saveUrl: "E:\eisms\invoice1612074841629mfAq.pdf",
    sellerAddrTel: "天津经济技术开发区南港工业区综合服务区办公楼C座103室12单元022-59002850",
    sellerBankCode: "招商银行股份有限公司天津自由贸易试验区分行122905939910401",
    sellerCode: "911201163409833307",
    sellerName: "滴滴出行科技有限公司",
    title: "天津增值税电子普通发票",
    totalExpense: 129.95,
    totalTax: 0,
    totalTaxExpense: 129.95,
    totalTaxExpenseZh: "壹佰贰拾玖圆玖角伍分",
    type: 0,
    uploadDa3te: null,
    userId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //  从pdf上传
  pdfUpload(){
    // 获取token
    let token = get_token()
    if(token==='')  return

    let that = this
    let tempFilePaths = []
    //  选择文件
    wx.chooseMessageFile({
      count: 1,
      type:'pdf',
      async success (res) {
        let tempFiles = res.tempFiles
        for(let i=0;i<tempFiles.length;i++){
          tempFilePaths[i]=tempFiles[i].path
        }
        console.log("tempFilePaths:",tempFilePaths[0])

        //  上传文件
        let result = await request_upload('/invoice/batchUpload',tempFilePaths[0])
        if(result.statusCode===200){
          // that.setData({
          //   receipt:result.data
          // })
          let info = extract_info(result.data)   //提取发票信息，格式为json对象
          //  弹出确认框
          wx.showModal({
            title:'识别信息',
            content:info?format_info(info):'未获取到信息',
            confirmText:'信息无误',
            confirmColor:'#07c160',
            cancelText:'信息有误',
            cancelColor:'#576B95',
            async success (res) {
              if (res.confirm) {
                let result = await request_add_receipt('/invoice/batchAdd',info)
                // console.log("result",result)
                if(result.code===200){
                  wx.showToast({
                    title: '发票上传成功',
                    icon:'success'
                  })
                }else if(result.code===500){
                  wx.showToast({
                    title: '发票已存在，请勿重复上传',
                    icon:'none'
                  })
                }else{
                  wx.showToast({
                    title: '上传失败，请检查网络',
                    icon:'none'
                  })
                }
              } else if (res.cancel) {
                wx.setStorageSync("receiptInfo",info)
                console.log('信息有误,进入修改界面')
                wx.navigateTo({
                  url:'/pages/receiptInfo/receiptInfo'
                })
              }
            }
          })
        }
      },
      fail (){
        wx.showToast({
          title:'文件选择失败',
          icon:'none'
        })
      }
    })
  },

  //  从二维码上传
  scanQrcode(){
    // 获取token
    let token = get_token()
    if(token==='')  return

    wx.scanCode({
      scanType:['qrCode'],
      success (res) {
        console.log(res)
        let info = res.result
        wx.showModal({
          title:'识别信息',
          content:info?format_qrcode(info):'未获取到信息',
          confirmText:'完善信息',
          confirmColor:'#07c160',
          cancelText:'信息有误',
          cancelColor:'#576B95',
          async success (res) {
            wx.setStorageSync("receiptInfo",qrcode_to_json(info))
            if (res.confirm) {
              console.log('完善信息,进入修改界面')
              wx.navigateTo({
                url:'/pages/receiptInfo/receiptInfo'
              })
            } else if (res.cancel) {
              console.log('信息有误,进入修改界面')
              wx.navigateTo({
                url:'/pages/receiptInfo/receiptInfo'
              })
            }
          }
        })
      },
      fail(res){
        wx.showToast({
          title: '识别失败',
          icon: 'none'
        })
      }
    })
  },

  //  从图片上传
  imageUpload(){
    let token = get_token()
    if(token==='')  return

    let that = this
    let tempFilePaths = []
    //  选择文件
    wx.chooseMessageFile({
      count: 1,
      type:'image',
      async success (res) {
        let tempFiles = res.tempFiles
        for(let i=0;i<tempFiles.length;i++){
          tempFilePaths[i]=tempFiles[i].path
        }
        console.log("tempFilePaths:",tempFilePaths[0])

        //  上传文件
        // let result = await request_ocr_upload('http://106.13.68.60:5000/upload',tempFilePaths[0])
        let result = await request_upload('/invoice/batchUploadImgs',tempFilePaths[0])
        if(result.statusCode===200){
          // that.setData({
          //   receipt:result.data
          // })
          let info = extract_info(result.data)   //提取发票信息，格式为json对象
          //  弹出确认框
          wx.showModal({
            title:'识别信息',
            content:info?format_info(info):'未获取到信息,请调整拍照角度',
            confirmText:'核对信息',
            confirmColor:'#07c160',
            cancelText:'重新上传',
            cancelColor:'#576B95',
            async success (res) {
              if (res.cancel) {
                // let result = await request_add_receipt('/invoice/batchAdd',info)
                // if(result.code===200){
                //   wx.showToast({
                //     title: '发票上传成功',
                //     icon:'success'
                //   })
                // }else if(result.code===500){
                //   wx.showToast({
                //     title: '发票已存在，请勿重复上传',
                //     icon:'none'
                //   })
                // }else{
                //   wx.showToast({
                //     title: '上传失败，请检查网络',
                //     icon:'none'
                //   })
                // }
              } else if (res.confirm) {
                wx.setStorageSync("receiptInfo",info)
                console.log('核对信息,进入修改界面')
                wx.navigateTo({
                  url:'/pages/receiptInfo/receiptInfo'
                })
              }
            }
          })
        }
      },
      fail (){
        wx.showToast({
          title:'文件选择失败',
          icon:'none'
        })
      }
    })
  },

  //  从图片上传
  ocrUpload(){
    let token = get_token()
    if(token==='')  return

    let that = this
    let tempFilePaths = []
    //  选择文件
    wx.chooseMessageFile({
      count: 1,
      type:'image',
      async success (res) {
        let tempFiles = res.tempFiles
        for(let i=0;i<tempFiles.length;i++){
          tempFilePaths[i]=tempFiles[i].path
        }
        console.log("tempFilePaths:",tempFilePaths[0])

        //  上传文件
        let result = await request_ocr_upload('http://106.13.68.60:5000/upload',tempFilePaths[0])
        // let result = await request_upload('/invoice/batchUploadImgs',tempFilePaths[0])
        if(result.statusCode===200){
          // that.setData({
          //   receipt:result.data
          // })
          let info = extract_info(result.data)   //提取发票信息，格式为json对象
          //  弹出确认框
          wx.showModal({
            title:'识别信息',
            content:info?format_info(info):'未获取到信息,请调整拍照角度',
            confirmText:'核对信息',
            confirmColor:'#07c160',
            cancelText:'重新上传',
            cancelColor:'#576B95',
            async success (res) {
              if (res.cancel) {
                // let result = await request_add_receipt('/invoice/batchAdd',info)
                // if(result.code===200){
                //   wx.showToast({
                //     title: '发票上传成功',
                //     icon:'success'
                //   })
                // }else if(result.code===500){
                //   wx.showToast({
                //     title: '发票已存在，请勿重复上传',
                //     icon:'none'
                //   })
                // }else{
                //   wx.showToast({
                //     title: '上传失败，请检查网络',
                //     icon:'none'
                //   })
                // }
              } else if (res.confirm) {
                wx.setStorageSync("receiptInfo",info)
                console.log('核对信息,进入修改界面')
                wx.navigateTo({
                  url:'/pages/receiptInfo/receiptInfo'
                })
              }
            }
          })
        }
      },
      fail (){
        wx.showToast({
          title:'文件选择失败',
          icon:'none'
        })
      }
    })
  },

  //  跳转到发票管理界面
  toReceipt(){
    wx.switchTab({
      url:'/pages/receipt/receipt'
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
