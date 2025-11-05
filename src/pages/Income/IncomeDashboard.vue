<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex-shrink-0 p-4">
      <PageHeader :title="t`Einnahmen-Übersicht`" />
    </div>

    <div class="flex-1 overflow-y-auto p-4 pt-0">
      <div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <!-- Gesamteinnahmen diesen Monat -->
      <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <feather-icon name="trending-up" class="w-8 h-8 text-green-500" />
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t`Diesen Monat` }}</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(monthlyTotal) }}</div>
          </div>
        </div>
      </div>

      <!-- Wiederkehrende Einnahmen -->
      <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <feather-icon name="repeat" class="w-8 h-8 text-blue-500" />
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t`Wiederkehrend (monatlich)` }}</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(recurringTotal) }}</div>
          </div>
        </div>
      </div>

      <!-- Einmalige Einnahmen -->
      <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <feather-icon name="zap" class="w-8 h-8 text-purple-500" />
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t`Einmalig` }}</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(oneTimeTotal) }}</div>
          </div>
        </div>
      </div>

      <!-- Anzahl Kunden -->
      <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <feather-icon name="users" class="w-8 h-8 text-orange-500" />
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t`Aktive Kunden` }}</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ totalCustomers }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{{ t`Schnellzugriff` }}</h3>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t`Wiederkehrende Einnahmen` }}</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">{{ t`Abonnements und monatliche Kundenverträge verwalten` }}</p>
            </div>
            <Button
              type="primary"
              @click="$router.push('/income/recurring')"
            >
              {{ t`Verwalten` }}
            </Button>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t`Einmalige Einnahmen` }}</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">{{ t`Einzelne Zahlungen und Projekte erfassen` }}</p>
            </div>
            <Button
              type="primary"
              @click="$router.push('/income/one-time')"
            >
              {{ t`Verwalten` }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Income -->
    <div class="mt-8">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{{ t`Neueste Einnahmen` }}</h3>
      <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700">
        <div v-if="recentIncome.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
          <feather-icon name="inbox" class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p>{{ t`Noch keine Einnahmen erfasst` }}</p>
        </div>
        <div v-else>
          <div
            v-for="income in recentIncome"
            :key="income.name"
            class="border-b border-gray-200 dark:border-gray-700 last:border-b-0 p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div
                  class="w-3 h-3 rounded-full mr-3"
                  :class="{
                    'bg-blue-500': income.type === 'recurring',
                    'bg-purple-500': income.type === 'one-time'
                  }"
                ></div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-gray-100">{{ income.name }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ income.category }} • {{ formatDate(income.date) }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-semibold text-green-600 dark:text-green-400">{{ formatCurrency(income.amount) }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ income.type === 'recurring' ? t`Wiederkehrend` : t`Einmalig` }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, computed } from 'vue';
import { t } from 'fyo';
import { fyo } from 'src/initFyo';
import Button from 'src/components/Button.vue';
import PageHeader from 'src/components/PageHeader.vue';
import FeatherIcon from 'src/components/FeatherIcon.vue';

const monthlyTotal = ref(0);
const recurringTotal = ref(0);
const oneTimeTotal = ref(0);
const totalCustomers = ref(0);
const recentIncome = ref([]);

onMounted(async () => {
  await loadDashboardData();
});

onActivated(async () => {
  await loadDashboardData();
});

async function loadDashboardData() {
  try {
    // Load current month totals
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // One-time income for current month
    const oneTimeIncome = await fyo.db.getAll('OneTimeIncome', {
      fields: ['amount', 'date', 'name', 'category', 'description'],
      filters: {
        date: ['>=', firstDay.toISOString().split('T')[0], '<=', lastDay.toISOString().split('T')[0]]
      }
    });

    oneTimeTotal.value = oneTimeIncome.reduce((sum, income) => sum + (income.amount || 0), 0);

    // Recurring income (SubscriptionCustomer)
    let recurringCustomers = [];
    try {
      const allCustomers = await fyo.db.getAll('SubscriptionCustomer', {
        fields: ['name', 'monthlyAmount', 'status', 'contractStartDate', 'email'],
      });

      // Filter for active customers
      recurringCustomers = allCustomers.filter(customer => {
        const status = customer.status;
        return status === null || status === undefined || status === '' ||
               status === 'Aktiv' || status === 'aktiv' || status === 'ACTIVE' || status === 'active';
      });
    } catch (error) {
      console.error('Error loading recurring income:', error);
      recurringCustomers = [];
    }

    // Ensure recurringCustomers is always an array
    if (!Array.isArray(recurringCustomers)) {
      recurringCustomers = [];
    }

    // Calculate monthly recurring income
    if (recurringCustomers.length === 0) {
      recurringTotal.value = 0;
    } else {
      recurringTotal.value = recurringCustomers.reduce((sum, customer) => {
        if (!customer || typeof customer !== 'object') {
          return sum;
        }
        return sum + (parseFloat(customer.monthlyAmount) || 0);
      }, 0);
    }

    // Ensure recurringTotal is a valid number
    if (isNaN(recurringTotal.value) || !isFinite(recurringTotal.value)) {
      recurringTotal.value = 0;
    }

    monthlyTotal.value = oneTimeTotal.value + recurringTotal.value;
    totalCustomers.value = recurringCustomers.length;

    // Recent income (combining both types)
    const recentOneTime = oneTimeIncome.slice(0, 5).map(income => ({
      ...income,
      name: income.description || income.name,
      type: 'one-time',
      category: income.category || 'Sonstige'
    }));

    const recentRecurring = recurringCustomers.slice(0, 3).map(customer => ({
      ...customer,
      name: customer.name,
      amount: customer.monthlyAmount,
      type: 'recurring',
      date: new Date().toISOString().split('T')[0], // Use today as placeholder
      category: 'Wiederkehrend'
    }));

    recentIncome.value = [...recentOneTime, ...recentRecurring]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);

  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

function formatCurrency(amount) {
  const numericAmount = parseFloat(amount) || 0;
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(numericAmount);
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('de-DE');
}
</script>