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
      await event.reply(msg.image)
    }

    if (event.message.type === 'image') {
      imgur.setClientId(process.env.IMGUR_CLIENT_ID)
      event.message.content().then(function (content) {
        imgur
          .uploadBase64(content.toString('base64'))
          .then((json) => {
            console.log(json.link)
            return File.create({
              userId: event.source.userId,
              image: json.link
            })
          })
          .catch((err) => {
            console.error(err.message)
          })
      })
      await event.reply("已新增至資料庫")
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

