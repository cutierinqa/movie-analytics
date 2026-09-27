import axios from 'axios'

const backendApi = axios.create({
  baseURL: 'http://127.0.0.1:8000',
})

export const generateMovieDescription = async (description: string): Promise<string> => {
  const response = await backendApi.post<{
    description: string
  }>('/api/ai/movie-description', {
    description,
  })

  return response.data.description
}
