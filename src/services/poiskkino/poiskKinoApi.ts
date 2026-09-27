import axios from 'axios'
import type { Movie, MovieResponse } from '@/types/movie'

const poiskKinoApi = axios.create({
  baseURL: 'https://api.poiskkino.dev/v1.4',
  headers: {
    'X-API-KEY': import.meta.env.VITE_POISK_KINO_API_KEY,
    'Content-Type': 'application/json',
  },
})

export interface MovieFilters {
  genre?: string
  year?: number
  country?: string
}

export const getMovies = async (
  page = 1,
  limit = 21,
  filters: MovieFilters = {},
): Promise<MovieResponse> => {
  const response = await poiskKinoApi.get<MovieResponse>('/movie', {
    params: {
      limit,
      page,
      ...(filters.genre && { 'genres.name': filters.genre }),
      ...(filters.year && { year: filters.year }),
      ...(filters.country && { 'countries.name': filters.country }),
    },
  })

  return response.data
}
export const getValidMovies = async (
  page = 1,
  limit = 21,
  filters: MovieFilters = {},
): Promise<MovieResponse> => {
  const validMovies: Movie[] = []
  let apiPage = page
  let totalPages = 1

  while (validMovies.length < limit && apiPage <= totalPages) {
    const response = await getMovies(apiPage, 20, filters)

    totalPages = response.pages

    const filteredMovies = response.docs.filter(
      (movie) => Boolean(movie.name) && Boolean(movie.year) && Boolean(movie.poster?.url),
    )

    validMovies.push(...filteredMovies)

    apiPage++
  }

  return {
    docs: validMovies.slice(0, limit),
    total: validMovies.length,
    limit,
    page,
    pages: totalPages,
  }
}

export const getPopularMovies = async (limit = 6): Promise<Movie[]> => {
  const response = await getMovies(1, 100)

  return response.docs
    .filter((movie) => Boolean(movie.name) && Boolean(movie.year) && Boolean(movie.poster?.url))
    .sort((a, b) => {
      const votesA = a.votes?.kp ?? 0
      const votesB = b.votes?.kp ?? 0

      return votesB - votesA
    })
    .slice(0, limit)
}

export const searchMovies = async (query: string, page = 1, limit = 20): Promise<MovieResponse> => {
  const response = await poiskKinoApi.get<MovieResponse>('/movie/search', {
    params: {
      query,
      limit,
      page,
    },
  })

  return response.data
}

export const getMovieById = async (id: number): Promise<Movie> => {
  const response = await poiskKinoApi.get<Movie>(`/movie/${id}`)

  console.log('API movie response:', response.data)

  return response.data
}
