<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MovieCard from '@/components/movie/MovieCard.vue'
import { getPopularMovies } from '@/services/poiskkino/poiskKinoApi'
import type { Movie } from '@/types/movie'

const router = useRouter()

const movies = ref<Movie[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const goHome = () => {
  router.push('/')
}

const loadMovies = async () => {
  try {
    loading.value = true
    error.value = null

    movies.value = await getPopularMovies(6)
  } catch (err) {
    console.error(err)
    error.value = 'Не удалось загрузить популярные фильмы'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMovies()
})
</script>

<template>
  <main class="popular-page">
    <div class="page-header">
      <div>
        <h1>Самые популярные фильмы</h1>
        <p>Фильмы с наибольшим количеством оценок</p>
      </div>

      <button class="back-button" @click="goHome">← На главную</button>
    </div>

    <div v-if="loading" class="status">Загрузка популярных фильмов...</div>

    <div v-else-if="error" class="status error">
      {{ error }}
    </div>

    <section v-else class="movies">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :id="movie.id"
        :title="movie.name"
        :year="movie.year"
        :rating-imdb="movie.rating?.imdb ?? null"
        :rating-kp="movie.rating?.kp ?? null"
        :poster="movie.poster?.url ?? null"
        :genres="(movie.genres ?? []).map((genre) => genre.name)"
        :countries="(movie.countries ?? []).map((country) => country.name)"
      />
    </section>
  </main>
</template>

<style scoped>
.popular-page {
  min-height: 100vh;
  padding: 24px 32px;
  background: #09090b;
  color: white;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.page-header h1 {
  margin: 0 0 6px;
  font-size: 28px;
  font-weight: 700;
}

.page-header p {
  margin: 0;
  color: #a1a1aa;
  font-size: 14px;
}

.back-button {
  padding: 10px 16px;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  background: #18181b;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.back-button:hover {
  background: #27272a;
}

.movies {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 16px;
}

.status {
  padding: 40px 0;
  color: #a1a1aa;
  text-align: center;
}

.status.error {
  color: #f87171;
}

@media (max-width: 1200px) {
  .movies {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 800px) {
  .popular-page {
    padding: 20px;
  }

  .movies {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .popular-page {
    padding: 20px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .movies {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
