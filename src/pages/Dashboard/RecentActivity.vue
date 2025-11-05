<template>
  <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t`Letzte Aktivitäten` }}</h3>
      <div class="flex space-x-2">
        <button
          @click="filterType = 'all'"
          :class="filterButtonClass('all')"
          class="px-3 py-1 text-sm rounded"
        >
          Alle
        </button>
        <button
          @click="filterType = 'income'"
          :class="filterButtonClass('income')"
          class="px-3 py-1 text-sm rounded"
        >
          Einnahmen
        </button>
        <button
          @click="filterType = 'expenses'"
          :class="filterButtonClass('expenses')"
          class="px-3 py-1 text-sm rounded"
        >
          Ausgaben
        </button>
        <button
          @click="filterType = 'customers'"
          :class="filterButtonClass('customers')"
          class="px-3 py-1 text-sm rounded"
        >
          Kunden
        </button>
      </div>
    </div>

    <div v-if="filteredActivities.length === 0" class="text-center py-8">
      <feather-icon name="activity" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
      <p class="text-gray-500 dark:text-gray-400">Keine Aktivitäten gefunden</p>
    </div>

    <div v-else class="space-y-3 max-h-80 overflow-y-auto">
      <div
        v-for="activity in filteredActivities"
        :key="activity.id"
        class="flex items-center p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        @click="handleActivityClick(activity)"
      >
        <!-- Icon -->
        <div class="flex-shrink-0 mr-3">
          <div
            :class="activity.iconClass"
            class="w-8 h-8 rounded-full flex items-center justify-center"
          >
            <feather-icon :name="activity.icon" class="w-4 h-4 text-white" />
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {{ activity.title }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 ml-2">
              {{ formatDate(activity.date) }}
            </p>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
            {{ activity.description }}
          </p>
          <div v-if="activity.amount" class="text-sm font-medium mt-1" :class="activity.amountClass">
            {{ activity.amountText }}{{ formatCurrency(activity.amount) }}
          </div>
        </div>

        <!-- Action arrow -->
        <div class="flex-shrink-0 ml-2">
          <feather-icon name="chevron-right" class="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">{{ t`Schnellaktionen` }}</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          @click="quickAction('addExpense')"
          class="flex items-center p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
          <feather-icon name="minus-circle" class="w-4 h-4 mr-2" />
          Neue Ausgabe
        </button>
        <button
          @click="quickAction('addIncome')"
          class="flex items-center p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <feather-icon name="plus-circle" class="w-4 h-4 mr-2" />
          Neue Einnahme
        </button>
        <button
          @click="quickAction('addCustomer')"
          class="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <feather-icon name="user-plus" class="w-4 h-4 mr-2" />
          Neuer Kunde
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { fyo } from 'src/initFyo';
import { t } from 'fyo';
import { routeTo } from 'src/utils/ui';
import featherIcon from 'src/components/FeatherIcon.vue';

interface Activity {
  id: string;
  type: 'income' | 'expenses' | 'customers';
  title: string;
  description: string;
  date: string;
  amount?: number;
  amountText?: string;
  amountClass?: string;
  icon: string;
  iconClass: string;
  route?: string;
}

export default defineComponent({
  name: 'RecentActivity',
  components: {
    featherIcon,
  },
  data() {
    return {
      activities: [] as Activity[],
      filterType: 'all' as 'all' | 'income' | 'expenses' | 'customers',
    };
  },
  computed: {
    filteredActivities(): Activity[] {
      if (this.filterType === 'all') {
        return this.activities;
      }
      return this.activities.filter(activity => activity.type === this.filterType);
    },
  },
  async mounted() {
    await this.loadRecentActivities();
  },
  async activated() {
    await this.loadRecentActivities();
  },
  methods: {
    formatCurrency(value: number): string {
      return fyo.format(value, 'Currency') || '0,00 €';
    },
    formatDate(dateString: string): string {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return 'Heute';
      } else if (diffDays === 1) {
        return 'Gestern';
      } else if (diffDays < 7) {
        return `vor ${diffDays} Tagen`;
      } else {
        return date.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit'
        });
      }
    },
    filterButtonClass(type: string): string {
      const isActive = this.filterType === type;
      return isActive
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600';
    },
    handleActivityClick(activity: Activity) {
      if (activity.route) {
        routeTo(activity.route);
      }
    },
    quickAction(action: string) {
      switch (action) {
        case 'addExpense':
          routeTo('/expenses/one-time');
          break;
        case 'addIncome':
          routeTo('/income/one-time');
          break;
        case 'addCustomer':
          routeTo('/customer/new');
          break;
      }
    },
    async loadRecentActivities() {
      this.activities = [];

      await Promise.all([
        this.loadIncomeActivities(),
        this.loadExpenseActivities(),
        this.loadCustomerActivities()
      ]);

      // Sortiere nach Datum (neueste zuerst)
      this.activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Limit auf 20 neueste Aktivitäten
      this.activities = this.activities.slice(0, 20);
    },

    async loadIncomeActivities() {
      try {
        // OneTimeIncome
        const oneTimeIncomes = await fyo.db.getAll('OneTimeIncome', {
          fields: ['name', 'amount', 'description', 'date'],
          limit: 10,
          orderBy: 'date'
        });

        oneTimeIncomes.forEach((income: any) => {
          this.activities.push({
            id: `income-${income.name}`,
            type: 'income',
            title: 'Einmalige Einnahme',
            description: income.description || income.name,
            date: income.date,
            amount: income.amount,
            amountText: '+',
            amountClass: 'text-green-600 dark:text-green-400',
            icon: 'plus-circle',
            iconClass: 'bg-green-500',
            route: '/income/one-time'
          });
        });

        // PaymentVerificationRecord entfernt - sind nur Überprüfungen, keine echten Aktivitäten

      } catch (error) {
        console.error('Error loading income activities:', error);
      }
    },

    async loadExpenseActivities() {
      try {
        // OneTimeExpense
        const oneTimeExpenses = await fyo.db.getAll('OneTimeExpense', {
          fields: ['name', 'amount', 'description', 'date'],
          limit: 10,
          orderBy: 'date'
        });

        oneTimeExpenses.forEach((expense: any) => {
          this.activities.push({
            id: `expense-${expense.name}`,
            type: 'expenses',
            title: 'Einmalige Ausgabe',
            description: expense.description || expense.name,
            date: expense.date,
            amount: expense.amount,
            amountText: '-',
            amountClass: 'text-red-600 dark:text-red-400',
            icon: 'minus-circle',
            iconClass: 'bg-red-500',
            route: '/expenses/one-time'
          });
        });

        // RecurringExpense
        const recurringExpenses = await fyo.db.getAll('RecurringExpense', {
          fields: ['name', 'amount', 'description', 'frequency', 'nextPaymentDate'],
          limit: 5,
          orderBy: 'name'
        });

        recurringExpenses.forEach((expense: any) => {
          this.activities.push({
            id: `recurring-${expense.name}`,
            type: 'expenses',
            title: 'Wiederkehrende Zahlung',
            description: `${expense.description || expense.name} (${expense.frequency})`,
            date: expense.nextPaymentDate || new Date().toISOString().split('T')[0], // Use nextPaymentDate or today as fallback
            amount: expense.amount,
            amountText: '-',
            amountClass: 'text-red-600 dark:text-red-400',
            icon: 'repeat',
            iconClass: 'bg-blue-500',
            route: '/expenses/recurring'
          });
        });

      } catch (error) {
        console.error('Error loading expense activities:', error);
      }
    },

    async loadCustomerActivities() {
      try {
        const customers = await fyo.db.getAll('SubscriptionCustomer', {
          fields: ['name', 'email', 'createdAt'],
          limit: 10,
          orderBy: 'createdAt'
        });

        customers.forEach((customer: any) => {
          this.activities.push({
            id: `customer-${customer.name}`,
            type: 'customers',
            title: 'Neuer Kunde',
            description: `${customer.name} (${customer.email || 'Keine E-Mail'})`,
            date: customer.createdAt || new Date().toISOString().split('T')[0], // Use createdAt or today as fallback
            icon: 'user-plus',
            iconClass: 'bg-purple-500',
            route: `/customer/${customer.name}`
          });
        });

      } catch (error) {
        console.error('Error loading customer activities:', error);
      }
    },
  },
});
</script>