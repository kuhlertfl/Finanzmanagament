<template>
  <div class="flex flex-col h-full overflow-hidden bg-white dark:bg-gray-875">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b dark:border-gray-800">
      <h1 class="text-2xl font-semibold dark:text-gray-100">Vergangene Abrechnungen</h1>
      <router-link
        to="/payment-verification"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center gap-2"
      >
        <feather-icon name="plus" class="w-4 h-4" />
        <span>Neue Abrechnung</span>
      </router-link>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto p-6">
      <!-- Empty State -->
      <div v-if="verifications.length === 0 && !isLoading" class="max-w-2xl mx-auto text-center py-12">
        <feather-icon name="file-text" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Keine gespeicherten Abrechnungen
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Erstellen Sie Ihre erste Monatsabrechnung und speichern Sie diese hier.
        </p>
        <router-link
          to="/payment-verification"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <feather-icon name="plus" class="w-5 h-5" />
          Neue Abrechnung erstellen
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400">Lade Abrechnungen...</p>
      </div>

      <!-- Verifications Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <div
          v-for="verification in verifications"
          :key="verification.name"
          class="bg-white dark:bg-gray-850 rounded-lg border dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
        >
          <!-- Header -->
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {{ verification.title }}
            </h3>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div class="flex items-center gap-2">
                <feather-icon name="calendar" class="w-4 h-4" />
                {{ formatDate(verification.date) }}
              </div>
              <div class="flex items-center gap-2">
                <feather-icon name="file" class="w-4 h-4" />
                {{ verification.fileName }}
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="mb-4 space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-green-600 dark:text-green-400 flex items-center gap-1">
                <feather-icon name="check-circle" class="w-4 h-4" />
                Korrekt
              </span>
              <span class="font-medium">{{ verification.totalCorrect }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                <feather-icon name="alert-triangle" class="w-4 h-4" />
                Fehlerhaft
              </span>
              <span class="font-medium">{{ verification.totalIncorrect }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-red-600 dark:text-red-400 flex items-center gap-1">
                <feather-icon name="x-circle" class="w-4 h-4" />
                Nicht bezahlt
              </span>
              <span class="font-medium">{{ verification.totalMissing }}</span>
            </div>
            <div class="pt-2 border-t dark:border-gray-700 flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Gesamtsumme</span>
              <span class="text-sm font-bold text-gray-900 dark:text-gray-100">
                {{ formatCurrency(verification.totalAmount) }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              class="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm flex items-center justify-center gap-1"
              @click="viewDetails(verification)"
            >
              <feather-icon name="eye" class="w-4 h-4" />
              Details
            </button>
            <button
              class="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm flex items-center justify-center gap-1"
              @click="downloadPDF(verification)"
              title="Als PDF herunterladen"
            >
              <feather-icon name="download" class="w-4 h-4" />
            </button>
            <button
              class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm flex items-center justify-center gap-1"
              @click="deleteVerification(verification)"
              title="Löschen"
            >
              <feather-icon name="trash-2" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { fyo } from 'src/initFyo';
import { generatePaymentVerificationPDF } from 'src/utils/pdfGenerator';

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

const router = useRouter();
const verifications = ref<Verification[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  await loadVerifications();
});

// Reload data whenever the page becomes active
onActivated(async () => {
  await loadVerifications();
});

async function loadVerifications() {
  try {
    isLoading.value = true;
    const records = await fyo.db.getAll('PaymentVerificationRecord', {
      fields: ['name', 'title', 'date', 'fileName', 'nameColumn', 'amountColumn', 'totalCorrect', 'totalIncorrect', 'totalMissing', 'totalAmount', 'resultsData'],
      orderBy: 'date',
      order: 'desc',
    });

    verifications.value = records.map((r: any) => ({
      name: r.name as string,
      title: r.title as string,
      date: new Date(r.date as string),
      fileName: r.fileName as string,
      nameColumn: r.nameColumn as string,
      amountColumn: r.amountColumn as string,
      totalCorrect: parseInt(r.totalCorrect) || 0,
      totalIncorrect: parseInt(r.totalIncorrect) || 0,
      totalMissing: parseInt(r.totalMissing) || 0,
      totalAmount: parseFloat(r.totalAmount) || 0,
      resultsData: r.resultsData as string,
    }));
  } catch (error) {
    console.error('Error loading verifications:', error);
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

function formatCurrency(amount: number): string {
  if (amount == null || isNaN(amount)) {
    return '0,00 €';
  }
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' €';
}

function viewDetails(verification: Verification) {
  router.push(`/saved-verifications/${verification.name}`);
}

function downloadPDF(verification: Verification) {
  try {
    const results = JSON.parse(verification.resultsData);
    generatePaymentVerificationPDF(results, {
      title: verification.title,
      date: verification.date,
      fileName: verification.fileName,
      nameColumn: verification.nameColumn,
      amountColumn: verification.amountColumn,
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Fehler beim Erstellen des PDFs');
  }
}

async function deleteVerification(verification: Verification) {
  if (!confirm(`Möchten Sie die Abrechnung "${verification.title}" wirklich löschen?`)) {
    return;
  }

  try {
    const doc = await fyo.doc.getDoc('PaymentVerificationRecord', verification.name);
    await doc.delete();
    await loadVerifications();
  } catch (error) {
    console.error('Error deleting verification:', error);
    alert('Fehler beim Löschen der Abrechnung');
  }
}
</script>
