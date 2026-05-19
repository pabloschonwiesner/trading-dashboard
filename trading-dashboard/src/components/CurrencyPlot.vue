<template>
  <div class="currency-plot">
    <Line :data="chartData" :options="chartOptions" />
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

const chartData = {
  labels: ['Oct 2', 'Oct 6', 'Oct 10', 'Oct 14', 'Oct 18', 'Oct 22', 'Oct 26', 'Oct 30'],
  datasets: [
    {
      label: 'AED - EUR',
      data: [0.232, 0.231, 0.229, 0.235, 0.236, 0.230, 0.234, 0.235],

      // línea azul
      borderColor: '#6d8df7',

      // área sombreada debajo de la línea
      backgroundColor: 'rgba(109, 141, 247, 0.3)',
      fill: true,

      // grosor de la línea
      borderWidth: 2,

      // curva suave
      tension: 0.1,

      // ocultar los puntos
      pointRadius: 0,

      // mostrar punto solo al hacer hover
      pointHoverRadius: 4,

      // evitar línea escalonada
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
        color: '#6b7280',
        maxRotation: 0
      },
      border: {
        display: false
      }
    },

    y: {
      position: 'right',
      grid: {
        color: '#eef2f7'
      },
      ticks: {
        color: '#6b7280',
        callback: value => Number(value).toFixed(5)
      },
      border: {
        display: false
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
  width: 100%;
  min-height: 250px;
}
</style>