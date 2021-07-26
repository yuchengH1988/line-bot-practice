const linebot = require('linebot')
const express = require('express')

const bot = linebot({
  channelId: '1656250411',
  channelSecret: 'c6a39550ffc6cd803d6e08b73a50cd00',
  channelAccessToken: 'yxUMOHb0ATretvjfrQbuk7oc2WPFRECIDs7RsRP4D2C3b8iI5kRxExwgcTPTTfb0gs4S4mjVUsoEYQJt2Tl+YrLz4LDfJWYzy0NUoY1Dj8Klh4oQ1cCrlvWoZxKDJTgiwURVUtL69I0BsSgP5Pk+WgdB04t89/1O/w1cDnyilFU='
})

bot.on('message', function (event) {
  console.log(event)
})

const app = express()
const linebotParser = bot.parser()
app.post('/', linebotParser)

const server = app.listen(process.env.PORT || 3000, function () {
  const port = server.address().port
  console.log(`Example app listening at http://localhost:${port}`)
})

