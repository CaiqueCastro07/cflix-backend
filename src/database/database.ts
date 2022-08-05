//@ts-nocheck
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
import logger from "../../config/winston"

const startMongo = async () => {

  if(!process?.env?.DB){
    logger.error("Mongo URL não localizada na variável de ambiente, por favor configure antes de iniciar.")
    return
  }

  await mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

}

const stopMongo = async () => {
  await mongoose.disconnect()
}

export {
  startMongo,
  stopMongo
}