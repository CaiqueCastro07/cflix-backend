import axios from 'axios';
import FormData from 'form-data';
import logger from '../../config/winston';
import dotenv from "dotenv";
dotenv.config()

class StudioGhibliApi {

    api: any
    accesstoken: string

    constructor() {
        //this.accesstoken = accesstoken
        //this.id = id
        if (!process?.env?.API1_URL) {
            logger.error("API1_URL não configurada não variável de ambiente, configure antes de continuar.")
            //@ts-ignore
            return false
          }

        this.api = axios.create({
            baseURL: process?.env?.API1_URL
        })
    }

    async getNewFilmsApi(): Promise<any[] | false> {

        try {

            const response = await this.api.get('films')

            if (response?.status != 200) {
                logger.error(`##getNewFilmsApi() - Error ${response?.message || response?.error || response?.data || response?.body}`)
                return false
            }

            if (!response?.data?.length) return [];

            return response?.data

        } catch (err) {
            logger.error(`##getNewFilmsApi() - Error ${err?.message || err?.code || err?.response || err?.body}`)
            return false
        }
    }   

}

export default StudioGhibliApi