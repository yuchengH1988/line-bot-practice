const linebot = require('linebot')
const express = require('express')
const imgur = require('imgur')
const db = require('./models')
const { File } = db

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const bot = linebot({
  channelId: process.env.channelId,
  channelSecret: process.env.channelSecret,
  channelAccessToken: process.env.channelAccessToken
})

bot.on('message', async (event) => {
  try {
    console.log(event)
    if (event.message.text === '回傳') {
      let msg = await File.findOne({
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        where: {
          userId: event.source.userId
        }
      })
      if (msg.image) {
        await event.reply({
          type: 'image',
          originalContentUrl: msg.image,
          previewImageUrl: msg.image
        })
      } else {
        event.reply("資料庫內目前找不到相關資料")
      }
    }

    if (event.message.type === 'image') {
      imgur.setClientId(process.env.IMGUR_CLIENT_ID)
      event.message.content().then(function (content) {
        imgur
          .uploadBase64(content.toString('base64'))
          .then((json) => {
            console.log(json.link)
            event.reply("已新增至資料庫")
            return File.create({
              userId: event.source.userId,
              image: json.link
            })
          })
          .catch((err) => {
            console.error(err.message)
            event.reply("資料新增失敗，請稍後再試")
          })
      })
    }
  } catch (error) {
    console.log(error)
  }
})

const app = express()
const linebotParser = bot.parser()
app.post('/', linebotParser)

const server = app.listen(process.env.PORT || 3000, function () {
  const port = server.address().port
  console.log(`Example app listening at http://localhost:${port}`)
})

