import logger from "../../config/winston";
import { CronJob } from "cron"
import { delay,updateFilmsCatalogue } from "../helpers/helpers";

const updateFilmsSchedule = new CronJob(
    '*/10 * * * *',
        updateFilmsCatalogue
    ,
    null,
    true,
    'America/Sao_Paulo'
);

export {
    updateFilmsSchedule
}