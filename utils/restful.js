
function startRecord(callback){
  wx.startRecord({
    success (res) {
      let audioFilePath = res.tempFilePath
      callback(audioFilePath)
    }
  })
}

function stopRecord(){
  wx.stopRecord({
    complete: (res) => {
      wx.playVoice({
        filePath: res.tempFilePath
      })
    },
  })
}

module.exports={
  startRecord: startRecord,
  stopRecord: startRecord
}