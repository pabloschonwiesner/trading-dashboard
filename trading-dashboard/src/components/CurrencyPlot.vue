<template>
  <div class="currency-plot">
    <div class="chart">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const getPrimaryColor = () => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--color-primary')
    .trim() || '#667EEA';
};

const primaryColor = getPrimaryColor();

const chartData = {
  labels: ['Oct 2', 'Oct 6', 'Oct 10', 'Oct 14', 'Oct 18', 'Oct 22', 'Oct 26', 'Oct 30'],
  datasets: [
    {
      data: [0.232, 0.231, 0.229, 0.235, 0.236, 0.230, 0.234, 0.235],
      borderColor: primaryColor,
      backgroundColor: `${primaryColor}20`,
      fill: true,
      borderWidth: 2,
      tension: 0.1,
      pointRadius: 0,
      pointHoverRadius: 4,
      stepped: false
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: context => Number(context.raw).toFixed(5)
      }
    }
  },

  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        maxRotation: 0
      },
      border: {
        display: false
      }
    },

    y: {
      position: 'right',
      ticks: {
        callback: value => Number(value).toFixed(5)
      },
      border: {
        display: false
      },
      grid: {
        color: '#eee'
      }
    }
  },

  interaction: {
    mode: 'index',
    intersect: false
  }
};
</script>

<style scoped>
.currency-plot {
  background-color: #FFF;
  display: flex;
  flex-direction: column;
  height: 350px;
}

.chart {
  width: 100%;
  flex: 0 0 70%;
  padding: 0.5rem;
}
</style>