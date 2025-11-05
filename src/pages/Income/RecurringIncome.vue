<template>
  <div class="flex flex-col h-full overflow-hidden bg-white dark:bg-gray-875">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b dark:border-gray-800">
      <div>
        <h1 class="text-2xl font-semibold dark:text-gray-100">Wiederkehrende Einnahmen</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ customers.length }} {{ customers.length === 1 ? 'Vertrag' : 'Verträge' }} •
          Monatliche Einnahmen: {{ formatCurrency(totalMonthlyIncome) }}
        </p>
      </div>
      <button
        @click="showAddForm = true"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
      >
        <feather-icon name="plus" class="w-4 h-4" />
        Neuer Vertrag
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="p-6 pb-0">
      <div class="grid gap-4 md:grid-cols-4">
        <!-- Aktive Verträge -->
        <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <feather-icon name="users" class="w-6 h-6 text-green-500" />
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Aktive Verträge</div>
              <div class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ activeContracts }}</div>
            </div>
          </div>
        </div>

        <!-- Monatliche Einnahmen -->
        <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <feather-icon name="dollar-sign" class="w-6 h-6 text-blue-500" />
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Monatlich</div>
              <div class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(totalMonthlyIncome) }}</div>
            </div>
          </div>
        </div>

        <!-- Jährlich (hochgerechnet) -->
        <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <feather-icon name="trending-up" class="w-6 h-6 text-purple-500" />
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Jährlich</div>
              <div class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(totalMonthlyIncome * 12) }}</div>
            </div>
          </div>
        </div>

        <!-- Durchschnitt pro Kunde -->
        <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <feather-icon name="user" class="w-6 h-6 text-orange-500" />
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Ø pro Kunde</div>
              <div class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(averagePerCustomer) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer List -->
    <div class="flex-1 overflow-auto p-6 pt-4">
      <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700">
        <div v-if="customers.length === 0" class="p-8 text-center">
          <feather-icon name="users" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Keine Verträge vorhanden</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Erstellen Sie Ihren ersten wiederkehrenden Einnahmen-Vertrag.
          </p>
          <button
            @click="showAddForm = true"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Ersten Vertrag erstellen
          </button>
        </div>

        <div v-else>
          <!-- Table Header -->
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div class="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div class="col-span-3">Kunde</div>
              <div class="col-span-2">Monatlicher Beitrag</div>
              <div class="col-span-2">Status</div>
              <div class="col-span-2">Vertragsbeginn</div>
              <div class="col-span-2">Zahlungsart</div>
              <div class="col-span-1">Aktionen</div>
            </div>
          </div>

          <!-- Table Body -->
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="customer in sortedCustomers"
              :key="customer.name"
              class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="grid grid-cols-12 gap-4 items-center">
                <!-- Customer Info -->
                <div class="col-span-3">
                  <div class="font-medium text-gray-900 dark:text-gray-100">
                    {{ customer.customerName || customer.name }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ customer.email || 'Keine E-Mail' }}
                  </div>
                </div>

                <!-- Monthly Fee -->
                <div class="col-span-2">
                  <div class="font-medium text-gray-900 dark:text-gray-100">
                    {{ formatCurrency(customer.monthlyFee || 0) }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    monatlich
                  </div>
                </div>

                <!-- Status -->
                <div class="col-span-2">
                  <span
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': customer.contractStatus === 'Aktiv',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': customer.contractStatus === 'Pausiert',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': customer.contractStatus === 'Gekündigt'
                    }"
                    class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ customer.contractStatus || 'Aktiv' }}
                  </span>
                </div>

                <!-- Contract Start -->
                <div class="col-span-2">
                  <div class="text-sm text-gray-900 dark:text-gray-100">
                    {{ formatDate(customer.contractStartDate) }}
                  </div>
                </div>

                <!-- Payment Method -->
                <div class="col-span-2">
                  <div class="text-sm text-gray-900 dark:text-gray-100">
                    {{ customer.paymentMethod || 'SEPA' }}
                  </div>
                </div>

                <!-- Actions -->
                <div class="col-span-1">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editCustomer(customer)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      title="Bearbeiten"
                    >
                      <feather-icon name="edit-2" class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteCustomer(customer)"
                      class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      title="Löschen"
                    >
                      <feather-icon name="trash-2" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Customer Modal -->
    <div
      v-if="showAddForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white dark:bg-gray-850 rounded-lg w-full max-w-md h-full max-h-[80vh] flex flex-col">
        <!-- Header -->
        <div class="p-6 pb-0 flex-shrink-0">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            Neuen Vertrag erstellen
          </h3>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-6 pt-4">
          <div class="space-y-4">
            <!-- Customer Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kundenname *
              </label>
              <input
                v-model="newCustomer.customerName"
                type="text"
                placeholder="Max Mustermann"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-Mail
              </label>
              <input
                v-model="newCustomer.email"
                type="email"
                placeholder="max@mustermann.de"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <!-- Monthly Fee -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monatlicher Beitrag (€) *
              </label>
              <input
                v-model.number="newCustomer.monthlyFee"
                type="number"
                step="0.01"
                min="0"
                placeholder="99.00"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <!-- Contract Start Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vertragsbeginn
              </label>
              <input
                v-model="newCustomer.contractStartDate"
                type="date"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <!-- Payment Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Zahlungsart
              </label>
              <select
                v-model="newCustomer.paymentMethod"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              >
                <option value="SEPA">SEPA-Lastschrift</option>
                <option value="Überweisung">Überweisung</option>
                <option value="Kreditkarte">Kreditkarte</option>
                <option value="Bar">Bar</option>
              </select>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notizen
              </label>
              <textarea
                v-model="newCustomer.notes"
                rows="3"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
                placeholder="Zusätzliche Informationen..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-6 pt-0 flex-shrink-0 border-t dark:border-gray-700">
          <div class="flex justify-end gap-3">
            <button
              @click="cancelAdd"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Abbrechen
            </button>
            <button
              @click="saveCustomer"
              :disabled="!isFormValid"
              :class="{
                'bg-green-600 hover:bg-green-700 text-white': isFormValid,
                'bg-gray-300 text-gray-500 cursor-not-allowed': !isFormValid
              }"
              class="px-4 py-2 rounded"
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated } from 'vue';
import { fyo } from 'src/initFyo';
import featherIcon from 'src/components/FeatherIcon.vue';

const customers = ref<any[]>([]);
const showAddForm = ref(false);

const newCustomer = ref({
  customerName: '',
  email: '',
  monthlyFee: 0,
  contractStartDate: '',
  paymentMethod: 'SEPA',
  contractStatus: 'Aktiv',
  notes: ''
});

const isFormValid = computed(() => {
  return newCustomer.value.customerName.trim() !== '' &&
         newCustomer.value.monthlyFee > 0;
});

const sortedCustomers = computed(() => {
  return [...customers.value].sort((a, b) => {
    const aName = a.customerName || a.name || '';
    const bName = b.customerName || b.name || '';
    return aName.localeCompare(bName);
  });
});

const activeContracts = computed(() => {
  return customers.value.filter(c => (c.contractStatus || 'Aktiv') === 'Aktiv').length;
});

const totalMonthlyIncome = computed(() => {
  return customers.value
    .filter(c => (c.contractStatus || 'Aktiv') === 'Aktiv')
    .reduce((sum, c) => sum + (c.monthlyFee || 0), 0);
});

const averagePerCustomer = computed(() => {
  const activeCount = activeContracts.value;
  return activeCount > 0 ? totalMonthlyIncome.value / activeCount : 0;
});

onMounted(async () => {
  await loadCustomers();
});

onActivated(async () => {
  await loadCustomers();
});

async function loadCustomers() {
  try {
    const allCustomers = await fyo.db.getAll('SubscriptionCustomer', {
      fields: ['name', 'customerName', 'email', 'monthlyFee', 'contractStartDate', 'paymentMethod', 'contractStatus', 'notes']
    });
    customers.value = allCustomers || [];
  } catch (error) {
    console.error('Error loading customers:', error);
    customers.value = [];
  }
}

function cancelAdd() {
  showAddForm.value = false;
  newCustomer.value = {
    customerName: '',
    email: '',
    monthlyFee: 0,
    contractStartDate: '',
    paymentMethod: 'SEPA',
    contractStatus: 'Aktiv',
    notes: ''
  };
}

async function saveCustomer() {
  if (!isFormValid.value) return;

  try {
    console.log('Creating new customer...');
    console.log('Form data:', newCustomer.value);

    const timestamp = Date.now();
    const uniqueName = `CU-${timestamp}`;
    console.log('Generated name:', uniqueName);

    const doc = fyo.doc.getNewDoc('SubscriptionCustomer');
    await doc.set('name', uniqueName);
    await doc.set('customerName', newCustomer.value.customerName);

    if (newCustomer.value.email) {
      await doc.set('email', newCustomer.value.email);
    }

    await doc.set('monthlyFee', newCustomer.value.monthlyFee);

    if (newCustomer.value.contractStartDate) {
      await doc.set('contractStartDate', newCustomer.value.contractStartDate);
    }

    await doc.set('paymentMethod', newCustomer.value.paymentMethod);
    await doc.set('contractStatus', newCustomer.value.contractStatus);

    if (newCustomer.value.notes) {
      await doc.set('notes', newCustomer.value.notes);
    }

    console.log('About to sync...');
    await doc.sync();
    console.log('Sync completed successfully');

    await loadCustomers();
    cancelAdd();
    alert('Vertrag erfolgreich erstellt!');
  } catch (error) {
    console.error('Error saving customer:', error);
    alert(`Fehler: ${error.message}`);
  }
}

function editCustomer(customer: any) {
  // TODO: Implement edit functionality
  alert(`Bearbeiten von ${customer.customerName || customer.name} wird noch implementiert.`);
}

async function deleteCustomer(customer: any) {
  if (!confirm(`Möchten Sie den Vertrag mit ${customer.customerName || customer.name} wirklich löschen?`)) {
    return;
  }

  try {
    const doc = await fyo.doc.getDoc('SubscriptionCustomer', customer.name);
    await doc.delete();
    await loadCustomers();
    alert('Vertrag erfolgreich gelöscht!');
  } catch (error) {
    console.error('Error deleting customer:', error);
    alert(`Fehler beim Löschen: ${error.message}`);
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

function formatDate(dateString: string): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}
</script>