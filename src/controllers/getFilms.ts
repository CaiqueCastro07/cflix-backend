import { Request, Response } from 'express'
import { response } from '../helpers/helpers'
//@ts-ignore
import { delay } from '../helpers/helpers'
import { } from '../dto/objects/ObjectTypes'
import { getFilmsInDatabase } from '../database/databaseServices'
import logger from "../../config/winston"
import { updateFilmsCatalogue } from '../Schedules/Schdedules'

const getFilms = async (req: Request, res: Response): Promise<Response> => {

    const { userid } = req?.headers || {};

    updateFilmsCatalogue()
//@ts-ignore
    return true
    if (!userid || typeof userid != 'string') return response(400, "Usuário não enviado.", true, {}, res);

    const films = await getFilmsInDatabase()

   // if (!tasks) return response(500, "Falha ao recuperar as tarefas. Contate o suporte", true, {}, res);

    //return response(200, "Tarefas enviadas com sucesso.", false, tasks, res);
}

export default getFilms