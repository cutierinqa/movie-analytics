<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  search: [query: string]
}>()

const query = ref('')

const handleSearch = () => {
  emit('search', query.value.trim())
}
</script>

<template>
  <form class="search" @submit.prevent="handleSearch">
    <input v-model="query" type="text" placeholder="Найти кино..." />

    <button type="submit">Поиск</button>
  </form>
</template>

<style scoped>
.search {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 700px;
  margin-bottom: 40px;
}

.search input {
  flex: 1;
  min-width: 0;
  padding: 14px 18px;
  border: 1px solid #3f3f46;
  border-radius: 10px;
  outline: none;
  background: #18181b;
  color: white;
  font-size: 16px;
}

.search input::placeholder {
  color: #71717a;
}

.search input:focus {
  border-color: #71717a;
}

.search button {
  padding: 14px 22px;
  border: none;
  border-radius: 10px;
  background: white;
  color: #09090b;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.search button:hover {
  background: #e4e4e7;
}
</style>
