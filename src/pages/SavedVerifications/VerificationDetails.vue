<template>
  <div class="flex flex-col h-full overflow-hidden bg-white dark:bg-gray-875">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b dark:border-gray-800">
      <div class="flex items-center gap-4">
        <button
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          @click="goBack"
        >
          <feather-icon name="arrow-left" class="w-6 h-6" />
        </button>
        <div>
          <h1 class="text-2xl font-semibold dark:text-gray-100">
            {{ verification?.title || 'Abrechnung' }}
          </h1>
          <p v-if="verification" class="text-sm text-gray-600 dark:text-gray-400">
            {{ formatDate(verification.date) }}
          </p>
        </div>
      </div>
      <button
        v-if="verification"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center gap-2"
        @click="downloadPDF"
      >
        <feather-icon name="download" class="w-4 h-4" />
        Als PDF herunterladen
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto p-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400">Lade Details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="!verification" class="max-w-2xl mx-auto text-center py-12">
        <feather-icon name="alert-circle" class="w-16 h-16 mx-auto text-red-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Abrechnung nicht gefunden
        </h3>
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="goBack"
        >
          Zurück zur Übersicht
        </button>
      </div>

      <!-- Details Content -->
      <div v-else class="max-w-6xl mx-auto">
        <!-- Metadata Section -->
        <div class="bg-white dark:bg-gray-850 rounded-lg border dark:border-gray-800 p-6 mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Details
          </h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600 dark:text-gray-400">Dateiname:</span>
              <span class="ml-2 text-gray-900 dark:text-gray-100">{{ verification.fileName }}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Datum:</span>
              <span class="ml-2 text-gray-900 dark:text-gray-100">{{ formatDate(verification.date) }}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Namens-Spalte:</span>
              <span class="ml-2 text-gray-900 dark:text-gray-100">{{ verification.nameColumn }}</span>
            </div>
            <div>
              <span class="text-gray-600 dark:text-gray-400">Betrags-Spalte:</span>
              <span class="ml-2 text-gray-900 dark:text-gray-100">{{ verification.amountColumn }}</span>
            </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { fyo } from 'src/initFyo';
import { generatePaymentVerificationPDF } from 'src/utils/pdfGenerator';
import ResultTable from '../PaymentVerification/ResultTable.vue';

interface Verification {
  name: string;
  title: string;
  date: Date;
  fileName: string;
  nameColumn: string;
  amountColumn: string;
  totalCorrect: number;
  totalIncorrect: number;
  totalMissing: number;
  totalAmount: number;
  resultsData: string;
}

interface VerificationResults {
  correct: any[];
  incorrect: any[];
  missing: any[];
}

const router = useRouter();
const route = useRoute();
const verification = ref<Verification | null>(null);
const results = ref<VerificationResults>({
  correct: [],
  incorrect: [],
  missing: [],
});
const isLoading = ref(true);

onMounted(async () => {
  await loadVerification();
});

async function loadVerification() {
  try {
    isLoading.value = true;
    const name = route.params.name as string;

    const doc = await fyo.doc.getDoc('PaymentVerificationRecord', name);

    verification.value = {
      name: doc.name as string,
      title: doc.title as string,
      date: new Date(doc.date as string),
      fileName: doc.fileName as string,
      nameColumn: doc.nameColumn as string,
      amountColumn: doc.amountColumn as string,
      totalCorrect: parseInt(doc.totalCorrect as string) || 0,
      totalIncorrect: parseInt(doc.totalIncorrect as string) || 0,
      totalMissing: parseInt(doc.totalMissing as string) || 0,
      totalAmount: parseFloat(doc.totalAmount as string) || 0,
      resultsData: doc.resultsData as string,
    };

    // Parse results data
    results.value = JSON.parse(verification.value.resultsData);
  } catch (error) {
    console.error('Error loading verification:', error);
    verification.value = null;
  } finally {
    isLoading.value = false;
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function goBack() {
  router.push('/saved-verifications');
}

function downloadPDF() {
  if (!verification.value) return;

  generatePaymentVerificationPDF(results.value, {
    title: verification.value.title,
    date: verification.value.date,
    fileName: verification.value.fileName,
    nameColumn: verification.value.nameColumn,
    amountColumn: verification.value.amountColumn,
  });
}
</script>
