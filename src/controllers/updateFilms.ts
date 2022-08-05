import { Request, Response } from 'express'
import { response } from '../helpers/helpers'
//@ts-ignore
import { delay } from '../helpers/helpers'
import { } from '../dto/objects/ObjectTypes'
import { getFilmsInDatabase } from '../database/databaseServices'
import logger from "../../config/winston"
import { updateFilmsCatalogue } from '../helpers/helpers'

const updateFilms = async (req: Request, res: Response): Promise<Response> => {

    const updateCatalogueResult = await updateFilmsCatalogue()

    if(!updateCatalogueResult) return response(400, "Erro ao atualizar o catalogo de filmes.", true, {}, res)

    return response(200, "Catalogo atualizado com sucesso.", false, {}, res);
}

export default updateFilms