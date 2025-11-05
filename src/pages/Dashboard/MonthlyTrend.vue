<template>
  <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t`Monatstrend` }}</h3>
      <div class="flex items-center space-x-4">
        <!-- Chart Legend -->
        <div class="flex items-center space-x-4 text-sm">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
            <span class="text-gray-600 dark:text-gray-400">Einnahmen</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-red-500 rounded-sm mr-2"></div>
            <span class="text-gray-600 dark:text-gray-400">Ausgaben</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
            <span class="text-gray-600 dark:text-gray-400">Gewinn/Verlust</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="h-64 relative">
      <div v-if="loading" class="flex items-center justify-center h-full">
        <div class="text-gray-500 dark:text-gray-400">Lade Daten...</div>
      </div>

      <div v-else-if="chartData.length === 0" class="flex items-center justify-center h-full">
        <div class="text-center">
          <feather-icon name="bar-chart-2" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p class="text-gray-500 dark:text-gray-400">Keine Daten verfügbar</p>
        </div>
      </div>

      <div v-else class="h-full">
        <!-- SVG Chart -->
        <svg class="w-full h-full" viewBox="0 0 800 240">
          <!-- Grid lines -->
          <defs>
            <pattern id="grid" width="80" height="24" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 24" fill="none" stroke="#e5e7eb" stroke-width="1" opacity="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          <!-- Income line -->
          <polyline
            :points="incomeLinePoints"
            fill="none"
            stroke="#10b981"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- Expense line -->
          <polyline
            :points="expenseLinePoints"
            fill="none"
            stroke="#ef4444"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- Profit/Loss line -->
          <polyline
            :points="profitLinePoints"
            fill="none"
            stroke="#3b82f6"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- Data points -->
          <g v-for="(point, index) in chartData" :key="index">
            <!-- Income point -->
            <circle
              :cx="getXPosition(index)"
              :cy="getYPosition(point.income)"
              r="4"
              fill="#10b981"
              class="hover:r-6 cursor-pointer"
              @mouseover="showTooltip(index, 'income', $event)"
              @mouseout="hideTooltip"
            />

            <!-- Expense point -->
            <circle
              :cx="getXPosition(index)"
              :cy="getYPosition(point.expenses)"
              r="4"
              fill="#ef4444"
              class="hover:r-6 cursor-pointer"
              @mouseover="showTooltip(index, 'expenses', $event)"
              @mouseout="hideTooltip"
            />

            <!-- Profit point -->
            <circle
              :cx="getXPosition(index)"
              :cy="getYPosition(point.profit)"
              r="5"
              fill="#3b82f6"
              class="hover:r-7 cursor-pointer"
              @mouseover="showTooltip(index, 'profit', $event)"
              @mouseout="hideTooltip"
            />
          </g>

          <!-- X-axis labels -->
          <g v-for="(point, index) in chartData" :key="`label-${index}`">
            <text
              :x="getXPosition(index)"
              y="235"
              text-anchor="middle"
              class="text-xs fill-gray-500 dark:fill-gray-400"
            >
              {{ point.month }}
            </text>
          </g>
        </svg>

        <!-- Tooltip -->
        <div
          v-if="tooltip.show"
          :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
          class="absolute bg-gray-900 text-white text-xs rounded py-1 px-2 pointer-events-none z-10"
        >
          {{ tooltip.text }}
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">
          {{ formatCurrency(totalIncome) }}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Gesamt-Einnahmen</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-red-600 dark:text-red-400">
          {{ formatCurrency(totalExpenses) }}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Gesamt-Ausgaben</div>
      </div>
      <div class="text-center">
        <div
          class="text-2xl font-bold"
          :class="totalProfit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'"
        >
          {{ formatCurrency(totalProfit) }}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Gesamt-Gewinn</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { fyo } from 'src/initFyo';
import { t } from 'fyo';
import featherIcon from 'src/components/FeatherIcon.vue';

interface ChartDataPoint {
  month: string;
  income: number;
  expenses: number;
  profit: number;
}

export default defineComponent({
  name: 'MonthlyTrend',
  components: {
    featherIcon,
  },
  data() {
    return {
      chartData: [] as ChartDataPoint[],
      loading: true,
      tooltip: {
        show: false,
        x: 0,
        y: 0,
        text: ''
      },
      maxValue: 0,
      minValue: 0,
    };
  },
  computed: {
    totalIncome(): number {
      return this.chartData.reduce((sum, point) => sum + point.income, 0);
    },
    totalExpenses(): number {
      return this.chartData.reduce((sum, point) => sum + point.expenses, 0);
    },
    totalProfit(): number {
      return this.totalIncome - this.totalExpenses;
    },
    incomeLinePoints(): string {
      return this.chartData.map((point, index) =>
        `${this.getXPosition(index)},${this.getYPosition(point.income)}`
      ).join(' ');
    },
    expenseLinePoints(): string {
      return this.chartData.map((point, index) =>
        `${this.getXPosition(index)},${this.getYPosition(point.expenses)}`
      ).join(' ');
    },
    profitLinePoints(): string {
      return this.chartData.map((point, index) =>
        `${this.getXPosition(index)},${this.getYPosition(point.profit)}`
      ).join(' ');
    },
  },
  async mounted() {
    await this.loadTrendData();
  },
  methods: {
    formatCurrency(value: number): string {
      return fyo.format(value, 'Currency') || '0,00 €';
    },
    getXPosition(index: number): number {
      const chartWidth = 800;
      const padding = 60;
      const availableWidth = chartWidth - (padding * 2);
      const stepWidth = availableWidth / Math.max(1, this.chartData.length - 1);
      return padding + (index * stepWidth);
    },
    getYPosition(value: number): number {
      const chartHeight = 200;
      const padding = 20;
      const availableHeight = chartHeight - (padding * 2);
      const range = this.maxValue - this.minValue;

      if (range === 0) return chartHeight / 2;

      const normalizedValue = (value - this.minValue) / range;
      return chartHeight - padding - (normalizedValue * availableHeight);
    },
    showTooltip(index: number, type: string, event: MouseEvent) {
      const point = this.chartData[index];
      let value = 0;
      let label = '';

      switch (type) {
        case 'income':
          value = point.income;
          label = 'Einnahmen';
          break;
        case 'expenses':
          value = point.expenses;
          label = 'Ausgaben';
          break;
        case 'profit':
          value = point.profit;
          label = 'Gewinn/Verlust';
          break;
      }

      this.tooltip = {
        show: true,
        x: event.offsetX + 10,
        y: event.offsetY - 30,
        text: `${point.month}: ${label} ${this.formatCurrency(value)}`
      };
    },
    hideTooltip() {
      this.tooltip.show = false;
    },
    async loadTrendData() {
      this.loading = true;
      this.chartData = [];

      try {
        // Lade Daten für die letzten 6 Monate
        const months = this.getLast6Months();
        const monthlyData: ChartDataPoint[] = [];

        for (const month of months) {
          const income = await this.getMonthlyIncome(month.start, month.end);
          const expenses = await this.getMonthlyExpenses(month.start, month.end);

          monthlyData.push({
            month: month.label,
            income,
            expenses,
            profit: income - expenses
          });
        }

        this.chartData = monthlyData;

        // Berechne Min/Max für Chart-Skalierung
        const allValues = monthlyData.flatMap(point => [point.income, point.expenses, point.profit]);
        this.maxValue = Math.max(...allValues, 0);
        this.minValue = Math.min(...allValues, 0);

        // Füge etwas Padding hinzu
        const padding = (this.maxValue - this.minValue) * 0.1;
        this.maxValue += padding;
        this.minValue -= padding;

      } catch (error) {
        console.error('Error loading trend data:', error);
      } finally {
        this.loading = false;
      }
    },

    getLast6Months() {
      const months = [];
      const now = new Date();

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        months.push({
          start,
          end,
          label: date.toLocaleDateString('de-DE', { month: 'short', year: '2-digit' })
        });
      }

      return months;
    },

    async getMonthlyIncome(start: Date, end: Date): number {
      try {
        let total = 0;

        // OneTimeIncome
        const oneTimeIncomes = await fyo.db.getAll('OneTimeIncome', {
          filters: {
            date: ['>=', start.toISOString().split('T')[0], '<=', end.toISOString().split('T')[0]]
          },
          fields: ['amount']
        });

        total += oneTimeIncomes.reduce((sum: number, income: any) => sum + (income.amount || 0), 0);

        // PaymentVerificationRecord
        const verificationRecords = await fyo.db.getAll('PaymentVerificationRecord', {
          filters: {
            createdAt: ['>=', start.toISOString(), '<=', end.toISOString()]
          },
          fields: ['totalAmount']
        });

        total += verificationRecords.reduce((sum: number, record: any) => sum + (record.totalAmount || 0), 0);

        return total;
      } catch (error) {
        console.error('Error getting monthly income:', error);
        return 0;
      }
    },

    async getMonthlyExpenses(start: Date, end: Date): number {
      try {
        let total = 0;

        // OneTimeExpense
        const oneTimeExpenses = await fyo.db.getAll('OneTimeExpense', {
          filters: {
            date: ['>=', start.toISOString().split('T')[0], '<=', end.toISOString().split('T')[0]]
          },
          fields: ['amount']
        });

        total += oneTimeExpenses.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0);

        // RecurringExpense (für diesen Monat)
        const recurringExpenses = await fyo.db.getAll('RecurringExpense', {
          filters: { isActive: 'Ja' },
          fields: ['amount', 'frequency']
        });

        recurringExpenses.forEach((expense: any) => {
          if (expense.frequency === 'Monatlich') {
            total += expense.amount || 0;
          } else if (expense.frequency === 'Jährlich') {
            total += (expense.amount || 0) / 12;
          } else if (expense.frequency === 'Wöchentlich') {
            total += (expense.amount || 0) * 4.33;
          }
        });

        return total;
      } catch (error) {
        console.error('Error getting monthly expenses:', error);
        return 0;
      }
    },
  },
});
</script>