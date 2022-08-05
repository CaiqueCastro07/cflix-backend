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

const updateFilmInDatabase = async (newTask: string, user: string): Promise<boolean> => {

  if (!newTask || typeof newTask != 'string') return false
  if (!user || typeof user != 'string') return false

  newTask = newTask?.trim()
  user = user?.trim()

  try {

    const dbResult = await filmsRepository.updateMany()

    if (!dbResult?.modifiedCount) {
      //@ts-ignore
      logger.error(`##createTaskInDatabase(${newTask}, ${user}) Erro ao criar tarefa - message: ${dbResult?.message || dbResult?.errmsg || dbResult?.error} - code: ${dbResult?.code}`)
      return false
    }

    return true

  } catch (err) {
    logger.error(`##createTaskInDatabase(${newTask}, ${user}) Erro ao criar tarefa - message: ${err?.message || err?.errmsg} - code: ${err?.code}`)
    return false
  }
}

const createFilmInDatabase = async (newFilm:any): Promise<boolean> => {

  try {

    const dbResult = await filmsRepository.create(newFilm)

    const db = ""

    return true

  } catch (err) {
    logger.error(`##createFilmsInDatabase(${JSON.stringify(newFilm)}) Erro ao criar filme - message: ${err?.message || err?.errmsg} - code: ${err?.code}`)
    return false
  }
}

export {
  getFilmsInDatabase,
  createFilmInDatabase,
  updateFilmInDatabase
}