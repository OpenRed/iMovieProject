const mongoose = require('mongoose')
// const db = 'mongodb://localhost/douban-trainer' //数据库连接
const db = 'mongodb://douban:douban123456@120.78.177.86/douban_trainer' //数据库连接
const glob = require('glob')
const { resolve } = require('path')

mongoose.Promise = global.Promise

exports.initSchemas = () => {
  //glob方法同步引入schema目录下的所有js文件，__dirname是相对于当前目录
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.connect = () => {
  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }

    mongoose.connect(db)

    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes<5) {
        mongoose.connect(db)
      } else {
        console.log('数据库挂了，快去修吧')
      }
    })

    mongoose.connection.on('error', err => {
      reject(err)
      console.log(err)
    })

    mongoose.connection.on('open', () => {
      // const Dog = mongoose.model('Dog', { name: String })
      // const dogA = new Dog({ name: 'Alpha' })
      //
      // dogA.save().then(() => {
      //   console.log('Woo')
      // })

      // resolve()
      console.log('MongoDB connected successful!')
    })
  })
}
