import logger from '../../config/winston';
import { Task } from '../dto/objects/ObjectTypes';
import { filmsRepository } from './repositories';

const getFilmsInDatabase = async (): Promise<any[] | false> => {

  try {
    const dbResult = await filmsRepository.find()
    //@ts-ignore
    return dbResult || []

  } catch (err) {
    logger.error(`##getFilmsInDatabase() Erro ao recuperar os filmes no banco de dados - message: ${err?.message || err?.errmsg} - code: ${err?.code}`)
    return false
  }
}

const updateFilmInDatabase = async (film: any): Promise<boolean> => {

  try {

    const dbResult = await filmsRepository.findOneAndReplace({ id: film?.id }, film)

    return true

  } catch (err) {
    logger.error(`##updateFilmInDatabase(${film}) Erro ao modificar filme - message: ${err?.message || err?.errmsg} - code: ${err?.code}`)
    return false
  }
}

const createFilmInDatabase = async (newFilm: any): Promise<boolean> => {

  try {

    const dbResult = await filmsRepository.create(newFilm)

    return true

  } catch (err) {
    logger.error(`##createFilmsInDatabase(${JSON.stringify(newFilm)}) Erro ao criar filme - message: ${err?.message || err?.errmsg} - code: ${err?.code}`)
    return false
  }
}

const deleteFilmInDatabase = async (newFilm: any) => {

  try {

    const dbResult = await filmsRepository.findOneAndRemove({ id: newFilm?.id })

    return true

  } catch (err) {
    logger.error(`##createFilmsInDatabase(${JSON.stringify(newFilm)}) Erro ao criar filme - message: ${err?.message || err?.errmsg} - code: ${err?.code}`)
    return false
  }

}

export {
  getFilmsInDatabase,
  createFilmInDatabase,
  updateFilmInDatabase,
  deleteFilmInDatabase
}