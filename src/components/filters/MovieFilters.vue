<script setup lang="ts">
const props = defineProps<{
  genre: string
  year: number | null
  country: string
}>()

const emit = defineEmits<{
  'update:genre': [value: string]
  'update:year': [value: number | null]
  'update:country': [value: string]
  reset: []
}>()

const genres = [
  'драма',
  'комедия',
  'триллер',
  'боевик',
  'фантастика',
  'ужасы',
  'мелодрама',
  'детектив',
  'приключения',
  'семейный',
]

const countries = [
  'США',
  'Россия',
  'Великобритания',
  'Франция',
  'Германия',
  'Италия',
  'Испания',
  'Япония',
  'Корея Южная',
  'Китай',
  'Канада',
  'Австралия',
]
const years = Array.from({ length: 30 }, (_, index) => new Date().getFullYear() - index)
</script>

<template>
  <div class="filters">
    <div class="filter">
      <label for="genre">Жанр</label>

      <select
        id="genre"
        :value="props.genre"
        @change="emit('update:genre', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">Все жанры</option>

        <option v-for="genreOption in genres" :key="genreOption" :value="genreOption">
          {{ genreOption }}
        </option>
      </select>
    </div>

    <div class="filter">
      <label for="year">Год</label>

      <select
        id="year"
        :value="props.year ?? ''"
        @change="
          emit(
            'update:year',
            ($event.target as HTMLSelectElement).value
              ? Number(($event.target as HTMLSelectElement).value)
              : null,
          )
        "
      >
        <option value="">Все годы</option>

        <option v-for="yearOption in years" :key="yearOption" :value="yearOption">
          {{ yearOption }}
        </option>
      </select>
    </div>

    <div class="filter">
      <label for="country">Страна</label>
      <select
        id="country"
        :value="props.country"
        @change="emit('update:country', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">Все страны</option>

        <option v-for="countryOption in countries" :key="countryOption" :value="countryOption">
          {{ countryOption }}
        </option>
      </select>
    </div>

    <button class="reset-button" type="button" @click="emit('reset')">Сбросить</button>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 32px;
}

.filter {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter label {
  color: #a1a1aa;
  font-size: 13px;
}

.filter select {
  min-width: 180px;
  padding: 11px 14px;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  background: #18181b;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.reset-button {
  padding: 11px 18px;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  background: transparent;
  color: #d4d4d8;
  cursor: pointer;
}

.reset-button:hover {
  background: #27272a;
}
</style>
