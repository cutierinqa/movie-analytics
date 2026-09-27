<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const props = defineProps<{
  years: Record<string, number>
}>()

const sortedYears = computed(() => Object.keys(props.years).sort((a, b) => Number(a) - Number(b)))

const chartData = computed(() => ({
  labels: sortedYears.value,
  datasets: [
    {
      label: 'Количество фильмов',
      data: sortedYears.value.map((year) => props.years[year] ?? 0),

      borderColor: '#8b5cf6',
      backgroundColor: '#8b5cf6',

      pointBackgroundColor: '#ec4899',
      pointBorderColor: '#ffffff',

      tension: 0.3,
      fill: false,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      labels: {
        color: '#d4d4d8',
      },
    },
  },

  scales: {
    x: {
      ticks: {
        color: '#a1a1aa',
      },
      grid: {
        color: '#27272a',
      },
    },

    y: {
      beginAtZero: true,
      ticks: {
        color: '#a1a1aa',
        precision: 0,
      },
      grid: {
        color: '#27272a',
      },
    },
  },
}
</script>

<template>
  <div class="chart">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart {
  position: relative;
  width: 100%;
  height: 400px;
}
</style>
