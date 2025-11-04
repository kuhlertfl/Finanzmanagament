<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-900">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
            Name
          </th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
            Email
          </th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
            Telefon
          </th>
          <th
            v-if="type === 'correct'"
            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
          >
            Betrag
          </th>
          <th
            v-if="type === 'incorrect'"
            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
          >
            Soll-Betrag
          </th>
          <th
            v-if="type === 'incorrect'"
            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
          >
            Ist-Betrag
          </th>
          <th
            v-if="type === 'missing'"
            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
          >
            Betrag
          </th>
          <th
            v-if="type !== 'missing'"
            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
          >
            Aktion
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-875 divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-for="customer in customers" :key="customer.name">
          <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ customer.name }}
          </td>
          <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
            {{ customer.email || '-' }}
          </td>
          <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
            {{ customer.phone || '-' }}
          </td>
          <td
            v-if="type === 'correct'"
            class="px-4 py-3 text-sm text-green-600 dark:text-green-400 font-medium"
          >
            {{ formatCurrency(customer.paidAmount) }}
          </td>
          <td
            v-if="type === 'incorrect'"
            class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
          >
            {{ formatCurrency(customer.monthlyAmount) }}
          </td>
          <td
            v-if="type === 'incorrect'"
            class="px-4 py-3 text-sm text-red-600 dark:text-red-400 font-medium"
          >
            {{ formatCurrency(customer.paidAmount) }}
          </td>
          <td
            v-if="type === 'missing'"
            class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
          >
            {{ formatCurrency(customer.monthlyAmount) }}
          </td>
          <td
            v-if="type !== 'missing'"
            class="px-4 py-3 text-sm"
          >
            <button
              @click="showRawData(customer)"
              class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline cursor-pointer"
            >
              Details
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal for raw CSV data -->
    <div
      v-if="selectedCustomer && selectedRawData"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-hidden"
      @click="selectedCustomer = null; selectedRawData = null"
    >
      <div
        class="bg-white dark:bg-gray-875 rounded-lg shadow-xl w-full"
        style="max-width: 900px; max-height: 85vh; display: flex; flex-direction: column;"
        @click.stop
      >
        <!-- Header - fixed -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700" style="flex-shrink: 0;">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            CSV-Rohdaten für {{ selectedCustomer.name }}
          </h3>
          <button
            @click="selectedCustomer = null; selectedRawData = null"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content - scrollable -->
        <div class="p-6" style="flex: 1; overflow-y: auto; min-height: 0;">
          <div class="space-y-4">
            <div
              v-for="(value, key) in selectedRawData"
              :key="key"
              class="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0"
            >
              <div class="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">
                {{ key }}
              </div>
              <div class="text-base text-gray-900 dark:text-gray-100 break-all">
                {{ value || '-' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Footer - fixed -->
        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end" style="flex-shrink: 0;">
          <button
            @click="selectedCustomer = null; selectedRawData = null"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  customers: any[];
  type: 'correct' | 'incorrect' | 'missing';
  rawDataMap?: Map<string, any>;
  customerToCsvNameMap?: Map<string, string>;
}>();

const selectedCustomer = ref<any>(null);
const selectedRawData = ref<any>(null);

function formatCurrency(amount: number): string {
  if (amount == null || isNaN(amount)) {
    return '0,00 €';
  }
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' €';
}

function showRawData(customer: any) {
  selectedCustomer.value = customer;

  // Two-step lookup: DB name -> CSV name -> Raw data
  if (!props.customerToCsvNameMap || !props.rawDataMap) {
    alert('Keine Rohdaten verfügbar');
    selectedCustomer.value = null;
    return;
  }

  // Step 1: Get CSV name from DB customer name
  const csvName = props.customerToCsvNameMap.get(customer.name);
  if (!csvName) {
    alert('Keine CSV-Zuordnung für diesen Kunden gefunden');
    selectedCustomer.value = null;
    return;
  }

  // Step 2: Get raw data using CSV name
  const rawData = props.rawDataMap.get(csvName);
  if (!rawData) {
    alert('Keine Rohdaten für diesen Kunden gefunden');
    selectedCustomer.value = null;
    return;
  }

  selectedRawData.value = rawData;
}
</script>
