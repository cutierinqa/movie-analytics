<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMovieById } from '@/services/poiskkino/poiskKinoApi'
import { generateMovieDescription } from '@/services/aiService'
import type { Movie } from '@/types/movie'

const route = useRoute()
const router = useRouter()

const movie = ref<Movie | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const showAiDescription = ref(false)
const loadAiDescription = async () => {
  if (aiDescription.value || aiLoading.value) {
    return
  }

  const originalDescription = movie.value?.shortDescription || movie.value?.description

  if (!originalDescription) {
    aiError.value = 'Для этого фильма нет описания'
    return
  }

  try {
    aiLoading.value = true
    aiError.value = null

    aiDescription.value = await generateMovieDescription(originalDescription)
  } catch (error) {
    console.error('AI description error:', error)
    aiError.value = 'Не удалось сгенерировать описание'
  } finally {
    aiLoading.value = false
  }
}
const handleAiMouseEnter = () => {
  showAiDescription.value = true
  loadAiDescription()
}
const aiDescription = ref<string | null>(null)
const aiLoading = ref(false)
const aiError = ref<string | null>(null)

const loadMovie = async () => {
  try {
    loading.value = true
    error.value = null

    const id = Number(route.params.id)

    movie.value = await getMovieById(id)
    console.log('FIELDS:', Object.keys(movie.value ?? {}))
    console.log('Фильм:', movie.value)
    console.log('Описание:', movie.value?.description)
  } catch (err) {
    console.error(err)
    error.value = 'Не удалось загрузить информацию о фильме'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}
const goHome = () => {
  router.push('/')
}

onMounted(() => {
  loadMovie()
})
</script>

<template>
  <main class="movie-details">
    <div class="navigation">
      <button class="back-button" @click="goBack">← Назад</button>

      <button class="home-button" @click="goHome">На главную</button>
    </div>

    <div v-if="loading" class="status">Загрузка...</div>

    <div v-else-if="error" class="status error">
      {{ error }}
    </div>

    <section v-else-if="movie" class="movie-content">
      <div class="poster-wrapper">
        <img
          v-if="movie.poster?.url"
          :src="movie.poster.url"
          :alt="movie.name || 'Постер фильма'"
        />

        <div v-else class="no-poster">🎬</div>
      </div>

      <div class="movie-info">
        <h1>{{ movie.name || 'Без названия' }}</h1>

        <p v-if="movie.alternativeName" class="alternative-name">
          {{ movie.alternativeName }}
        </p>

        <div class="meta">
          <span v-if="movie.year">
            {{ movie.year }}
          </span>

          <span v-if="movie.movieLength"> {{ movie.movieLength }} мин. </span>

          <span>
            {{ movie.isSeries ? 'Сериал' : 'Фильм' }}
          </span>
        </div>
        <div v-if="movie.rating?.imdb || movie.rating?.kp" class="ratings">
          <span v-if="movie.rating?.imdb" class="rating imdb-rating">
            ⭐ IMDb {{ movie.rating.imdb.toFixed(1) }}
          </span>

          <span v-if="movie.rating?.kp" class="rating kp-rating">
            🎬 КП {{ movie.rating.kp.toFixed(1) }}
          </span>
        </div>

        <div v-if="(movie.genres ?? []).length" class="genres">
          <span v-for="genre in movie.genres ?? []" :key="genre.id" class="genre">
            {{ genre.name }}
          </span>
        </div>

        <div v-if="(movie.countries ?? []).length" class="countries">
          <strong>Страны:</strong>
          {{ (movie.countries ?? []).map((country) => country.name).join(', ') }}
        </div>

        <div v-if="movie.shortDescription || movie.description" class="description">
          <div class="description-header">
            <h2>Описание</h2>

            <div
              class="ai-description-trigger"
              @mouseenter="handleAiMouseEnter"
              @mouseleave="showAiDescription = false"
            >
              ✨ AI-описание

              <Transition name="ai-fade">
                <div v-if="showAiDescription" class="ai-description-popup">
                  <div class="ai-description-title">✨ AI-описание</div>

                  <div v-if="aiLoading" class="ai-loading">AI анализирует фильм...</div>

                  <div v-else-if="aiError" class="ai-error">
                    {{ aiError }}
                  </div>

                  <p v-else-if="aiDescription">
                    {{ aiDescription }}
                  </p>

                  <p v-else class="ai-placeholder">Наведи, чтобы получить описание</p>
                </div>
              </Transition>
            </div>
          </div>

          <p>
            {{ movie.shortDescription || movie.description }}
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.movie-details {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 48px 64px;
  background: #09090b;
  color: white;
}
.navigation {
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
}

.back-button {
  margin-bottom: 40px;
  padding: 10px 16px;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  background: #18181b;
  color: white;
  cursor: pointer;
}

.back-button:hover {
  background: #27272a;
}

.movie-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 48px;
  max-width: 1100px;
  margin: 0 auto;
}

.poster-wrapper {
  width: 100%;
  overflow: hidden;
  border-radius: 14px;
  background: #18181b;
}

.poster-wrapper img {
  display: block;
  width: 100%;
  height: auto;
}

.no-poster {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 2 / 3;
  font-size: 64px;
}

.movie-info {
  padding-top: 20px;
}

.movie-info h1 {
  margin: 0 0 12px;
  font-size: 44px;
  line-height: 1.1;
}

.alternative-name {
  margin: 0 0 24px;
  color: #a1a1aa;
  font-size: 18px;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 10px;
  color: #d4d4d8;
}

.meta span {
  padding: 7px 10px;
  border-radius: 7px;
  background: #18181b;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.genre {
  padding: 7px 10px;
  border-radius: 7px;
  background: #27272a;
  color: #d4d4d8;
  font-size: 13px;
}

.countries {
  margin-bottom: 24px;
  color: #a1a1aa;
}

.countries strong {
  color: white;
}

.description {
  max-width: 700px;
  color: #d4d4d8;
  font-size: 17px;
  line-height: 1.7;
}

.status {
  padding: 60px;
  text-align: center;
  color: #a1a1aa;
}

.error {
  color: #f87171;
}

@media (max-width: 768px) {
  .movie-details {
    padding: 32px 20px;
  }

  .movie-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .poster-wrapper {
    max-width: 280px;
  }

  .movie-info h1 {
    font-size: 32px;
  }
}
.home-button {
  margin-bottom: 40px;
  padding: 10px 16px;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  background: #18181b;
  color: white;
  cursor: pointer;
}

.home-button:hover {
  background: #27272a;
}

.description {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #27272a;
}

.description h2 {
  margin: 0 0 12px;
  font-size: 24px;
}

.description p {
  margin: 0;
  max-width: 800px;
  color: #d4d4d8;
  font-size: 16px;
  line-height: 1.7;
}
.description-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  position: relative;
}

.ai-description-trigger {
  position: relative;
  padding: 8px 12px;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  background: #18181b;
  color: #d4d4d8;
  font-size: 13px;
  cursor: default;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.ai-description-trigger:hover {
  background: #27272a;
  border-color: #52525b;
}

.ai-description-popup {
  position: absolute;
  right: 0;
  top: calc(100% + 12px);
  z-index: 10;

  width: 320px;
  padding: 18px;

  border: 1px solid #3f3f46;
  border-radius: 12px;

  background: #18181b;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.ai-description-title {
  margin-bottom: 10px;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.ai-description-popup p {
  margin: 0;
  color: #a1a1aa;
  font-size: 14px;
  line-height: 1.6;
}

.ai-fade-enter-active,
.ai-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.ai-fade-enter-from,
.ai-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.ratings {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.rating {
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.imdb-rating {
  background: #27272a;
  color: #facc15;
}

.kp-rating {
  background: #27272a;
  color: #60a5fa;
}
</style>
