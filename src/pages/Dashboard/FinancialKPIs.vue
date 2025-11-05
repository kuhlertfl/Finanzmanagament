<template>
  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    <!-- Monatlicher Cashflow -->
    <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <feather-icon name="trending-up" class="w-8 h-8 text-blue-500" />
        </div>
        <div class="ml-4">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t`Monatlicher Cashflow` }}</div>
          <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ formatCurrency(monthlyCashflow) }}
          </div>
          <div class="text-sm" :class="cashflowTrend >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ cashflowTrend >= 0 ? '+' : '' }}{{ cashflowTrend }}% vs letzter Monat
          </div>
        </div>
      </div>
    </div>

    <!-- Einnahmen (aktueller Monat) -->
    <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <feather-icon name="dollar-sign" class="w-8 h-8 text-green-500" />
        </div>
        <div class="ml-4">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t`Einnahmen (Monat)` }}</div>
          <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ formatCurrency(monthlyIncome) }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ incomeCount }} {{ incomeCount === 1 ? 'Einnahme' : 'Einnahmen' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Ausgaben (aktueller Monat) -->
    <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <feather-icon name="credit-card" class="w-8 h-8 text-red-500" />
        </div>
        <div class="ml-4">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t`Ausgaben (Monat)` }}</div>
          <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ formatCurrency(monthlyExpenses) }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ expenseCount }} {{ expenseCount === 1 ? 'Ausgabe' : 'Ausgaben' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Gewinn/Verlust -->
    <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <feather-icon
            :name="profitLoss >= 0 ? 'trending-up' : 'trending-down'"
            :class="profitLoss >= 0 ? 'w-8 h-8 text-emerald-500' : 'w-8 h-8 text-red-500'"
          />
        </div>
        <div class="ml-4">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t`Gewinn/Verlust` }}</div>
          <div
            class="text-2xl font-bold"
            :class="profitLoss >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'"
          >
            {{ formatCurrency(profitLoss) }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ profitLoss >= 0 ? 'Gewinn' : 'Verlust' }} diesen Monat
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { fyo } from 'src/initFyo';
import { t } from 'fyo';
import featherIcon from 'src/components/FeatherIcon.vue';

export default defineComponent({
  name: 'FinancialKPIs',
  components: {
    featherIcon,
  },
  data() {
    return {
      monthlyIncome: 0,
      monthlyExpenses: 0,
      incomeCount: 0,
      expenseCount: 0,
      lastMonthIncome: 0,
      lastMonthExpenses: 0,
    };
  },
  computed: {
    monthlyCashflow(): number {
      return this.monthlyIncome - this.monthlyExpenses;
    },
    profitLoss(): number {
      return this.monthlyCashflow;
    },
    cashflowTrend(): number {
      const lastMonthCashflow = this.lastMonthIncome - this.lastMonthExpenses;
      if (lastMonthCashflow === 0) return 0;
      return Math.round(((this.monthlyCashflow - lastMonthCashflow) / Math.abs(lastMonthCashflow)) * 100);
    },
  },
  async mounted() {
    await this.loadFinancialData();
  },
  methods: {
    formatCurrency(value: number): string {
      return fyo.format(value, 'Currency') || '0,00 €';
    },
    async loadFinancialData() {
      try {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Aktueller Monat - Beginn und Ende
        const monthStart = new Date(currentYear, currentMonth, 1);
        const monthEnd = new Date(currentYear, currentMonth + 1, 0);

        // Letzter Monat - Beginn und Ende
        const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
        const lastMonthEnd = new Date(currentYear, currentMonth, 0);

        await this.loadIncomeData(monthStart, monthEnd, lastMonthStart, lastMonthEnd);
        await this.loadExpenseData(monthStart, monthEnd, lastMonthStart, lastMonthEnd);
      } catch (error) {
        console.error('Error loading financial data:', error);
      }
    },

    async loadIncomeData(monthStart: Date, monthEnd: Date, lastMonthStart: Date, lastMonthEnd: Date) {
      try {
        // OneTimeIncome für aktuellen Monat
        const oneTimeIncomes = await fyo.db.getAll('OneTimeIncome', {
          filters: {
            date: ['>=', monthStart.toISOString().split('T')[0], '<=', monthEnd.toISOString().split('T')[0]]
          },
          fields: ['amount']
        });

        // PaymentVerificationRecord für aktuellen Monat
        const verificationRecords = await fyo.db.getAll('PaymentVerificationRecord', {
          filters: {
            createdAt: ['>=', monthStart.toISOString(), '<=', monthEnd.toISOString()]
          },
          fields: ['totalAmount']
        });

        // Wiederkehrende Einnahmen für aktuellen Monat
        const recurringIncomes = await fyo.db.getAll('SubscriptionCustomer', {
          filters: { contractStatus: 'Aktiv' },
          fields: ['monthlyFee']
        });

        const monthlyRecurringIncome = recurringIncomes.reduce((sum: number, customer: any) => sum + (customer.monthlyFee || 0), 0);

        this.monthlyIncome = oneTimeIncomes.reduce((sum: number, income: any) => sum + (income.amount || 0), 0) +
                           verificationRecords.reduce((sum: number, record: any) => sum + (record.totalAmount || 0), 0) +
                           monthlyRecurringIncome;

        this.incomeCount = oneTimeIncomes.length + verificationRecords.length + recurringIncomes.length;

        // Letzter Monat für Trend
        const lastMonthOneTime = await fyo.db.getAll('OneTimeIncome', {
          filters: {
            date: ['>=', lastMonthStart.toISOString().split('T')[0], '<=', lastMonthEnd.toISOString().split('T')[0]]
          },
          fields: ['amount']
        });

        const lastMonthVerification = await fyo.db.getAll('PaymentVerificationRecord', {
          filters: {
            createdAt: ['>=', lastMonthStart.toISOString(), '<=', lastMonthEnd.toISOString()]
          },
          fields: ['totalAmount']
        });

        this.lastMonthIncome = lastMonthOneTime.reduce((sum: number, income: any) => sum + (income.amount || 0), 0) +
                              lastMonthVerification.reduce((sum: number, record: any) => sum + (record.totalAmount || 0), 0) +
                              monthlyRecurringIncome; // Wiederkehrende Einnahmen bleiben gleich

      } catch (error) {
        console.error('Error loading income data:', error);
        this.monthlyIncome = 0;
        this.incomeCount = 0;
        this.lastMonthIncome = 0;
      }
    },

    async loadExpenseData(monthStart: Date, monthEnd: Date, lastMonthStart: Date, lastMonthEnd: Date) {
      try {
        // OneTimeExpense für aktuellen Monat
        const oneTimeExpenses = await fyo.db.getAll('OneTimeExpense', {
          filters: {
            date: ['>=', monthStart.toISOString().split('T')[0], '<=', monthEnd.toISOString().split('T')[0]]
          },
          fields: ['amount']
        });

        // RecurringExpense - alle aktiven für Monatssumme
        const recurringExpenses = await fyo.db.getAll('RecurringExpense', {
          filters: {
            isActive: 'Ja'
          },
          fields: ['amount', 'frequency']
        });

        // Berechne wiederkehrende Ausgaben für diesen Monat
        let monthlyRecurringTotal = 0;
        recurringExpenses.forEach((expense: any) => {
          if (expense.frequency === 'Monatlich') {
            monthlyRecurringTotal += expense.amount || 0;
          } else if (expense.frequency === 'Jährlich') {
            monthlyRecurringTotal += (expense.amount || 0) / 12;
          } else if (expense.frequency === 'Wöchentlich') {
            monthlyRecurringTotal += (expense.amount || 0) * 4.33; // ~4.33 Wochen pro Monat
          }
        });

        this.monthlyExpenses = oneTimeExpenses.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0) + monthlyRecurringTotal;
        this.expenseCount = oneTimeExpenses.length + recurringExpenses.length;

        // Letzter Monat
        const lastMonthOneTime = await fyo.db.getAll('OneTimeExpense', {
          filters: {
            date: ['>=', lastMonthStart.toISOString().split('T')[0], '<=', lastMonthEnd.toISOString().split('T')[0]]
          },
          fields: ['amount']
        });

        this.lastMonthExpenses = lastMonthOneTime.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0) + monthlyRecurringTotal;

      } catch (error) {
        console.error('Error loading expense data:', error);
        this.monthlyExpenses = 0;
        this.expenseCount = 0;
        this.lastMonthExpenses = 0;
      }
    },
  },
});
</script>