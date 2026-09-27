export interface Movie {
  id: number
  name: string
  alternativeName: string | null
  year: number | null
  description?: string | null
  shortDescription?: string | null
  movieLength: number | null

  isSeries: boolean
  type: string

  poster: {
    url: string | null
    previewUrl: string | null
  } | null

  genres?: {
    id: number
    name: string
    slug: string
  }[]

  countries?: {
    id: number
    name: string
  }[]

  rating?: {
    imdb: number | null
    kp: number | null
  }

  votes?: {
    imdb: number | null
    kp: number | null
  }
}

export interface MovieResponse {
  docs: Movie[]
  total: number
  limit: number
  page: number
  pages: number
}
