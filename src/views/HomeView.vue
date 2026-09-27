<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MovieCard from '@/components/movie/MovieCard.vue'
import MovieSearch from '@/components/search/MovieSearch.vue'
import MovieFilters from '@/components/filters/MovieFilters.vue'
import { getMovies, searchMovies } from '@/services/poiskkino/poiskKinoApi'
import type { Movie } from '@/types/movie'

const router = useRouter()

const PAGE_SIZE = 21
const API_LIMIT = 21

const movies = ref<Movie[]>([])
const validMovies = ref<Movie[]>([])

const loading = ref(true)
const error = ref<string | null>(null)

const currentPage = ref(1)
const nextApiPage = ref(1)

const apiHasMore = ref(true)

const currentQuery = ref('')

const selectedGenre = ref('')
const selectedYear = ref<number | null>(null)
const selectedCountry = ref('')

const goAnalytics = () => {
  router.push('/analytics')
}
const goPopular = () => {
  router.push('/popular')
}

const isValidMovie = (movie: Movie) => {
  return Boolean(movie.name?.trim() && movie.year && movie.poster?.url)
}

const loadUntilCount = async (requiredCount: number) => {
  while (validMovies.value.length < requiredCount && apiHasMore.value) {
    const response = currentQuery.value
      ? await searchMovies(currentQuery.value, nextApiPage.value, API_LIMIT)
      : await getMovies(nextApiPage.value, API_LIMIT, {
          genre: selectedGenre.value || undefined,
          year: selectedYear.value || undefined,
          country: selectedCountry.value || undefined,
        })

    const newValidMovies = response.docs.filter(isValidMovie)

    validMovies.value.push(...newValidMovies)

    if (nextApiPage.value >= response.pages || response.docs.length === 0) {
      apiHasMore.value = false
    } else {
      nextApiPage.value++
    }
  }
}

const showPage = (page: number) => {
  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  movies.value = validMovies.value.slice(start, end)
  currentPage.value = page
}

const loadMovies = async () => {
  try {
    loading.value = true
    error.value = null

    validMovies.value = []
    movies.value = []

    currentPage.value = 1
    nextApiPage.value = 1
    apiHasMore.value = true

    await loadUntilCount(PAGE_SIZE)

    showPage(1)
  } catch (err) {
    console.error(err)
    error.value = 'Не удалось загрузить фильмы'
  } finally {
    loading.value = false
  }
}

const handleSearch = async (query: string) => {
  currentQuery.value = query

  await loadMovies()
}

const changePage = async (page: number) => {
  if (page < 1) {
    return
  }

  try {
    loading.value = true
    error.value = null

    const requiredCount = page * PAGE_SIZE

    await loadUntilCount(requiredCount)

    const start = (page - 1) * PAGE_SIZE

    if (start >= validMovies.value.length) {
      return
    }

    showPage(page)
  } catch (err) {
    console.error('Ошибка загрузки страницы:', err)
    error.value = 'Не удалось загрузить страницу'
  } finally {
    loading.value = false
  }
}

const applyFilters = async () => {
  currentQuery.value = ''
  await loadMovies()
}

const resetFilters = async () => {
  selectedGenre.value = ''
  selectedYear.value = null
  selectedCountry.value = ''
  currentQuery.value = ''

  await loadMovies()
}

const hasNextPage = computed(() => {
  return validMovies.value.length > currentPage.value * PAGE_SIZE || apiHasMore.value
})

onMounted(() => {
  loadMovies()
})
</script>

<template>
  <main class="home">
    <div class="page-header">
      <h1>Киноаналитика</h1>

      <div class="header-actions">
        <button class="popular-button" @click="goPopular">🔥 Популярные</button>

        <button class="analytics-button" @click="goAnalytics">📊 Аналитика</button>
      </div>
    </div>

    <p class="subtitle">Твой путь погружения в киноиндустрию.</p>

    <MovieSearch @search="handleSearch" />
    <MovieFilters
      v-model:genre="selectedGenre"
      v-model:year="selectedYear"
      v-model:country="selectedCountry"
      @update:genre="applyFilters"
      @update:year="applyFilters"
      @update:country="applyFilters"
      @reset="resetFilters"
    />

    <div v-if="loading" class="status">Загрузка фильмов...</div>

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
    <div v-if="!loading && (currentPage > 1 || hasNextPage)" class="pagination">
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">← Назад</button>

      <span>Страница {{ currentPage }}</span>

      <button :disabled="!hasNextPage" @click="changePage(currentPage + 1)">Вперёд →</button>
    </div>
  </main>
</template>
<style scoped>
.home {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 48px 64px;
  background: #09090b;
  color: white;
}

.home h1 {
  margin: 0 0 8px;
  font-size: 42px;
  line-height: 1.1;
}

.subtitle {
  margin: 0 0 40px;
  color: #a1a1aa;
  font-size: 16px;
}

.movies {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 28px;
  width: 100%;
}

.status {
  padding: 40px;
  text-align: center;
  color: #a1a1aa;
}

.error {
  color: #f87171;
}

@media (max-width: 768px) {
  .home {
    padding: 32px 20px;
  }

  .home h1 {
    font-size: 32px;
  }

  .movies {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 48px;
  padding-bottom: 40px;
}

.pagination button {
  padding: 10px 18px;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  background: #18181b;
  color: white;
  cursor: pointer;
}

.pagination button:hover:not(:disabled) {
  background: #27272a;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.pagination span {
  color: #a1a1aa;
  font-size: 14px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.analytics-button {
  padding: 10px 16px;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  background: #18181b;
  color: white;
  cursor: pointer;
  transition: background 0.2s ease;
}
.popular-button {
  padding: 10px 16px;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  background: #18181b;
  color: white;
  cursor: pointer;
  transition: background 0.2s ease;
}
.popular-button:hover {
  background: #27272a;
}

.analytics-button:hover {
  background: #27272a;
}

.popular-section {
  margin: 36px 0 44px;
}

.section-header {
  margin-bottom: 18px;
}

.section-header h2 {
  margin: 0 0 6px;
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
}

.section-header p {
  margin: 0;
  color: #a1a1aa;
  font-size: 14px;
}
</style>
