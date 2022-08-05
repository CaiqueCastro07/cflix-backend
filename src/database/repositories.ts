import mongoose from "mongoose"

const filmsEntity = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: [true, "Titulo do filme não informado"],
        unique: true
    },
    original_title: {
        type: String,
        required: [true, "Titulo Original do filme não informado"],
        unique: true

    },
    original_title_romanised: {
        type: String,
        required: [true, "Titulo Original Romanizado do filme não informado"],
        unique: true

    },
    image: {
        type: String,
        required: [true, "URL da imagem filme não informada"],
        unique: true

    },
    movie_banner: {
        type: String,
        required: [true, "URL do banner do filme não informado"],
        unique: true

    },
    description: {
        type: String,
        required: [true, "Descrição do filme não informada"],
        unique: true

    },
    director: {
        type: String,
        required: [true, "Diretor do filme não informado"],
        unique: false

    },
    producer: {
        type: String,
        required: [true, "Produtor do filme não informado"],
        unique: false

    },
    release_date: {
        type: String,
        required: [true, "Data de lançamento do filme não informada"],
        unique: false

    },
    running_time: {
        type: String,
        required: [true, "Tempo de duração do filme não informado"],
        unique: false

    },
    rt_score: {
        type: String,
        required: [true, "Nota do filme não informado"],
        unique: false

    },
    people: {
        type: [String],
        required: true,
        unique: false,
        default: []
    },
    species: {
        type: [String],
        required: true,
        unique: false,
        default: []
    },
    locations: {
        type: [String],
        required: true,
        unique: false,
        default: []
    },
    vehicles: {
        type: [String],
        required: true,
        unique: false,
        default: []
    },
    url: {
        type: String,
        required: [true,"URL do filme não informada."],
        unique: false,
    }
})

const filmsRepository = mongoose.model('films', filmsEntity)

export {
    filmsRepository
}




