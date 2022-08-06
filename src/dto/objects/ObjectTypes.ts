interface ResponseData {
    error?: string
}

interface Film {
    original_title: String,
    id: String,
    title: String,
    original_title_romanised: String,
    director: String,
    producer: String,
    release_date: String,
    running_time: String,
    description: String,
    image: String
}

export {
    ResponseData,
    Film
}