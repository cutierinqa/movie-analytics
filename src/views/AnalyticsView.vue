<script setup lang="ts">
import { onMounted, ref } from 'vue'
import GenreChart from '@/components/charts/GenreChart.vue'
import CountryChart from '@/components/charts/CountryChart.vue'
import YearChart from '@/components/charts/YearChart.vue'
import { getMovies } from '@/services/poiskkino/poiskKinoApi'
import type { Movie } from '@/types/movie'
import { useRouter } from 'vue-router'

const movies = ref<Movie[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const genres = ref<Record<string, number>>({})
const countries = ref<Record<string, number>>({})
const years = ref<Record<string, number>>({})

const router = useRouter()
const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}

const loadAnalytics = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await getMovies(1, 100)

    movies.value = response.docs

    const genreCounts: Record<string, number> = {}

    for (const movie of movies.value) {
      for (const genre of movie.genres ?? []) {
        if (!genre?.name) {
          continue
        }

        genreCounts[genre.name] = (genreCounts[genre.name] ?? 0) + 1
      }
    }

    genres.value = genreCounts
    const countryCounts: Record<string, number> = {}

    for (const movie of movies.value) {
      for (const country of movie.countries ?? []) {
        if (!country?.name) {
          continue
        }

        countryCounts[country.name] = (countryCounts[country.name] ?? 0) + 1
      }
    }

    countries.value = countryCounts

    const yearCounts: Record<string, number> = {}

    for (const movie of movies.value) {
      if (!movie.year) {
        continue
      }

      const year = String(movie.year)

      yearCounts[year] = (yearCounts[year] ?? 0) + 1
    }

    years.value = yearCounts
  } catch (err) {
    console.error(err)
    error.value = 'Не удалось загрузить данные для аналитики'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAnalytics()
})
</script>

<template>
  <main class="analytics">
    <div class="navigation">
      <button class="back-button" @click="goBack">← Назад</button>

      <button class="home-button" @click="goHome">На главную</button>
    </div>
    <h1>Киноаналитика</h1>

    <p class="subtitle">Исследуйте данные о фильмах и их распределение по жанрам.</p>

    <section class="stats">
      <div class="stat-card">
        <span class="stat-label">Фильмов</span>
        <strong class="stat-value">
          {{ movies.length }}
        </strong>
      </div>

      <div class="stat-card">
        <span class="stat-label">Жанров</span>
        <strong class="stat-value">
          {{ Object.keys(genres).length }}
        </strong>
      </div>

      <div class="stat-card">
        <span class="stat-label">Стран</span>
        <strong class="stat-value">
          {{
            new Set(
              movies.flatMap((movie) => (movie.countries ?? []).map((country) => country.name)),
            ).size
          }}
        </strong>
      </div>
    </section>

    <section class="chart-section">
      <h2>Фильмы по жанрам</h2>

      <div class="chart-wrapper">
        <div v-if="loading" class="chart-status">Загрузка аналитики...</div>

        <div v-else-if="error" class="chart-status error">
          {{ error }}
        </div>

        <GenreChart v-else :genres="genres" />
      </div>
    </section>
    <section class="chart-section">
      <h2>Фильмы по странам</h2>

      <div class="chart-wrapper">
        <div v-if="loading" class="chart-status">Загрузка аналитики...</div>

        <div v-else-if="error" class="chart-status error">
          {{ error }}
        </div>

        <CountryChart v-else :countries="countries" />
      </div>
      <section class="chart-section">
        <h2>Количество фильмов по годам</h2>

        <div class="chart-wrapper">
          <div v-if="loading" class="chart-status">Загрузка аналитики...</div>

          <div v-else-if="error" class="chart-status error">
            {{ error }}
          </div>

          <YearChart v-else :years="years" />
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.analytics {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 48px 64px;
  background: #09090b;
  color: white;
}

.analytics h1 {
  margin: 0 0 8px;
  font-size: 42px;
}

.navigation {
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
}

.back-button,
.home-button {
  padding: 10px 16px;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  background: #18181b;
  color: white;
  cursor: pointer;
}

.back-button:hover,
.home-button:hover {
  background: #27272a;
}

.subtitle {
  margin: 0 0 40px;
  color: #a1a1aa;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  padding: 24px;
  border: 1px solid #27272a;
  border-radius: 12px;
  background: #18181b;
}

.stat-label {
  display: block;
  margin-bottom: 12px;
  color: #a1a1aa;
  font-size: 14px;
}

.stat-value {
  font-size: 30px;
}

.chart-section {
  padding: 24px;
  border: 1px solid #27272a;
  border-radius: 12px;
  background: #18181b;
}

.chart-section h2 {
  margin: 0 0 24px;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 350px;
  border-radius: 8px;
  background: #09090b;
  color: #71717a;
}

.chart-wrapper {
  width: 100%;
}

@media (max-width: 768px) {
  .analytics {
    padding: 32px 20px;
  }

  .stats {
    grid-template-columns: 1fr;
  }
}

.chart-status {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #a1a1aa;
}

.chart-status.error {
  color: #f87171;
}
</style>
