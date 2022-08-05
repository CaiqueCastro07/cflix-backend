import logger from "../../config/winston";
import { CronJob } from "cron"
import { delay,updateFilmsCatalogue } from "../helpers/helpers";

const updateFilmsSchedule = new CronJob(
    '*/10 * * * *',
        function(){
            logger.info("Atualizando o catalogo de filmes a cada 10 minutos...")
            updateFilmsCatalogue()
        }
    ,
    null,
    true,
    'America/Sao_Paulo'
);

export {
    updateFilmsSchedule,
    updateFilmsCatalogue
}