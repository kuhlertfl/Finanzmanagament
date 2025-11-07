<template>
  <div class="flex flex-col h-full overflow-hidden bg-white dark:bg-gray-875">
    <!-- Header -->
    <div
      class="
        flex
        items-center
        justify-between
        p-6
        border-b
        dark:border-gray-800
      "
    >
      <div class="flex items-center gap-4">
        <button
          @click="goBack"
          class="
            text-gray-600
            dark:text-gray-400
            hover:text-gray-900
            dark:hover:text-gray-100
          "
        >
          <feather-icon name="arrow-left" class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-2xl font-semibold dark:text-gray-100">
            {{ customerName }}
          </h1>
          <div class="flex items-center gap-2 mt-1">
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="statusClass"
            >
              {{ customerDoc?.status || 'Aktiv' }}
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ customerDoc?.monthlyAmount?.toFixed(2) || '0.00' }} € / Monat
            </span>
          </div>
        </div>
      </div>
      <div class="flex gap-3">
        <button
          v-if="!isEditing"
          @click="isEditing = true"
          class="
            px-4
            py-2
            text-blue-600
            border border-blue-600
            rounded
            hover:bg-blue-50
            dark:hover:bg-blue-900
          "
        >
          Bearbeiten
        </button>
        <template v-else>
          <button
            @click="cancelEdit"
            class="
              px-4
              py-2
              text-gray-700
              dark:text-gray-300
              border border-gray-300
              dark:border-gray-700
              rounded
              hover:bg-gray-50
              dark:hover:bg-gray-800
            "
          >
            Abbrechen
          </button>
          <button
            @click="saveCustomer"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Speichern
          </button>
        </template>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex border-b dark:border-gray-800">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-6 py-3 font-medium border-b-2 transition-colors"
        :class="
          activeTab === tab.id
            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-auto p-6">
      <!-- Übersicht Tab -->
      <div v-if="activeTab === 'overview'" class="max-w-4xl mx-auto space-y-6">
        <!-- Stammdaten -->
        <div
          class="
            bg-white
            dark:bg-gray-850
            rounded-lg
            border
            dark:border-gray-800
            p-6
          "
        >
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Stammdaten
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                  mb-1
                "
              >
                Name
              </label>
              <input
                v-model="editData.name"
                :disabled="!isEditing"
                type="text"
                class="
                  w-full
                  p-2
                  border border-gray-300
                  dark:border-gray-700
                  rounded
                  bg-white
                  dark:bg-gray-900 dark:text-gray-100
                  disabled:bg-gray-50
                  dark:disabled:bg-gray-800
                "
              />
            </div>
            <div>
              <label
                class="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                  mb-1
                "
              >
                Status
              </label>
              <select
                v-model="editData.status"
                :disabled="!isEditing"
                class="
                  w-full
                  p-2
                  border border-gray-300
                  dark:border-gray-700
                  rounded
                  bg-white
                  dark:bg-gray-900 dark:text-gray-100
                  disabled:bg-gray-50
                  dark:disabled:bg-gray-800
                "
              >
                <option value="Aktiv">Aktiv</option>
                <option value="Gefährdet">Gefährdet</option>
                <option value="Inaktiv">Inaktiv</option>
                <option value="Gekündigt">Gekündigt</option>
              </select>
            </div>
            <div>
              <label
                class="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                  mb-1
                "
              >
                Email
              </label>
              <input
                v-model="editData.email"
                :disabled="!isEditing"
                type="email"
                class="
                  w-full
                  p-2
                  border border-gray-300
                  dark:border-gray-700
                  rounded
                  bg-white
                  dark:bg-gray-900 dark:text-gray-100
                  disabled:bg-gray-50
                  dark:disabled:bg-gray-800
                "
              />
            </div>
            <div>
              <label
                class="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                  mb-1
                "
              >
                Telefon
              </label>
              <input
                v-model="editData.phone"
                :disabled="!isEditing"
                type="text"
                class="
                  w-full
                  p-2
                  border border-gray-300
                  dark:border-gray-700
                  rounded
                  bg-white
                  dark:bg-gray-900 dark:text-gray-100
                  disabled:bg-gray-50
                  dark:disabled:bg-gray-800
                "
              />
            </div>
            <div>
              <label
                class="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                  mb-1
                "
              >
                Monatlicher Betrag (€)
              </label>
              <input
                v-model.number="editData.monthlyAmount"
                :disabled="!isEditing"
                type="number"
                step="0.01"
                min="0"
                class="
                  w-full
                  p-2
                  border border-gray-300
                  dark:border-gray-700
                  rounded
                  bg-white
                  dark:bg-gray-900 dark:text-gray-100
                  disabled:bg-gray-50
                  dark:disabled:bg-gray-800
                "
              />
            </div>
          </div>
        </div>

        <!-- Vertragsinformationen -->
        <div
          class="
            bg-white
            dark:bg-gray-850
            rounded-lg
            border
            dark:border-gray-800
            p-6
          "
        >
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Vertragsinformationen
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                  mb-1
                "
              >
                Vertragsbeginn
              </label>
              <input
                v-model="editData.contractStartDate"
                :disabled="!isEditing"
                type="date"
                class="
                  w-full
                  p-2
                  border border-gray-300
                  dark:border-gray-700
                  rounded
                  bg-white
                  dark:bg-gray-900 dark:text-gray-100
                  disabled:bg-gray-50
                  dark:disabled:bg-gray-800
                "
              />
            </div>
            <div>
              <label
                class="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                  mb-1
                "
              >
                Vertragslaufzeit
              </label>
              <select
                v-model="editData.contractInterval"
                :disabled="!isEditing"
                class="
                  w-full
                  p-2
                  border border-gray-300
                  dark:border-gray-700
                  rounded
                  bg-white
                  dark:bg-gray-900 dark:text-gray-100
                  disabled:bg-gray-50
                  dark:disabled:bg-gray-800
                "
              >
                <option value="Monatlich">Monatlich</option>
                <option value="Jährlich">Jährlich</option>
                <option value="Individuell">Individuell</option>
              </select>
            </div>
            <div class="col-span-2">
              <label
                class="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                  mb-1
                "
              >
                Kündigungsfrist
              </label>
              <input
                v-model="editData.noticePeriod"
                :disabled="!isEditing"
                type="text"
                placeholder="z.B. 1 Monat zum Monatsende"
                class="
                  w-full
                  p-2
                  border border-gray-300
                  dark:border-gray-700
                  rounded
                  bg-white
                  dark:bg-gray-900 dark:text-gray-100
                  disabled:bg-gray-50
                  dark:disabled:bg-gray-800
                "
              />
            </div>
          </div>
        </div>

        <!-- Zahlungsstatus -->
        <div
          class="
            bg-white
            dark:bg-gray-850
            rounded-lg
            border
            dark:border-gray-800
            p-6
          "
        >
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Zahlungsstatus
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-sm text-gray-600 dark:text-gray-400 mb-1"
              >
                Letzte Zahlung
              </label>
              <p class="text-lg font-medium dark:text-gray-100">
                {{ formatDate(customerDoc?.lastPaymentDate) }}
              </p>
            </div>
            <div>
              <label
                class="block text-sm text-gray-600 dark:text-gray-400 mb-1"
              >
                Verpasste Zahlungen
              </label>
              <p class="text-lg font-medium dark:text-gray-100">
                {{ customerDoc?.missedPayments || 0 }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Vertrag Tab -->
      <div v-if="activeTab === 'contract'" class="max-w-4xl mx-auto">
        <div
          class="
            bg-white
            dark:bg-gray-850
            rounded-lg
            border
            dark:border-gray-800
            p-6
          "
        >
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Vertragsdokument
          </h3>

          <div v-if="customerDoc?.contractDocument" class="mb-4">
            <div
              class="
                flex
                items-center
                p-4
                bg-gray-50
                dark:bg-gray-900
                rounded
                border
                dark:border-gray-700
                gap-4
              "
            >
              <feather-icon name="file-text" class="w-8 h-8 text-blue-600 flex-shrink-0" />

              <!-- Contract info - flexible width -->
              <div class="flex-1 min-w-0">
                <p class="font-medium dark:text-gray-100 truncate" :title="getContractDisplayName()">
                  {{ getContractDisplayName() }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Vertragsdokument
                </p>
              </div>

              <!-- Buttons - fixed width, always visible -->
              <div class="flex gap-2 flex-shrink-0">
                <button
                  @click="viewContract"
                  class="
                    px-3
                    py-2
                    text-green-600
                    hover:bg-green-50
                    dark:hover:bg-green-900
                    rounded
                  "
                  title="Vertrag anzeigen"
                >
                  <feather-icon name="eye" class="w-5 h-5" />
                </button>
                <button
                  v-if="isEditing"
                  @click="removeContract"
                  class="
                    px-3
                    py-2
                    text-red-600
                    hover:bg-red-50
                    dark:hover:bg-red-900
                    rounded
                  "
                  title="Vertrag entfernen"
                >
                  <feather-icon name="trash-2" class="w-5 h-5" />
                </button>
                <!-- Temporary debug button to clear corrupted data -->
                <button
                  @click="clearCorruptedContract"
                  class="
                    px-3
                    py-2
                    text-orange-600
                    hover:bg-orange-50
                    dark:hover:bg-orange-900
                    rounded
                  "
                  title="Vertragsdaten zurücksetzen (Debug)"
                >
                  <feather-icon name="trash" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <feather-icon
              name="file-text"
              class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4"
            />
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Kein Vertragsdokument hochgeladen
            </p>
          </div>

          <div v-if="isEditing">
            <label
              class="
                block
                text-sm
                font-medium
                text-gray-700
                dark:text-gray-300
                mb-2
              "
            >
              Vertrag hochladen
            </label>
            <input
              ref="contractInput"
              type="file"
              accept=".pdf,.doc,.docx"
              @change="handleContractUpload"
              class="
                block
                w-full
                text-sm text-gray-500
                dark:text-gray-400
                file:mr-4
                file:py-2
                file:px-4
                file:rounded
                file:border-0
                file:text-sm
                file:font-semibold
                file:bg-blue-50
                file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-blue-900 dark:file:text-blue-300
              "
            />
          </div>
        </div>
      </div>

      <!-- Zahlungshistorie Tab -->
      <div v-if="activeTab === 'history'" class="max-w-6xl mx-auto">
        <div
          class="
            bg-white
            dark:bg-gray-850
            rounded-lg
            border
            dark:border-gray-800
            p-6
          "
        >
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Zahlungshistorie
          </h3>
          <div v-if="paymentHistory.length > 0" class="overflow-x-auto">
            <table
              class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th
                    class="
                      px-4
                      py-3
                      text-left text-xs
                      font-medium
                      text-gray-500
                      dark:text-gray-400
                      uppercase
                    "
                  >
                    Datum
                  </th>
                  <th
                    class="
                      px-4
                      py-3
                      text-left text-xs
                      font-medium
                      text-gray-500
                      dark:text-gray-400
                      uppercase
                    "
                  >
                    Erwarteter Betrag
                  </th>
                  <th
                    class="
                      px-4
                      py-3
                      text-left text-xs
                      font-medium
                      text-gray-500
                      dark:text-gray-400
                      uppercase
                    "
                  >
                    Bezahlter Betrag
                  </th>
                  <th
                    class="
                      px-4
                      py-3
                      text-left text-xs
                      font-medium
                      text-gray-500
                      dark:text-gray-400
                      uppercase
                    "
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody
                class="
                  bg-white
                  dark:bg-gray-875
                  divide-y divide-gray-200
                  dark:divide-gray-700
                "
              >
                <tr v-for="payment in paymentHistory" :key="payment.name">
                  <td class="px-4 py-3 text-sm dark:text-gray-100">
                    {{ formatDate(payment.date) }}
                  </td>
                  <td class="px-4 py-3 text-sm dark:text-gray-100">
                    {{ payment.expectedAmount?.toFixed(2) || '0.00' }} €
                  </td>
                  <td class="px-4 py-3 text-sm dark:text-gray-100">
                    {{ payment.paidAmount?.toFixed(2) || '0.00' }} €
                  </td>
                  <td class="px-4 py-3 text-sm">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="{
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                          payment.status === 'Korrekt',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                          payment.status === 'Fehlerhaft',
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200':
                          payment.status === 'Fehlend',
                      }"
                    >
                      {{ payment.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-12">
            <feather-icon
              name="clock"
              class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4"
            />
            <p class="text-gray-600 dark:text-gray-400">
              Noch keine Zahlungshistorie vorhanden
            </p>
          </div>
        </div>
      </div>

      <!-- Notizen Tab -->
      <div v-if="activeTab === 'notes'" class="max-w-4xl mx-auto">
        <div
          class="
            bg-white
            dark:bg-gray-850
            rounded-lg
            border
            dark:border-gray-800
            p-6
          "
        >
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Notizen
          </h3>
          <textarea
            v-model="editData.notes"
            :disabled="!isEditing"
            rows="12"
            class="
              w-full
              p-3
              border border-gray-300
              dark:border-gray-700
              rounded
              bg-white
              dark:bg-gray-900 dark:text-gray-100
              disabled:bg-gray-50
              dark:disabled:bg-gray-800
            "
            placeholder="Notizen zum Kunden..."
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Contract Viewer Modal -->
    <InvoiceViewer
      v-if="selectedContract"
      :show="showContractViewer"
      :document-path="selectedContract.documentPath"
      :document-name="selectedContract.documentName"
      @close="showContractViewer = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { fyo } from 'src/initFyo';
import { showToast } from 'src/utils/interactive';
import InvoiceViewer from 'src/components/InvoiceViewer.vue';

const router = useRouter();
const route = useRoute();

const customerName = ref(route.params.name as string);
const customerDoc = ref<any>(null);
const isEditing = ref(false);
const activeTab = ref('overview');
const paymentHistory = ref<any[]>([]);
const contractInput = ref<HTMLInputElement | null>(null);
const uploadedFile = ref<File | null>(null);
const uploadedFileBase64 = ref<string>('');
const showContractViewer = ref(false);
const selectedContract = ref<{
  documentPath: string;
  documentName: string;
} | null>(null);

const editData = ref({
  name: '',
  status: 'Aktiv',
  email: '',
  phone: '',
  monthlyAmount: 0,
  contractStartDate: '',
  contractInterval: 'Monatlich',
  noticePeriod: '',
  contractDocument: '',
  notes: '',
});

const tabs = [
  { id: 'overview', label: 'Übersicht' },
  { id: 'contract', label: 'Vertrag' },
  { id: 'history', label: 'Zahlungshistorie' },
  { id: 'notes', label: 'Notizen' },
];

const statusClass = computed(() => {
  const status = customerDoc.value?.status || 'Aktiv';
  switch (status) {
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
});

onMounted(async () => {
  await loadCustomer();
  await loadPaymentHistory();
});

async function loadCustomer() {
  try {
    customerDoc.value = await fyo.doc.getDoc(
      'SubscriptionCustomer',
      customerName.value
    );

    // Initialize editData
    editData.value = {
      name: customerDoc.value.name || '',
      status: customerDoc.value.status || 'Aktiv',
      email: customerDoc.value.email || '',
      phone: customerDoc.value.phone || '',
      monthlyAmount: customerDoc.value.monthlyAmount || 0,
      contractStartDate: customerDoc.value.contractStartDate || '',
      contractInterval: customerDoc.value.contractInterval || 'Monatlich',
      noticePeriod: customerDoc.value.noticePeriod || '',
      contractDocument: customerDoc.value.contractDocument || '',
      notes: customerDoc.value.notes || '',
    };
  } catch (error) {
    console.error('Error loading customer:', error);
    showToast({
      message: 'Fehler beim Laden des Kunden',
      type: 'error',
    });
  }
}

async function loadPaymentHistory() {
  try {
    // TODO: Load from PaymentHistory schema when implemented
    // For now, show empty
    paymentHistory.value = [];
  } catch (error) {
    console.error('Error loading payment history:', error);
  }
}

async function saveCustomer() {
  try {
    // Update all fields except contractDocument (handled separately)
    for (const [key, value] of Object.entries(editData.value)) {
      if (key !== 'name' && key !== 'contractDocument') {
        // name is the primary key, contractDocument handled separately
        await customerDoc.value.set(key, value);
      }
    }

    // Handle PDF upload with Base64 storage
    console.log('=== SAVE CONTRACT DEBUG ===');
    console.log('uploadedFile.value:', !!uploadedFile.value);
    console.log('uploadedFileBase64.value length:', uploadedFileBase64.value?.length || 0);
    console.log('editData.value.contractDocument length:', editData.value.contractDocument?.length || 0);

    if (uploadedFile.value && uploadedFileBase64.value) {
      console.log('Saving NEW uploaded contract');
      await customerDoc.value.set('contractDocument', uploadedFileBase64.value);
      await customerDoc.value.set('contractFileName', uploadedFile.value.name);
      console.log(
        'Set contractDocument with base64 data and filename:',
        uploadedFile.value.name,
        'Data length:', uploadedFileBase64.value.length,
        'Starts with:', uploadedFileBase64.value.substring(0, 20)
      );

      // Clear the upload state after saving
      uploadedFile.value = null;
      uploadedFileBase64.value = '';
    } else if (editData.value.contractDocument && !uploadedFile.value) {
      console.log('Keeping existing contract document');
      await customerDoc.value.set('contractDocument', editData.value.contractDocument);
    } else {
      console.log('No contract document to save');
    }

    await customerDoc.value.sync();

    isEditing.value = false;

    // Reload customer data to ensure we have the correct saved data
    await loadCustomer();

    showToast({
      message: 'Kunde erfolgreich gespeichert!',
      type: 'success',
    });
  } catch (error) {
    console.error('Error saving customer:', error);
    showToast({
      message: `Fehler beim Speichern: ${
        error instanceof Error ? error.message : String(error)
      }`,
      type: 'error',
    });
  }
}

function cancelEdit() {
  isEditing.value = false;
  // Reset editData to original values
  editData.value = {
    name: customerDoc.value.name || '',
    status: customerDoc.value.status || 'Aktiv',
    email: customerDoc.value.email || '',
    phone: customerDoc.value.phone || '',
    monthlyAmount: customerDoc.value.monthlyAmount || 0,
    contractStartDate: customerDoc.value.contractStartDate || '',
    contractInterval: customerDoc.value.contractInterval || 'Monatlich',
    noticePeriod: customerDoc.value.noticePeriod || '',
    contractDocument: customerDoc.value.contractDocument || '',
    notes: customerDoc.value.notes || '',
  };
}

async function handleContractUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.type === 'application/pdf') {
      try {
        console.log('=== CONTRACT UPLOAD DEBUG ===');
        console.log('Starting upload for file:', file.name, 'Size:', file.size);

        uploadedFile.value = file;
        // Convert to base64 for storage
        uploadedFileBase64.value = await convertFileToBase64(file);

        console.log('Base64 conversion completed. Length:', uploadedFileBase64.value.length);
        console.log('Base64 starts with:', uploadedFileBase64.value.substring(0, 50));
        console.log('Base64 is valid PDF?', uploadedFileBase64.value.startsWith('JVBERi0'));

        // Don't set editData.value.contractDocument here - it will be handled in saveCustomer
        console.log('File prepared for upload. Call saveCustomer to persist.');

        showToast({
          message: 'Vertragsdokument erfolgreich hochgeladen! Speichere den Kunden um die Änderungen zu übernehmen.',
          type: 'success',
        });
      } catch (error: any) {
        console.error('Error converting PDF:', error);
        showToast({
          message: `Fehler beim Verarbeiten der PDF: ${error.message}`,
          type: 'error',
        });
        uploadedFile.value = null;
        uploadedFileBase64.value = '';
        target.value = '';
      }
    } else {
      showToast({
        message: 'Nur PDF-Dateien sind erlaubt.',
        type: 'error',
      });
      target.value = '';
    }
  }
}

function removeContract() {
  editData.value.contractDocument = '';
  uploadedFile.value = null;
  uploadedFileBase64.value = '';
  if (contractInput.value) {
    contractInput.value.value = '';
  }
}

// Temporary function to clear corrupted contract data
async function clearCorruptedContract() {
  try {
    console.log('Clearing corrupted contract data...');
    await customerDoc.value.set('contractDocument', '');
    await customerDoc.value.set('contractFileName', '');
    await customerDoc.value.sync();

    // Update local state
    editData.value.contractDocument = '';
    uploadedFile.value = null;
    uploadedFileBase64.value = '';

    console.log('Corrupted contract data cleared successfully');
    showToast({
      message: 'Vertragsdaten wurden zurückgesetzt. Sie können jetzt einen neuen Vertrag hochladen.',
      type: 'success',
    });

    // Reload customer data
    await loadCustomer();
  } catch (error: any) {
    console.error('Error clearing contract:', error);
    showToast({
      message: 'Fehler beim Zurücksetzen der Vertragsdaten.',
      type: 'error',
    });
  }
}

function downloadContract() {
  if (!customerDoc.value?.contractDocument) {
    showToast({
      message: 'Kein Vertragsdokument verfügbar.',
      type: 'error',
    });
    return;
  }

  try {
    const fileName =
      customerDoc.value.contractFileName ||
      `Vertrag_${customerDoc.value.name}.pdf`;

    console.log('=== CONTRACT DOWNLOAD DEBUG ===');
    console.log('Downloading contract:', fileName);
    console.log('Contract data starts with:', customerDoc.value.contractDocument.substring(0, 100));
    console.log('Contract data length:', customerDoc.value.contractDocument.length);
    console.log('Is valid base64 start?', customerDoc.value.contractDocument.startsWith('JVBERi0'));
    console.log('Has data prefix?', customerDoc.value.contractDocument.startsWith('data:'));

    // Test if the data is actually valid PDF base64
    const testDataUrl = customerDoc.value.contractDocument.startsWith('data:')
      ? customerDoc.value.contractDocument
      : `data:application/pdf;base64,${customerDoc.value.contractDocument}`;

    console.log('Created data URL length:', testDataUrl.length);
    console.log('Data URL starts with:', testDataUrl.substring(0, 100));

    // Try to create a blob to test if the data is valid
    try {
      const response = fetch(testDataUrl);
      console.log('Data URL is fetchable');
    } catch (e) {
      console.error('Data URL is not valid:', e);
    }

    // Use the exact same method as RecurringExpensesList
    downloadPDFDirectly(customerDoc.value.contractDocument, fileName);

    showToast({
      message: 'Download-Versuch gestartet - prüfe Browser-Downloads!',
      type: 'success',
    });
  } catch (error: any) {
    console.error('Error downloading contract:', error);
    showToast({
      message: 'Fehler beim Herunterladen des Vertrags.',
      type: 'error',
    });
  }
}

function getFileName(path: string): string {
  if (!path) return '';
  return path.split('/').pop() || path;
}

function getContractDisplayName(): string {
  if (!customerDoc.value) return '';

  // If we have a filename stored, use that
  if (customerDoc.value.contractFileName) {
    return customerDoc.value.contractFileName;
  }

  // If contract document is just a filename (legacy data), use that
  if (customerDoc.value.contractDocument &&
      !customerDoc.value.contractDocument.startsWith('JVBERi0') &&
      !customerDoc.value.contractDocument.startsWith('data:') &&
      customerDoc.value.contractDocument.length < 100) {
    return customerDoc.value.contractDocument;
  }

  // For base64 data without filename, generate a name
  return `Vertrag_${customerDoc.value.name}.pdf`;
}

function formatDate(date: any): string {
  if (!date) return 'Noch nie';
  const d = new Date(date);
  return d.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function goBack() {
  router.push('/customers');
}

function viewContract() {
  if (!customerDoc.value?.contractDocument) {
    showToast({
      message: 'Kein Vertragsdokument verfügbar.',
      type: 'error',
    });
    return;
  }

  console.log('Viewing contract for customer:', customerDoc.value.name);
  console.log(
    'Contract data length:',
    customerDoc.value.contractDocument.length
  );

  // Check if it's base64 data
  if (
    customerDoc.value.contractDocument.startsWith('JVBERi0') ||
    customerDoc.value.contractDocument.startsWith('data:')
  ) {
    // Check size first
    const sizeInMB =
      (customerDoc.value.contractDocument.length * 0.75) / (1024 * 1024);
    console.log(`Contract PDF size: approximately ${sizeInMB.toFixed(2)} MB`);

    if (sizeInMB > 5) {
      // For large files, offer direct download instead of viewing
      const confirmDownload = confirm(
        `Dieser Vertrag ist sehr groß (ca. ${sizeInMB.toFixed(
          1
        )} MB).\n\nMöchten Sie ihn direkt herunterladen anstatt zu versuchen ihn anzuzeigen?`
      );
      if (confirmDownload) {
        const fileName =
          customerDoc.value.contractFileName ||
          `Vertrag_${customerDoc.value.name}.pdf`;
        downloadPDFDirectly(customerDoc.value.contractDocument, fileName);
        return;
      }
    }

    console.log('Opening contract viewer for base64 data');
    selectedContract.value = {
      documentPath: customerDoc.value.contractDocument,
      documentName:
        customerDoc.value.contractFileName ||
        `Vertrag_${customerDoc.value.name}`,
    };
    showContractViewer.value = true;
  } else {
    // It's just a filename, show a message
    console.log('Detected filename only:', customerDoc.value.contractDocument);
    showToast({
      message: `Vertragsdokument: ${customerDoc.value.contractDocument}\n\nDieses Dokument wurde als Dateiname gespeichert und kann nicht angezeigt werden.\nUm Verträge anzeigen zu können, bearbeiten Sie den Kunden und laden Sie die PDF-Datei erneut hoch.`,
      type: 'info',
    });
  }
}

// Direct PDF download function - exact copy from RecurringExpensesList
function downloadPDFDirectly(base64Data: string, filename: string) {
  try {
    console.log('Starting direct PDF download');
    // Create data URL
    const dataUrl = base64Data.startsWith('data:') ? base64Data : `data:application/pdf;base64,${base64Data}`;
    // Create download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.style.display = 'none';
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('PDF download initiated');
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('Fehler beim Herunterladen der PDF-Datei.');
  }
}

// Convert file to base64
function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(
      `Converting contract PDF to base64. File size: ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)} MB`
    );

    // Check file size before processing
    const maxSizeInMB = 10;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      reject(
        new Error(
          `Die PDF-Datei ist zu groß (${(file.size / 1024 / 1024).toFixed(
            1
          )} MB). Maximale Größe: ${maxSizeInMB} MB.`
        )
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        // Remove the data:application/pdf;base64, prefix to store only the base64 string
        const base64String = (reader.result as string).split(',')[1];
        const estimatedSizeInMB = (base64String.length * 0.75) / (1024 * 1024);
        console.log(
          `Base64 conversion complete. Estimated size: ${estimatedSizeInMB.toFixed(
            2
          )} MB`
        );
        resolve(base64String);
      } else {
        reject(new Error('Fehler beim Lesen der Datei'));
      }
    };

    reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'));
    reader.readAsDataURL(file);
  });
}
</script>
