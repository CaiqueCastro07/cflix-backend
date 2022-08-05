import { ResponseType } from "../dto/returns/returnTypes"
import { Response } from 'express';
import logger from "../../config/winston";
import { findSourceMap } from "module";
import { isEqual } from "lodash"
import StudioGhibliApi from "../ExternalApis/StudioGhibliApi";
import { createFilmInDatabase, deleteFilmInDatabase, getFilmsInDatabase, updateFilmInDatabase } from "../database/databaseServices";

const response = (statusNumber: number = 0, msg: string = 'mensagem vazia', log: boolean = false, data: any = {}, res: Response): Response => {
    // Todas as responses de requests deverão ser enviadas através dessa função
    const stringBody = JSON.stringify(data)

    if (log) {
        if (statusNumber != 200) {
            logger.error(msg + ' ' + stringBody)
            data = { error: data }
        } else {
            logger.info(msg + ' ' + stringBody);
        }
    } else {
        if (statusNumber != 200) {
            data = { error: data }
        }
    }

    const resObject: ResponseType = { status: statusNumber, message: msg, error: statusNumber != 200 ? true : false, data: data };

    return res.status(statusNumber).json(resObject)
}

const delay = async (time = 1000) => new Promise((resolve) => setTimeout(resolve, time))

const reverseJoinDate = (date: string): String | false => {

    if (!date || typeof date != 'string') return false

    const checkFormat1 = date?.split('-')?.[2]?.length == 4;
    const checkFormat2 = date?.split('/')?.[2]?.length == 4;

    if (checkFormat1) {
        return date
    }

    if (checkFormat2) {
        return date?.split('/').join('-')
    }

    let newDate = date?.split("-")

    if (newDate?.length < 3) {

        newDate = date?.split("/")

        if (newDate?.length < 3) return false;

        return newDate?.reverse()?.join('-')
    }

    return newDate.reverse()?.join('-')

}

const decodePassword = (pass: any, r: string) => {

    //@ts-ignore
    r = (+r.split("")?.reverse()?.join("")) - 117
    pass = Object.values(pass).map((e: any) => e + r)
    pass = String.fromCharCode.apply(null, pass)
    return pass

}

const objectsAreEqual = (first: any, second: any):boolean => {

    const entries = Object.entries(first)

    const divergence = entries.find(([key, value]) => {

        const type = Array.isArray(second?.[key]) ? "array" : typeof second?.[key]

        if (!["string", "number", "boolean"].includes(type)) {

            const firstVal = value
            const secondVal = second?.[key]

            if (type == "array") {

                const secondValArr: any[] = []

                second?.[key].forEach((e: any) => {
                    secondValArr.push(e)
                })

                return !isEqual(firstVal,secondValArr) 
            }

            return !isEqual(firstVal, secondVal)
        }

        const match = second?.[key] === value

        return !match
    
    })

    return divergence ? false : true

}


const updateFilmsCatalogue = async ():Promise<boolean> => {

    const studioApi = new StudioGhibliApi()

    if(!studioApi){
        return false
    }

    const sourceFilmsArr = await studioApi.getNewFilmsApi()

    if (!Array.isArray(sourceFilmsArr)) {
        logger.error("Erro no agendamento de atualização dos filmes.")
        return false
    }

    const databaseFilmsArr = await getFilmsInDatabase()

    if (!Array.isArray(databaseFilmsArr)) {
        logger.error("Erro no agendamento de atualização dos filmes.")
        return false
    }

    const srcFilmsObj = new Map(sourceFilmsArr.map((e) => {
        if (!e?.id) {
            logger.error(`##updateFilmsCatalogue() - Id not found in sourceFilms object:${JSON.stringify(e)}`)
            return
        }
        return [e?.id, e];
    }))

    const dbFilmsObj = new Map(databaseFilmsArr.map((e) => {
        if (!e?.id) {
            logger.error(`##updateFilmsCatalogue() - Id not found in databaseFilms object:${JSON.stringify(e)}`)
            return
        }
        return [e?.id, e];
    }))

    const filmsToAdd = []
    const filmsToModify = []
    const filmsToDelete = []

    main: for (let i = 0; i < sourceFilmsArr?.length || i < databaseFilmsArr?.length; i++) {
        
        const currentSrc = sourceFilmsArr?.[i]
        const currentDb = databaseFilmsArr?.[i]

        const srcExistsInDb = dbFilmsObj.get(currentSrc?.id)
        const dbExistsInSrc = srcFilmsObj.get(currentDb?.id)

        !srcExistsInDb && currentSrc && filmsToAdd.push(currentSrc);
        !dbExistsInSrc && currentDb && filmsToDelete.push(currentDb);

        currentSrc && srcExistsInDb && !objectsAreEqual(currentSrc, srcExistsInDb) && filmsToModify.push(currentSrc)

    }

    const errors = []

    for (let i = 0; i < filmsToAdd?.length; i++) {

        i && delay(100)

        const filmAdded = await createFilmInDatabase(filmsToAdd?.[i])

        if (!filmAdded) {
            errors.push({ type: "Adding film", entity: filmsToAdd?.[i] })
            continue
        }

    }

    for (let i = 0; i < filmsToModify?.length; i++) {

        i && delay(100)

        const filmModified = await updateFilmInDatabase(filmsToModify?.[i])

        if (!filmModified) {
            errors.push({ type: "Modifying film", entity: filmsToModify?.[i] })
            continue
        }

    }

    for (let i = 0; i < filmsToDelete?.length; i++) {

        i && delay(100)

        const filmDeleted = await deleteFilmInDatabase(filmsToDelete?.[i])

        if (!filmDeleted) {
            errors.push({ type: "Deleting film", entity: filmsToDelete?.[i] })
            continue
        }
    }

    if(errors?.length) {
        logger.error("Houve um erro ao atualizar os items no banco de dados: "+JSON.stringify(errors))
        return false
    }

    return true

}

export {
    response,
    delay,
    reverseJoinDate,
    decodePassword,
    objectsAreEqual,
    updateFilmsCatalogue
}