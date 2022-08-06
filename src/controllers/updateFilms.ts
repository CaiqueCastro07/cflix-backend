import { Request, Response } from 'express'
import { response } from '../helpers/helpers'
//@ts-ignore
import { delay } from '../helpers/helpers'
import { } from '../dto/objects/ObjectTypes'
import logger from "../../config/winston"
import { updateFilmsCatalogue } from '../helpers/helpers'
import { CronJob } from 'cron'

let interval = false

const updateFilms = async (req: Request, res: Response): Promise<Response> => {

    if(interval) return response(200, "Catalogo atualizado com sucesso há pouco tempo.", false, {}, res);

    const updateCatalogueResult = await updateFilmsCatalogue()

    if(!updateCatalogueResult) return response(400, "Erro ao atualizar o catalogo de filmes.", true, {}, res)

    interval = true;

    return response(200, "Catalogo atualizado com sucesso.", false, {}, res);
}

const resetInterval = new CronJob(
    '*/14 * * * *',
        function(){
            logger.info("Permitindo um refresh manual do catalogo de filmes do banco de dados ")
            interval = false
        }
    ,
    null,
    true,
    'America/Sao_Paulo'
);

resetInterval.start()

export default updateFilms