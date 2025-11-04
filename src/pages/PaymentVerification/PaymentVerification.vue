<template>
  <div class="flex flex-col h-full overflow-hidden bg-white dark:bg-gray-875">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b dark:border-gray-800">
      <h1 class="text-2xl font-semibold dark:text-gray-100">Monatsabrechnung</h1>
      <router-link
        to="/customers"
        class="text-blue-500 hover:text-blue-600 flex items-center gap-2"
      >
        <feather-icon name="users" class="w-5 h-5" />
        <span>Kunden verwalten</span>
      </router-link>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto p-6">
      <!-- Step 1: Upload File -->
      <div v-if="!fileData" class="max-w-2xl mx-auto">
        <div
          class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <feather-icon name="upload" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Monatsabrechnung hochladen
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            CSV oder Excel-Datei hier ablegen oder klicken zum Auswählen
          </p>
          <input
            ref="fileInput"
            type="file"
            accept=".csv,.xlsx,.xls"
            class="hidden"
            @change="handleFileSelect"
          />
          <button
            class="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="$refs.fileInput.click()"
          >
            Datei auswählen
          </button>
        </div>
      </div>

      <!-- Step 2: Column Mapping -->
      <div v-else-if="!scanComplete" class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-850 rounded-lg border dark:border-gray-800 p-6 mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Spalten zuordnen
          </h3>

          <!-- Column Selection -->
          <div class="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Namens-Spalte
              </label>
              <select
                v-model="nameColumn"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              >
                <option :value="null">Bitte wählen...</option>
                <option v-for="col in columns" :key="col" :value="col">
                  {{ col }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Betrags-Spalte
              </label>
              <select
                v-model="amountColumn"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              >
                <option :value="null">Bitte wählen...</option>
                <option v-for="col in columns" :key="col" :value="col">
                  {{ col }}
                </option>
              </select>
            </div>
          </div>

          <!-- Preview Table -->
          <div class="overflow-x-auto">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vorschau (erste 5 Zeilen)
            </h4>
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th
                    v-for="col in columns"
                    :key="col"
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                    :class="{
                      'bg-blue-50 dark:bg-blue-900': col === nameColumn || col === amountColumn,
                    }"
                  >
                    {{ col }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-875 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(row, idx) in previewRows" :key="idx">
                  <td
                    v-for="col in columns"
                    :key="col"
                    class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
                    :class="{
                      'bg-blue-50 dark:bg-blue-900': col === nameColumn || col === amountColumn,
                    }"
                  >
                    {{ row[col] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between mt-6">
            <button
              class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              @click="resetUpload"
            >
              Neue Datei hochladen
            </button>
            <button
              :disabled="!nameColumn || !amountColumn || isScanning"
              :class="
                !nameColumn || !amountColumn || isScanning
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              "
              class="px-6 py-2 text-white rounded"
              @click="startScan"
            >
              {{ isScanning ? 'Wird gescannt...' : 'Abrechnung starten' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3: Results -->
      <div v-else class="max-w-6xl mx-auto">
        <div class="mb-6 flex justify-between items-center">
          <h3 class="text-xl font-medium text-gray-900 dark:text-gray-100">
            Ergebnisse
          </h3>
          <div class="flex gap-3">
            <button
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center gap-2"
              @click="downloadPDF"
            >
              <feather-icon name="download" class="w-4 h-4" />
              Als PDF herunterladen
            </button>
            <button
              class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded flex items-center gap-2"
              @click="showSaveDialog = true"
            >
              <feather-icon name="save" class="w-4 h-4" />
              Analyse speichern
            </button>
            <button
              class="px-4 py-2 text-blue-500 hover:text-blue-600 flex items-center gap-2"
              @click="resetUpload"
            >
              <feather-icon name="refresh-cw" class="w-4 h-4" />
              Neue Abrechnung
            </button>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-3 gap-6 mb-6">
          <div class="bg-green-50 dark:bg-green-900 rounded-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-green-800 dark:text-green-200">Korrekt</p>
                <p class="text-3xl font-bold text-green-600 dark:text-green-400">
                  {{ results.correct.length }}
                </p>
              </div>
              <feather-icon name="check-circle" class="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div class="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Fehlerhaft</p>
                <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {{ results.incorrect.length }}
                </p>
              </div>
              <feather-icon name="alert-triangle" class="w-12 h-12 text-yellow-500" />
            </div>
          </div>

          <div class="bg-red-50 dark:bg-red-900 rounded-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-red-800 dark:text-red-200">Nicht bezahlt</p>
                <p class="text-3xl font-bold text-red-600 dark:text-red-400">
                  {{ results.missing.length }}
                </p>
              </div>
              <feather-icon name="x-circle" class="w-12 h-12 text-red-500" />
            </div>
          </div>
        </div>

        <!-- Results Tables -->
        <div class="space-y-6">
          <!-- Correct -->
          <div
            v-if="results.correct.length > 0"
            class="bg-white dark:bg-gray-850 rounded-lg border dark:border-gray-800 p-6"
          >
            <h4 class="text-lg font-medium text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
              <feather-icon name="check-circle" class="w-5 h-5" />
              Korrekte Zahlungen
            </h4>
            <ResultTable
              :customers="results.correct"
              type="correct"
              :raw-data-map="rawDataMap"
              :customer-to-csv-name-map="customerToCsvNameMap"
            />
          </div>

          <!-- Incorrect -->
          <div
            v-if="results.incorrect.length > 0"
            class="bg-white dark:bg-gray-850 rounded-lg border dark:border-gray-800 p-6"
          >
            <h4 class="text-lg font-medium text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
              <feather-icon name="alert-triangle" class="w-5 h-5" />
              Fehlerhafte Zahlungen
            </h4>
            <ResultTable
              :customers="results.incorrect"
              type="incorrect"
              :raw-data-map="rawDataMap"
              :customer-to-csv-name-map="customerToCsvNameMap"
            />
          </div>

          <!-- Missing -->
          <div
            v-if="results.missing.length > 0"
            class="bg-white dark:bg-gray-850 rounded-lg border dark:border-gray-800 p-6"
          >
            <h4 class="text-lg font-medium text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
              <feather-icon name="x-circle" class="w-5 h-5" />
              Fehlende Zahlungen
            </h4>
            <ResultTable :customers="results.missing" type="missing" />
          </div>
        </div>
      </div>
    </div>

    <!-- Save Dialog Modal -->
    <div
      v-if="showSaveDialog"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click="showSaveDialog = false"
    >
      <div
        class="bg-white dark:bg-gray-875 rounded-lg shadow-xl w-full max-w-md p-6"
        @click.stop
      >
        <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Analyse speichern
        </h3>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bezeichnung (z.B. "Januar 2025")
          </label>
          <input
            v-model="saveTitle"
            type="text"
            class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
            placeholder="z.B. Januar 2025"
            @keyup.enter="saveAnalysis"
          />
        </div>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            @click="showSaveDialog = false"
          >
            Abbrechen
          </button>
          <button
            :disabled="!saveTitle.trim()"
            :class="
              !saveTitle.trim()
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            "
            class="px-4 py-2 text-white rounded"
            @click="saveAnalysis"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { verifyPayments } from 'src/utils/paymentMatching';
import { generatePaymentVerificationPDF } from 'src/utils/pdfGenerator';
import { fyo } from 'src/initFyo';
import { showToast } from 'src/utils/interactive';
import ResultTable from './ResultTable.vue';

// State
const fileInput = ref<HTMLInputElement | null>(null);
const fileData = ref<any[] | null>(null);
const nameColumn = ref<string | null>(null);
const amountColumn = ref<string | null>(null);
const isScanning = ref(false);
const scanComplete = ref(false);
const results = ref({
  correct: [],
  incorrect: [],
  missing: [],
});
const rawDataMap = ref<Map<string, any>>(new Map());
const customerToCsvNameMap = ref<Map<string, string>>(new Map());
const showSaveDialog = ref(false);
const saveTitle = ref('');
const uploadedFileName = ref('');

// Computed
const columns = computed(() => {
  if (!fileData.value || fileData.value.length === 0) return [];
  return Object.keys(fileData.value[0]);
});

const previewRows = computed(() => {
  if (!fileData.value) return [];
  return fileData.value.slice(0, 5);
});

// Methods
function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    parseFile(target.files[0]);
  }
}

function handleDrop(event: DragEvent) {
  const files = event.dataTransfer?.files;
  if (files && files[0]) {
    parseFile(files[0]);
  }
}

function parseFile(file: File) {
  uploadedFileName.value = file.name;
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.csv')) {
    parseCSV(file);
  } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    parseExcel(file);
  }
}

function parseCSV(file: File) {
  Papa.parse(file, {
    complete: (results) => {
      fileData.value = results.data;
    },
    header: true,
    skipEmptyLines: true,
    delimiter: '',
    dynamicTyping: true,
  });
}

function parseExcel(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
    fileData.value = jsonData;
  };
  reader.readAsArrayBuffer(file);
}

async function startScan() {
  if (!nameColumn.value || !amountColumn.value || !fileData.value) return;

  isScanning.value = true;

  // Simulate scan delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Build raw data map from CSV data
  const dataMap = new Map<string, any>();
  for (const row of fileData.value) {
    const customerName = row[nameColumn.value];
    if (customerName) {
      dataMap.set(customerName, row);
    }
  }
  rawDataMap.value = dataMap;

  const scanResults = await verifyPayments(
    fileData.value,
    nameColumn.value,
    amountColumn.value
  );

  // Build customer to CSV name mapping
  const nameMapping = new Map<string, string>();
  for (const customer of scanResults.correct) {
    if (customer.csvName) {
      nameMapping.set(customer.name, customer.csvName);
    }
  }
  for (const customer of scanResults.incorrect) {
    if (customer.csvName) {
      nameMapping.set(customer.name, customer.csvName);
    }
  }
  customerToCsvNameMap.value = nameMapping;

  results.value = scanResults;
  scanComplete.value = true;
  isScanning.value = false;
}

function resetUpload() {
  fileData.value = null;
  nameColumn.value = null;
  amountColumn.value = null;
  scanComplete.value = false;
  results.value = {
    correct: [],
    incorrect: [],
    missing: [],
  };
  rawDataMap.value = new Map();
  customerToCsvNameMap.value = new Map();
  uploadedFileName.value = '';
  saveTitle.value = '';
}

function downloadPDF() {
  if (!nameColumn.value || !amountColumn.value) {
    alert('Fehler: Spalten-Informationen fehlen');
    return;
  }

  generatePaymentVerificationPDF(results.value, {
    title: saveTitle.value || 'Monatsabrechnung',
    date: new Date(),
    fileName: uploadedFileName.value,
    nameColumn: nameColumn.value,
    amountColumn: amountColumn.value,
  });
}

async function saveAnalysis() {
  if (!saveTitle.value.trim()) {
    return;
  }

  if (!nameColumn.value || !amountColumn.value) {
    alert('Fehler: Spalten-Informationen fehlen');
    return;
  }

  try {
    console.log('Starting to save analysis...');

    // Calculate total amount
    const totalAmount = results.value.correct.reduce((sum, customer) => {
      return sum + (customer.paidAmount || customer.monthlyAmount || 0);
    }, 0);

    console.log('Total amount calculated:', totalAmount);

    // Create new PaymentVerificationRecord
    console.log('Creating new doc with schema: PaymentVerificationRecord');
    const doc = fyo.doc.getNewDoc('PaymentVerificationRecord');
    console.log('Doc created:', doc);

    // Set fields
    await doc.set('title', saveTitle.value.trim());
    await doc.set('date', new Date().toISOString());
    await doc.set('fileName', uploadedFileName.value);
    await doc.set('nameColumn', nameColumn.value);
    await doc.set('amountColumn', amountColumn.value);
    await doc.set('totalCorrect', results.value.correct.length);
    await doc.set('totalIncorrect', results.value.incorrect.length);
    await doc.set('totalMissing', results.value.missing.length);
    await doc.set('totalAmount', totalAmount);
    await doc.set('resultsData', JSON.stringify(results.value));

    console.log('All fields set, syncing...');
    await doc.sync();
    console.log('Doc synced successfully!');

    // Close dialog and show success message
    showSaveDialog.value = false;
    saveTitle.value = '';
    showToast({
      message: 'Analyse erfolgreich gespeichert!',
      type: 'success',
    });
  } catch (error) {
    console.error('Error saving analysis:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    alert(`Fehler beim Speichern der Analyse: ${error instanceof Error ? error.message : String(error)}`);
  }
}
</script>
