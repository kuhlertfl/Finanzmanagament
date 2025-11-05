<template>
  <div class="flex flex-col h-full overflow-hidden bg-white dark:bg-gray-875">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b dark:border-gray-800">
      <div>
        <h1 class="text-2xl font-semibold dark:text-gray-100">Kunden</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ customers.length }} {{ customers.length === 1 ? 'Kunde' : 'Kunden' }}
        </p>
      </div>
      <div class="flex gap-3">
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
        >
          <option value="all">Alle Status</option>
          <option value="Aktiv">Aktiv</option>
          <option value="Gefährdet">Gefährdet</option>
          <option value="Inaktiv">Inaktiv</option>
          <option value="Gekündigt">Gekündigt</option>
        </select>
        <button
          @click="createNew"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <feather-icon name="plus" class="w-4 h-4" />
          Neuer Kunde
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-800">
      <div class="bg-white dark:bg-gray-850 rounded-lg p-4 border dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Aktiv</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.active }}</p>
          </div>
          <div class="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-850 rounded-lg p-4 border dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Gefährdet</p>
            <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ stats.gefaehrdet }}</p>
          </div>
          <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-850 rounded-lg p-4 border dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Inaktiv</p>
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.inaktiv }}</p>
          </div>
          <div class="w-2 h-2 rounded-full bg-red-500"></div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-850 rounded-lg p-4 border dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Gekündigt</p>
            <p class="text-2xl font-bold text-gray-600 dark:text-gray-400">{{ stats.gekuendigt }}</p>
          </div>
          <div class="w-2 h-2 rounded-full bg-gray-500"></div>
        </div>
      </div>
    </div>

    <!-- Customer List -->
    <div class="flex-1 overflow-auto p-6">
      <div class="bg-white dark:bg-gray-850 rounded-lg border dark:border-gray-800 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Telefon
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Monatlicher Betrag
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Letzte Zahlung
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-875 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="customer in filteredCustomers"
              :key="customer.name"
              @click="openCustomer(customer.name)"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ customer.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-3 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(customer.status)"
                >
                  {{ customer.status || 'Aktiv' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ customer.email || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ customer.phone || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ customer.monthlyAmount?.toFixed(2) || '0.00' }} €
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(customer.lastPaymentDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <button
                    @click.stop="openCustomer(customer.name)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Details
                  </button>
                  <button
                    @click.stop="deleteCustomer(customer)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                    title="Kunde löschen"
                  >
                    <feather-icon name="trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredCustomers.length === 0" class="text-center py-12">
          <feather-icon name="users" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <p class="text-gray-600 dark:text-gray-400">
            {{ statusFilter === 'all' ? 'Keine Kunden vorhanden' : `Keine Kunden mit Status "${statusFilter}"` }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { fyo } from 'src/initFyo';

const router = useRouter();

const customers = ref<any[]>([]);
const statusFilter = ref('all');

const stats = computed(() => {
  return {
    active: customers.value.filter(c => (c.status || 'Aktiv') === 'Aktiv').length,
    gefaehrdet: customers.value.filter(c => c.status === 'Gefährdet').length,
    inaktiv: customers.value.filter(c => c.status === 'Inaktiv').length,
    gekuendigt: customers.value.filter(c => c.status === 'Gekündigt').length,
  };
});

const filteredCustomers = computed(() => {
  if (statusFilter.value === 'all') {
    return customers.value;
  }
  return customers.value.filter(c => (c.status || 'Aktiv') === statusFilter.value);
});

onMounted(async () => {
  await loadCustomers();
});

// Reload customers when component becomes active (e.g., navigating back from create page)
onActivated(async () => {
  await loadCustomers();
});

async function loadCustomers() {
  try {
    console.log('Loading customers...');
    const records = await fyo.db.getAll('SubscriptionCustomer', {
      fields: ['name', 'status', 'email', 'phone', 'monthlyAmount', 'lastPaymentDate', 'missedPayments'],
      orderBy: 'name',
    });
    console.log('Loaded customers:', records);
    customers.value = records;
  } catch (error) {
    console.error('Error loading customers:', error);
    // Try with minimal fields in case some fields cause issues
    try {
      const simpleRecords = await fyo.db.getAll('SubscriptionCustomer', {
        fields: ['name', 'status', 'email', 'phone', 'monthlyAmount'],
        orderBy: 'name',
      });
      console.log('Loaded customers with simple fields:', simpleRecords);
      customers.value = simpleRecords;
    } catch (simpleError) {
      console.error('Error loading customers with simple fields:', simpleError);
    }
  }
}

function getStatusClass(status: string): string {
  const s = status || 'Aktiv';
  switch (s) {
    case 'Aktiv':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'Gefährdet':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'Inaktiv':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'Gekündigt':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
}

function formatDate(date: any): string {
  if (!date) return 'Noch nie';
  const d = new Date(date);
  return d.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function openCustomer(name: string) {
  router.push(`/customer/${name}`);
}

function createNew() {
  router.push('/customer/new');
}

async function deleteCustomer(customer: any) {
  const confirmed = confirm(`Möchten Sie den Kunden "${customer.name}" wirklich löschen?\n\nDiese Aktion kann nicht rückgängig gemacht werden.`);

  if (!confirmed) return;

  try {
    console.log('Deleting customer:', customer.name);

    // Try to get the document first
    let customerDoc;
    try {
      customerDoc = await fyo.doc.getDoc('SubscriptionCustomer', customer.name);
    } catch (loadError) {
      console.log('Error loading document, trying to fix createdAt field:', loadError);

      // If loading fails due to createdAt field, try to fix it first
      if (loadError.message?.includes('createdAt')) {
        // Direct database update to fix the createdAt field
        await fyo.db.update('SubscriptionCustomer', {
          name: customer.name,
          createdAt: new Date().toISOString()
        });

        // Try to load again
        customerDoc = await fyo.doc.getDoc('SubscriptionCustomer', customer.name);
      } else {
        throw loadError;
      }
    }

    await customerDoc.delete();

    // Refresh the customer list
    await loadCustomers();

    alert(`Kunde "${customer.name}" wurde erfolgreich gelöscht.`);
  } catch (error) {
    console.error('Error deleting customer:', error);
    alert(`Fehler beim Löschen des Kunden: ${error.message}`);
  }
}
</script>
