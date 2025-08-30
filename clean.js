require('dotenv-flow').config()
const initMongo = require('./config/mongo')
const fs = require('fs')
const modelsPath = `./app/models`
const { removeExtensionFromFile } = require('./app/middleware/utils')

initMongo()

// Loop models path and loads every file as a model except index file
const models = fs.readdirSync(modelsPath).filter((file) => {
  return removeExtensionFromFile(file) !== 'index'
})

const deleteModelFromDB = async (model) => {
  try {
    model = require(`./app/models/${model}`)
    const row = await model.deleteMany({})
    return row
  } catch (error) {
    throw error
  }
}

const clean = async () => {
  try {
    const promiseArray = models.map(
      async (model) => await deleteModelFromDB(model)
    )
    await Promise.all(promiseArray)
    console.log('Cleanup complete!')
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
}

clean()
