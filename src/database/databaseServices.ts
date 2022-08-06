import logger from '../../config/winston';
import { filmsRepository } from './repositories';
import { Film } from '../dto/objects/ObjectTypes';

const getFilmsInDatabase = async (): Promise<Film[] | false> => {

  try {
    const dbResult = await filmsRepository.find()
    //@ts-ignore
    return dbResult || []

  } catch (err) {
    logger.error(`##getFilmsInDatabase() Erro ao recuperar os filmes no banco de dados - message: ${err?.message || err?.errmsg} - code: ${err?.code}`)
    return false
  }
}

const updateFilmInDatabase = async (film: Film): Promise<boolean> => {

  try {

    const dbResult = await filmsRepository.findOneAndReplace({ id: film?.id }, film)

    return true

  } catch (err) {
    logger.error(`##updateFilmInDatabase(${film}) Erro ao modificar filme - message: ${err?.message || err?.errmsg} - code: ${err?.code}`)
    return false
  }
}

const createFilmInDatabase = async (newFilm: Film): Promise<boolean> => {

  try {

    const dbResult = await filmsRepository.create(newFilm)

    return true

  } catch (err) {
    logger.error(`##createFilmsInDatabase(${JSON.stringify(newFilm)}) Erro ao criar filme - message: ${err?.message || err?.errmsg} - code: ${err?.code}`)
    return false
  }
}

const deleteFilmInDatabase = async (newFilm: Film) => {

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