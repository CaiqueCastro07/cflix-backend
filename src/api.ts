//@ts-ignore
import logger from "../config/winston"
import express from "express"
import cors from "cors"
//@ts-ignore
import * as config from "../config/environments.json"
import getFilms from "./controllers/getFilms"
import dotenv from "dotenv"
import moment from "moment"
import updateFilms from "./controllers/updateFilms"
dotenv.config()

const api = express();
const apiPort = config.default.default.port

let server: any;

const startServer = () => {

  if (!process?.env?.APIKEY) {
    logger.error("APIKEY não configurada não variável de ambiente, configure antes de continuar.")
    return
  }
  
  if (!process?.env?.API1_URL) {
    logger.error("API1_URL não configurada não variável de ambiente, configure antes de continuar.")
    return
  }

  api.use(express.json({ limit: '100mb' }))
  api.use(express.urlencoded({ extended: true, limit: '100mb' }))
  api.use(cors({ origin: true, credentials: false }));

  api.use((req, res, next) => {
    //@ts-ignore
    const { authorization }: string = req?.headers || {};

    const apikey = authorization?.replace("Bearer ", "")
    if (apikey != process?.env?.APIKEY) return res.status(401).json({ status: 401, message: "Not authorized." });

    next()

  })

  api.get("/cflix/", (req, res) => {
    const date = moment(new Date()).format("DD/MM/YYYY - hh:mm:ss")
    return res.status(200).json({ status: 200, online: true, integration: "CFlix", time: date || Date.now() })
  })
  
  api.get('/cflix/films', cors(), getFilms)  
  api.get('/cflix/refresh', cors(), updateFilms)

  try {
    server = api.listen(apiPort, () => logger.info(`Aplicação iniciada com sucesso. Porta:${apiPort}`))
  } catch (err) {
    logger.error("O servidor não pode ser iniciado devido a " + err)
    return
  }

}

const stopServer = () => {
  server.close((error: any) => {
    if (error) {
      throw error
    }
  })
}

export {
  startServer,
  stopServer, 
  api
}
