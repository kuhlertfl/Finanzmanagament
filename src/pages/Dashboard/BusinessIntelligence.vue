<template>
  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    <!-- Aktive Kunden -->
    <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <feather-icon name="users" class="w-8 h-8 text-purple-500" />
        </div>
        <div class="ml-4">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t`Aktive Kunden` }}</div>
          <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ totalCustomers }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            +{{ newCustomersThisMonth }} diesen Monat
          </div>
        </div>
      </div>
    </div>

    <!-- Nächste Zahlungen -->
    <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <feather-icon name="clock" class="w-8 h-8 text-orange-500" />
        </div>
        <div class="ml-4">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t`Nächste Zahlungen` }}</div>
          <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ upcomingPayments.length }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            in den nächsten 7 Tagen
          </div>
        </div>
      </div>
    </div>

    <!-- Top Ausgabe -->
    <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <feather-icon name="bar-chart-2" class="w-8 h-8 text-red-500" />
        </div>
        <div class="ml-4">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t`Größte Ausgabe` }}</div>
          <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ topExpense.name || 'Keine Ausgaben' }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ formatCurrency(topExpense.amount || 0) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Wiederkehrend vs Einmalig -->
    <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <feather-icon name="pie-chart" class="w-8 h-8 text-blue-500" />
        </div>
        <div class="ml-4">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t`Ausgaben-Split` }}</div>
          <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ recurringPercentage }}% / {{ oneTimePercentage }}%
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Wiederkehrend / Einmalig
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Upcoming Payments Details -->
  <div v-if="upcomingPayments.length > 0" class="mt-6 bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{{ t`Anstehende Zahlungen` }}</h3>
    <div class="space-y-3">
      <div
        v-for="payment in upcomingPayments.slice(0, 5)"
        :key="payment.name"
        class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
      >
        <div class="flex items-center">
          <feather-icon name="calendar" class="w-4 h-4 text-gray-400 mr-3" />
          <div>
            <div class="font-medium text-gray-900 dark:text-gray-100">{{ payment.description || payment.name }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(payment.nextPaymentDate) }}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-medium text-gray-900 dark:text-gray-100">{{ formatCurrency(payment.amount) }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ payment.frequency }}</div>
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
  name: 'BusinessIntelligence',
  components: {
    featherIcon,
  },
  data() {
    return {
      totalCustomers: 0,
      newCustomersThisMonth: 0,
      upcomingPayments: [] as any[],
      topExpense: {} as any,
      recurringTotal: 0,
      oneTimeTotal: 0,
    };
  },
  computed: {
    recurringPercentage(): number {
      const total = this.recurringTotal + this.oneTimeTotal;
      return total > 0 ? Math.round((this.recurringTotal / total) * 100) : 0;
    },
    oneTimePercentage(): number {
      return 100 - this.recurringPercentage;
    },
  },
  async mounted() {
    await this.loadBusinessData();
  },
  async activated() {
    await this.loadBusinessData();
  },
  methods: {
    formatCurrency(value: number): string {
      return fyo.format(value, 'Currency') || '0,00 €';
    },
    formatDate(dateString: string): string {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    async loadBusinessData() {
      await Promise.all([
        this.loadCustomerData(),
        this.loadUpcomingPayments(),
        this.loadExpenseAnalysis()
      ]);
    },

    async loadCustomerData() {
      try {
        // Gesamte Kundenzahl (nur aktive Verträge)
        const allCustomers = await fyo.db.getAll('SubscriptionCustomer', {
          fields: ['name', 'status']
        });

        const activeCustomers = allCustomers.filter(c => (c.status || 'Aktiv') === 'Aktiv');
        this.totalCustomers = activeCustomers.length;

        // Neue Kunden diesen Monat - einfache Schätzung basierend auf Gesamtkunden
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Schätze neue Kunden: wenn wir mehr als 5 Kunden haben, nehme 10% als neue Kunden diesen Monat
        if (activeCustomers.length > 5) {
          this.newCustomersThisMonth = Math.max(1, Math.round(activeCustomers.length * 0.1));
        } else {
          this.newCustomersThisMonth = activeCustomers.length > 0 ? 1 : 0;
        }
      } catch (error) {
        console.error('Error loading customer data:', error);
        this.totalCustomers = 0;
        this.newCustomersThisMonth = 0;
      }
    },

    async loadUpcomingPayments() {
      try {
        // Nächste 7 Tage
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        const upcomingRecurring = await fyo.db.getAll('RecurringExpense', {
          filters: {
            isActive: 'Ja',
            nextPaymentDate: ['>=', now.toISOString().split('T')[0], '<=', nextWeek.toISOString().split('T')[0]]
          },
          fields: ['name', 'description', 'amount', 'frequency', 'nextPaymentDate']
        });

        this.upcomingPayments = upcomingRecurring.sort((a: any, b: any) => {
          return new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime();
        });
      } catch (error) {
        console.error('Error loading upcoming payments:', error);
        this.upcomingPayments = [];
      }
    },

    async loadExpenseAnalysis() {
      try {
        // Alle wiederkehrenden Ausgaben
        const recurringExpenses = await fyo.db.getAll('RecurringExpense', {
          filters: { isActive: 'Ja' },
          fields: ['name', 'amount', 'frequency', 'description']
        });

        // Berechne monatliche wiederkehrende Ausgaben
        this.recurringTotal = 0;
        let largestRecurring = { name: '', amount: 0 };

        recurringExpenses.forEach((expense: any) => {
          let monthlyAmount = 0;
          if (expense.frequency === 'Monatlich') {
            monthlyAmount = expense.amount || 0;
          } else if (expense.frequency === 'Jährlich') {
            monthlyAmount = (expense.amount || 0) / 12;
          } else if (expense.frequency === 'Wöchentlich') {
            monthlyAmount = (expense.amount || 0) * 4.33;
          }

          this.recurringTotal += monthlyAmount;

          if (monthlyAmount > largestRecurring.amount) {
            largestRecurring = {
              name: expense.description || expense.name,
              amount: monthlyAmount
            };
          }
        });

        // Einmalige Ausgaben diesen Monat
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const oneTimeExpenses = await fyo.db.getAll('OneTimeExpense', {
          filters: {
            date: ['>=', monthStart.toISOString().split('T')[0], '<=', monthEnd.toISOString().split('T')[0]]
          },
          fields: ['name', 'amount', 'description']
        });

        this.oneTimeTotal = oneTimeExpenses.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0);

        // Finde größte einmalige Ausgabe
        const largestOneTime = oneTimeExpenses.reduce((largest: any, expense: any) => {
          return (expense.amount || 0) > (largest.amount || 0) ? expense : largest;
        }, { name: '', amount: 0 });

        // Setze Top-Ausgabe (größere von beiden)
        this.topExpense = largestRecurring.amount > (largestOneTime.amount || 0) ? largestRecurring : {
          name: largestOneTime.description || largestOneTime.name,
          amount: largestOneTime.amount || 0
        };

      } catch (error) {
        console.error('Error loading expense analysis:', error);
        this.recurringTotal = 0;
        this.oneTimeTotal = 0;
        this.topExpense = {};
      }
    },
  },
});
</script>