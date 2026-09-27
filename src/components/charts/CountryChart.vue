<script setup lang="ts">
import { computed } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  countries: Record<string, number>
}>()

const chartData = computed(() => ({
  labels: Object.keys(props.countries),
  datasets: [
    {
      data: Object.values(props.countries),
      backgroundColor: [
        '#6366f1',
        '#8b5cf6',
        '#ec4899',
        '#f43f5e',
        '#f97316',
        '#eab308',
        '#22c55e',
        '#14b8a6',
        '#06b6d4',
        '#3b82f6',
      ],
      borderColor: '#18181b',
      borderWidth: 2,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: '#d4d4d8',
      },
    },
  },
}
</script>

<template>
  <div class="chart">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart {
  position: relative;
  width: 100%;
  height: 400px;
}
</style>
