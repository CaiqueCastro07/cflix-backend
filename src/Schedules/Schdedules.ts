import logger from "../../config/winston";
import { CronJob } from "cron"
import StudioGhibliApi from "../ExternalApis/StudioGhibliApi";
import { deleteFilmInDatabase, getFilmsInDatabase } from "../database/databaseServices";
import { createFilmInDatabase, updateFilmInDatabase } from "../database/databaseServices";
import { delay, objectsAreEqual } from "../helpers/helpers";

const updateFilmsSchedule = new CronJob(
    '*/10 * * * *',
    function () {
        //updateFilmsCatalogue()	
    },
    null,
    true,
    'America/Sao_Paulo'
);


const updateFilmsCatalogue = async () => {

    const studioApi = new StudioGhibliApi()

    const sourceFilmsArr = await studioApi.getNewFilmsApi()

    if (!Array.isArray(sourceFilmsArr)) {
        logger.error("Erro no agendamento de atualização dos filmes.")
        return
    }

    const databaseFilmsArr = await getFilmsInDatabase()

    if (!Array.isArray(databaseFilmsArr)) {
        logger.error("Erro no agendamento de atualização dos filmes.")
        return
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


}


export {
    updateFilmsSchedule,
    updateFilmsCatalogue
}