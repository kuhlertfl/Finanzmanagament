<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex-shrink-0 p-4">
      <PageHeader :title="t`Ausgaben-Übersicht`" />
    </div>

    <div class="flex-1 overflow-y-auto p-4 pt-0">
      <div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <!-- Gesamtausgaben diesen Monat -->
        <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <feather-icon name="trending-down" class="w-8 h-8 text-red-500" />
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t`Diesen Monat` }}</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(monthlyTotal) }}</div>
            </div>
          </div>
        </div>

        <!-- Wiederkehrende Ausgaben -->
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

        <!-- Einmalige Ausgaben -->
        <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <feather-icon name="zap" class="w-8 h-8 text-green-500" />
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t`Einmalig` }}</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(oneTimeTotal) }}</div>
            </div>
          </div>
        </div>

        <!-- Anzahl Belege -->
        <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <feather-icon name="file-text" class="w-8 h-8 text-purple-500" />
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t`Belege` }}</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ totalDocuments }}</div>
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
                <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t`Wiederkehrende Zahlungen` }}</h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">{{ t`Mieten, Abos und regelmäßige Kosten verwalten` }}</p>
              </div>
              <Button
                type="primary"
                @click="$router.push('/expenses/recurring')"
              >
                {{ t`Verwalten` }}
              </Button>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t`Einmalige Ausgaben` }}</h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">{{ t`Einzelne Ausgaben und Belege erfassen` }}</p>
              </div>
              <Button
                type="primary"
                @click="$router.push('/expenses/one-time')"
              >
                {{ t`Verwalten` }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Expenses -->
      <div class="mt-8">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{{ t`Neueste Ausgaben` }}</h3>
        <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700">
          <div v-if="recentExpenses.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
            <feather-icon name="inbox" class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>{{ t`Noch keine Ausgaben erfasst` }}</p>
          </div>
          <div v-else>
            <div
              v-for="expense in recentExpenses"
              :key="expense.name"
              class="border-b border-gray-200 dark:border-gray-700 last:border-b-0 p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div
                    class="w-3 h-3 rounded-full mr-3"
                    :class="{
                      'bg-blue-500': expense.type === 'recurring',
                      'bg-green-500': expense.type === 'one-time'
                    }"
                  ></div>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-gray-100">{{ expense.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ expense.category }} • {{ formatDate(expense.date) }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-gray-900 dark:text-gray-100">{{ formatCurrency(expense.amount) }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ expense.type === 'recurring' ? t`Wiederkehrend` : t`Einmalig` }}
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
const totalDocuments = ref(0);
const recentExpenses = ref([]);

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

    // One-time expenses for current month
    const oneTimeExpenses = await fyo.db.getAll('OneTimeExpense', {
      fields: ['amount', 'date', 'name', 'category'],
      filters: {
        date: ['>=', firstDay.toISOString().split('T')[0], '<=', lastDay.toISOString().split('T')[0]]
      }
    });

    oneTimeTotal.value = oneTimeExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

    // Recurring expenses - calculate monthly amounts
    let recurringExpenses = [];
    try {
      // Load all recurring expenses (same way as RecurringExpensesList)
      const allRecurringExpenses = await fyo.db.getAll('RecurringExpense', {
        fields: ['name', 'amount', 'frequency', 'description', 'category', 'supplier', 'nextPaymentDate', 'isActive', 'invoiceDocument', 'notes'],
      });

      // Filter for active recurring expenses
      recurringExpenses = allRecurringExpenses.filter(exp => {
        const isActive = exp.isActive;

        // Accept active expenses - including string "true" which is what we actually get!
        return isActive === null || isActive === undefined || isActive === '' ||
               isActive === 'Ja' || isActive === 'ja' || isActive === 'YES' || isActive === 'yes' ||
               isActive === true || isActive === 1 || isActive === 'true';
      });
    } catch (error) {
      console.error('Error loading recurring expenses:', error);
      recurringExpenses = [];
    }

    // Ensure recurringExpenses is always an array
    if (!Array.isArray(recurringExpenses)) {
      recurringExpenses = [];
    }

    // Calculate monthly equivalent for recurring expenses
    if (recurringExpenses.length === 0) {
      recurringTotal.value = 0;
    } else {
      recurringTotal.value = recurringExpenses.reduce((sum, exp) => {
        if (!exp || typeof exp !== 'object') {
          return sum;
        }

        let monthlyAmount = 0;
        const amount = parseFloat(exp.amount) || 0;
        const frequency = exp.frequency || 'Monatlich';

        switch (frequency) {
          case 'Wöchentlich':
            monthlyAmount = amount * 4.33; // ~4.33 weeks per month
            break;
          case 'Monatlich':
            monthlyAmount = amount;
            break;
          case 'Jährlich':
            monthlyAmount = amount / 12;
            break;
          default:
            monthlyAmount = amount; // Default to monthly
        }

        return sum + monthlyAmount;
      }, 0);
    }

    // Ensure recurringTotal is a valid number
    if (isNaN(recurringTotal.value) || !isFinite(recurringTotal.value)) {
      recurringTotal.value = 0;
    }

    monthlyTotal.value = oneTimeTotal.value + recurringTotal.value;

    // Recent expenses (combining both types)
    const recentOneTime = oneTimeExpenses.slice(0, 5).map(exp => ({
      ...exp,
      type: 'one-time'
    }));

    const recentRecurring = recurringExpenses.slice(0, 3).map(exp => ({
      ...exp,
      name: exp.description || exp.name, // Use description if available, fallback to name
      type: 'recurring',
      date: new Date().toISOString().split('T')[0] // Use today as placeholder
    }));

    recentExpenses.value = [...recentOneTime, ...recentRecurring]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);

    totalDocuments.value = oneTimeExpenses.length + recurringExpenses.length;

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