<template>
  <div class="currency-plot" role="img" :aria-label="chartDescription">
    <div class="chart">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    <p class="sr-only">{{ chartDescription }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
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

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
});

const chartData = computed(() => {
  return {
    labels: props.data.map( i => new Date(i.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        data: props.data.map( i => i.close),
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
});

const chartDescription = computed(() => {
  if (!props.data || props.data.length === 0) {
    return 'No chart data available';
  }
  const firstDate = new Date(props.data[0].timestamp).toLocaleDateString();
  const lastDate = new Date(props.data[props.data.length - 1].timestamp).toLocaleDateString();
  const minValue = Math.min(...props.data.map(i => i.close)).toFixed(5);
  const maxValue = Math.max(...props.data.map(i => i.close)).toFixed(5);
  return `Line chart showing currency exchange rates from ${firstDate} to ${lastDate}. Values range from ${minValue} to ${maxValue}.`;
});
</script>

<style scoped>
.currency-plot {
  background-color: var(--color-background);;
  display: flex;
  flex-direction: column;
  height: 350px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.chart {
  width: 100%;
  flex: 0 0 70%;
  padding: 0.5rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>