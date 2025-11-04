<template>
  <div class="flex flex-col h-full overflow-hidden bg-white dark:bg-gray-875">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b dark:border-gray-800">
      <div>
        <h1 class="text-2xl font-semibold dark:text-gray-100">Einmalige Ausgaben</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ expenses.length }} {{ expenses.length === 1 ? 'Ausgabe' : 'Ausgaben' }}
        </p>
      </div>
      <button
        @click="showAddForm = true"
        class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
      >
        <feather-icon name="plus" class="w-4 h-4" />
        Neue Ausgabe
      </button>
    </div>

    <!-- Add Form Modal -->
    <div
      v-if="showAddForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white dark:bg-gray-850 rounded-lg w-full max-w-md h-full max-h-[80vh] flex flex-col">
        <!-- Header -->
        <div class="p-6 pb-0 flex-shrink-0">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            Neue Ausgabe eintragen
          </h3>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-6 pt-4">
          <div class="space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name *
              </label>
              <input
                v-model="newExpense.name"
                type="text"
                placeholder="z.B. Büromaterial"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <!-- Betrag -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Betrag (€) *
              </label>
              <input
                v-model.number="newExpense.amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <!-- Datum -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Datum *
              </label>
              <input
                v-model="newExpense.date"
                type="date"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <!-- Kategorie -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kategorie
              </label>
              <select
                v-model="newExpense.category"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              >
                <option value="">Kategorie wählen</option>
                <option value="Büroausstattung">Büroausstattung</option>
                <option value="IT/Software">IT/Software</option>
                <option value="Marketing">Marketing</option>
                <option value="Reisekosten">Reisekosten</option>
                <option value="Schulungen/Weiterbildung">Schulungen/Weiterbildung</option>
                <option value="Reparaturen/Wartung">Reparaturen/Wartung</option>
                <option value="Beratung/Dienstleistungen">Beratung/Dienstleistungen</option>
                <option value="Sonstige">Sonstige</option>
              </select>
            </div>

            <!-- Lieferant -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lieferant/Firma
              </label>
              <input
                v-model="newExpense.supplier"
                type="text"
                placeholder="z.B. Office Depot"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <!-- Rechnungsnummer -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rechnungsnummer
              </label>
              <input
                v-model="newExpense.invoiceNumber"
                type="text"
                placeholder="z.B. RE-2023-001"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>


            <!-- PDF Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rechnung (PDF)
              </label>

              <!-- File Upload -->
              <div v-if="!uploadedFile" class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
                <feather-icon name="upload" class="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  PDF hier ablegen oder klicken zum Auswählen
                </p>
                <input
                  ref="fileInput"
                  type="file"
                  accept=".pdf"
                  class="hidden"
                  @change="handleFileUpload"
                />
                <button
                  @click="$refs.fileInput.click()"
                  type="button"
                  class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  PDF auswählen
                </button>
              </div>

              <!-- Uploaded File Display -->
              <div v-else class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded border dark:border-gray-700">
                <div class="flex items-center gap-3">
                  <feather-icon name="file-text" class="w-6 h-6 text-red-600" />
                  <div>
                    <p class="font-medium dark:text-gray-100">{{ uploadedFile.name }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatFileSize(uploadedFile.size) }}</p>
                  </div>
                </div>
                <button
                  @click="removeFile"
                  class="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                >
                  <feather-icon name="trash-2" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Notizen -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notizen
              </label>
              <textarea
                v-model="newExpense.notes"
                rows="3"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
                placeholder="Zusätzliche Informationen..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Footer Buttons -->
        <div class="p-6 pt-0 flex-shrink-0 border-t dark:border-gray-700">
          <div class="flex justify-end gap-3">
            <button
              @click="cancelAdd"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Abbrechen
            </button>
            <button
              @click="saveExpense"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              :disabled="!isFormValid"
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-800">
      <div class="bg-white dark:bg-gray-850 rounded-lg p-4 border dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Diesen Monat</p>
            <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ monthlyTotal.toFixed(2) }} €</p>
          </div>
          <div class="w-2 h-2 rounded-full bg-red-500"></div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-850 rounded-lg p-4 border dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Dieses Jahr</p>
            <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ yearlyTotal.toFixed(2) }} €</p>
          </div>
          <div class="w-2 h-2 rounded-full bg-orange-500"></div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-850 rounded-lg p-4 border dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Anzahl Belege</p>
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ totalExpenses }}</p>
          </div>
          <div class="w-2 h-2 rounded-full bg-purple-500"></div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-850 rounded-lg p-4 border dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Gesamtausgaben</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ businessExpensesTotal.toFixed(2) }} €</p>
          </div>
          <div class="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
    </div>

    <!-- Expenses List -->
    <div class="flex-1 overflow-auto p-6">
      <div v-if="expenses.length === 0" class="text-center py-12">
        <feather-icon name="credit-card" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
        <p class="text-gray-600 dark:text-gray-400 text-lg">Keine einmaligen Ausgaben</p>
        <p class="text-gray-500 dark:text-gray-500 mt-2">Klicken Sie auf "Neue Ausgabe" um zu beginnen</p>
      </div>

      <div v-else class="bg-white dark:bg-gray-850 rounded-lg border dark:border-gray-800 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kategorie
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Datum
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Betrag
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Lieferant
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-875 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="expense in sortedExpenses"
              :key="expense.name"
              class="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ expense.description || expense.name }}
                </div>
                <div v-if="expense.invoiceNumber" class="text-sm text-gray-500 dark:text-gray-400">
                  Rechnung: {{ expense.invoiceNumber }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="expense.category" class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {{ expense.category }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(expense.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-red-600 dark:text-red-400">
                  {{ expense.amount?.toFixed(2) || '0.00' }} €
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ expense.supplier || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <button
                    v-if="expense.attachments"
                    @click="viewAttachment(expense)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                    title="Rechnung anzeigen"
                  >
                    <feather-icon name="file-text" class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteExpense(expense)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                    title="Ausgabe löschen"
                  >
                    <feather-icon name="trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated } from 'vue';
import { fyo } from 'src/initFyo';

const expenses = ref<any[]>([]);
const showAddForm = ref(false);

const newExpense = ref({
  name: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  category: '',
  supplier: '',
  invoiceNumber: '',
  attachments: '',
  notes: '',
});

const uploadedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const isFormValid = computed(() => {
  return newExpense.value.name.trim() !== '' &&
         newExpense.value.amount > 0 &&
         newExpense.value.date !== '';
});

const sortedExpenses = computed(() => {
  return [...expenses.value].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
});

const monthlyTotal = computed(() => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return expenses.value
    .filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    })
    .reduce((sum, exp) => sum + (exp.amount || 0), 0);
});

const yearlyTotal = computed(() => {
  const currentYear = new Date().getFullYear();

  return expenses.value
    .filter(exp => new Date(exp.date).getFullYear() === currentYear)
    .reduce((sum, exp) => sum + (exp.amount || 0), 0);
});

const businessExpensesTotal = computed(() => {
  return expenses.value
    .reduce((sum, exp) => sum + (exp.amount || 0), 0);
});

const totalExpenses = computed(() => {
  return expenses.value.length;
});

onMounted(async () => {
  await loadExpenses();
});

onActivated(async () => {
  await loadExpenses();
});

async function loadExpenses() {
  try {
    console.log('Loading one-time expenses...');

    // First try to load without isBusinessExpense field to avoid null conversion error
    try {
      const data = await fyo.db.getAll('OneTimeExpense', {
        fields: ['name', 'amount', 'date', 'category', 'description', 'supplier', 'invoiceNumber', 'taxAmount', 'isBusinessExpense', 'attachments', 'notes'],
      });
      console.log('Loaded expenses:', data);
      expenses.value = data || [];
    } catch (conversionError) {
      if (conversionError.message?.includes('isBusinessExpense')) {
        console.log('Loading without isBusinessExpense field due to null values...');
        const data = await fyo.db.getAll('OneTimeExpense', {
          fields: ['name', 'amount', 'date', 'category', 'description', 'supplier', 'invoiceNumber', 'taxAmount', 'attachments', 'notes'],
        });

        // Add default isBusinessExpense value
        const fixedData = (data || []).map(expense => ({
          ...expense,
          isBusinessExpense: true // Set to true since all expenses in this tool are business expenses
        }));

        console.log('Loaded expenses without isBusinessExpense:', fixedData);
        expenses.value = fixedData;
      } else {
        throw conversionError;
      }
    }
  } catch (error) {
    console.error('Error loading expenses:', error);
    console.error('Error details:', error.message, error.stack);

    if (error.message?.includes('no such table: OneTimeExpense')) {
      console.log('Table does not exist, it will be created when first entry is saved.');
    }

    expenses.value = [];
  }
}

async function saveExpense() {
  if (!isFormValid.value) return;

  try {
    console.log('Creating new OneTimeExpense...');
    console.log('Form data:', newExpense.value);

    const doc = fyo.doc.getNewDoc('OneTimeExpense');

    // Generate unique name for manual naming
    const timestamp = Date.now();
    const uniqueName = `OTE-${timestamp}`;

    await doc.set('name', uniqueName);
    await doc.set('amount', newExpense.value.amount);
    await doc.set('date', newExpense.value.date);
    await doc.set('description', newExpense.value.name);

    // Set optional fields only if they have values
    if (newExpense.value.category) {
      await doc.set('category', newExpense.value.category);
    }
    if (newExpense.value.supplier) {
      await doc.set('supplier', newExpense.value.supplier);
    }
    if (newExpense.value.invoiceNumber) {
      await doc.set('invoiceNumber', newExpense.value.invoiceNumber);
    }
    if (newExpense.value.notes) {
      await doc.set('notes', newExpense.value.notes);
    }

    // Handle PDF upload - if file uploaded, use filename
    if (uploadedFile.value) {
      await doc.set('attachments', uploadedFile.value.name);
    } else if (newExpense.value.attachments) {
      await doc.set('attachments', newExpense.value.attachments);
    }

    await doc.set('isBusinessExpense', true);

    await doc.sync();
    console.log('Expense saved successfully');

    await loadExpenses();
    cancelAdd();

    alert('Einmalige Ausgabe erfolgreich gespeichert!');
  } catch (error) {
    console.error('Error saving expense:', error);
    console.error('Error details:', error.message, error.stack);
    alert(`Fehler beim Speichern: ${error.message}`);
  }
}

function cancelAdd() {
  showAddForm.value = false;
  newExpense.value = {
    name: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: '',
    supplier: '',
    invoiceNumber: '',
    attachments: '',
    notes: '',
  };
  uploadedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    uploadedFile.value = target.files[0];
    newExpense.value.attachments = target.files[0].name;
  }
}

function removeFile() {
  uploadedFile.value = null;
  newExpense.value.attachments = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

async function deleteExpense(expense: any) {
  const confirmed = confirm(`Möchten Sie die Ausgabe "${expense.description || expense.name}" wirklich löschen?\n\nDiese Aktion kann nicht rückgängig gemacht werden.`);

  if (!confirmed) return;

  try {
    const doc = await fyo.doc.getDoc('OneTimeExpense', expense.name);
    await doc.delete();

    await loadExpenses();
    alert('Ausgabe erfolgreich gelöscht.');
  } catch (error) {
    console.error('Error deleting expense:', error);
    alert(`Fehler beim Löschen: ${error.message}`);
  }
}

function formatDate(date: any): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function viewAttachment(expense: any) {
  alert(`Rechnung: ${expense.attachments}\n\nRechnungs-Viewer wird in einer zukünftigen Version implementiert.`);
}
</script>