import { Request, Response } from 'express'
import { response } from '../helpers/helpers'
//@ts-ignore
import { delay } from '../helpers/helpers'
import { } from '../dto/objects/ObjectTypes'
import { getFilmsInDatabase } from '../database/databaseServices'
import logger from "../../config/winston"
import { updateFilmsCatalogue } from '../Schedules/Schdedules'

let paginator:any[] = []

const getFilms = async (req: Request, res: Response): Promise<Response> => {

    let { page, limit }: any = req?.query || {};

    if (!page || !limit) logger.error("Queries page ou limit não configuradas na request do frontend, verificar e corrigir")

    page = +page
    limit = +limit

    if (!page || page < 1) page = 0;
    if (!limit || limit < 9) limit = 9;

    const updatePaginator = async (tries: number = 0): Promise<boolean> => {

        if (tries > 3 || tries < 0) {
            logger.error("Erro ao recuperar os filmes no banco de dados, limite de tentativas atingido.")
            return false
        }

        tries && delay(2000)

        const getFilmsResult = await getFilmsInDatabase()
        if (!Array.isArray(getFilmsResult)) return updatePaginator(tries + 1);

        paginator = getFilmsResult
        return true
    }

    !paginator?.length && await updatePaginator()

    if (!paginator?.length || !Array.isArray(paginator)) return response(500, "Falha ao recuperar os filmes. Tente novamente mais tarde ou contate o suporte.", true, {}, res);

    const maximum = paginator.length

    if(page > maximum) page = maximum;
    if(limit > maximum) limit = maximum;

    const filmsToSend = paginator?.slice(page,limit)

    return response(200, "Filmes encontrados.", false, filmsToSend, res);
}

export default getFilms