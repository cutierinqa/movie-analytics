<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const openMovie = (id: number) => {
  router.push(`/movies/${id}`)
}

defineProps<{
  id: number
  title: string
  year: number | null
  ratingImdb: number | null
  ratingKp: number | null
  poster: string | null
  genres: string[]
  countries: string[]
}>()
</script>

<template>
  <article class="movie-card" @click="openMovie(id)">
    <div class="movie-poster">
      <img v-if="poster" :src="poster" :alt="title" />

      <div v-else class="no-poster">🎬</div>

      <div v-if="countries.length" class="country-badge">
        {{ countries.join(', ') }}
      </div>
    </div>

    <div class="movie-info">
      <h3>{{ title || 'Без названия' }}</h3>

      <div class="movie-meta">
        <span class="movie-year">
          {{ year ?? 'Год неизвестен' }}
        </span>

        <span v-if="ratingImdb !== null" class="movie-rating">
          ⭐ IMDb {{ ratingImdb.toFixed(1) }}
        </span>

        <span v-if="ratingKp !== null" class="movie-rating"> 🎬 КП {{ ratingKp.toFixed(1) }} </span>
      </div>

      <div v-if="genres.length" class="movie-genres">
        <span v-for="genre in genres.slice(0, 2)" :key="genre" class="genre">
          {{ genre }}
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.movie-card {
  overflow: hidden;
  border-radius: 12px;
  background: #18181b;
  color: white;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.movie-card:hover {
  transform: translateY(-4px);
}

.movie-poster {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  background: #27272a;
}

.country-badge {
  position: absolute;
  top: 10px;
  left: 10px;

  max-width: calc(100% - 20px);
  padding: 6px 9px;

  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;

  background: rgba(24, 24, 27, 0.82);
  backdrop-filter: blur(8px);

  color: #f4f4f5;
  font-size: 12px;
  font-weight: 500;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-poster {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 48px;
}

.movie-info {
  padding: 16px;
}

.movie-info h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.movie-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.genre {
  display: inline-block;
  padding: 5px 8px;
  border-radius: 6px;
  background: #27272a;
  color: #d4d4d8;
  font-size: 12px;
}

.movie-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.movie-year {
  color: #a1a1aa;
  font-size: 14px;
}

.movie-rating {
  color: #facc15;
  font-size: 13px;
  font-weight: 600;
}
</style>
