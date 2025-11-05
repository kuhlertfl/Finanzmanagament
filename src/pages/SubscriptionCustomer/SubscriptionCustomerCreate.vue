<template>
  <div class="flex flex-col h-full overflow-hidden bg-white dark:bg-gray-875">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b dark:border-gray-800">
      <div class="flex items-center gap-4">
        <button
          @click="goBack"
          class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <feather-icon name="arrow-left" class="w-5 h-5" />
        </button>
        <h1 class="text-2xl font-semibold dark:text-gray-100">Neuer Kunde</h1>
      </div>
      <div class="flex gap-3">
        <button
          @click="resetForm"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Formular leeren
        </button>
        <button
          @click="saveCustomer"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Speichern
        </button>
        <button
          @click="saveAndNew"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Speichern & Neu
        </button>
      </div>
    </div>

    <!-- Form Content -->
    <div class="flex-1 overflow-auto p-6">
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Stammdaten -->
        <div class="bg-white dark:bg-gray-850 rounded-lg border dark:border-gray-800 p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Stammdaten
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name *
              </label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="Peter Muffin"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                v-model="formData.status"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              >
                <option value="Aktiv">Aktiv</option>
                <option value="Gefährdet">Gefährdet</option>
                <option value="Inaktiv">Inaktiv</option>
                <option value="Gekündigt">Gekündigt</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kundengruppe
              </label>
              <select
                v-model="formData.customerGroup"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              >
                <option value="">Keine Gruppe</option>
                <option
                  v-for="group in availableGroups"
                  :key="group.name"
                  :value="group.name"
                >
                  {{ group.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monatlicher Betrag (€) *
              </label>
              <input
                v-model.number="formData.monthlyAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        <!-- Kontaktdaten -->
        <div class="bg-white dark:bg-gray-850 rounded-lg border dark:border-gray-800 p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Kontaktdaten
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                v-model="formData.email"
                type="email"
                placeholder="peter.muffin@example.com"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefon
              </label>
              <input
                v-model="formData.phone"
                type="text"
                placeholder="+49 123 456789"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        <!-- Vertragsinformationen -->
        <div class="bg-white dark:bg-gray-850 rounded-lg border dark:border-gray-800 p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Vertragsinformationen
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vertragsbeginn
              </label>
              <input
                v-model="formData.contractStartDate"
                type="date"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vertragslaufzeit
              </label>
              <select
                v-model="formData.contractInterval"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              >
                <option value="Monatlich">Monatlich</option>
                <option value="Jährlich">Jährlich</option>
                <option value="Individuell">Individuell</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kündigungsfrist
              </label>
              <input
                v-model="formData.noticePeriod"
                type="text"
                placeholder="z.B. 1 Monat zum Monatsende"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vertrag (PDF/Dokument)
              </label>

              <!-- File Upload -->
              <div v-if="!uploadedFile" class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                <feather-icon name="upload" class="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Vertrag hier ablegen oder klicken zum Auswählen
                </p>
                <input
                  ref="fileInput"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  class="hidden"
                  @change="handleFileUpload"
                />
                <button
                  @click="$refs.fileInput.click()"
                  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Datei auswählen
                </button>
              </div>

              <!-- Uploaded File Display -->
              <div v-else class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded border dark:border-gray-700">
                <div class="flex items-center gap-3">
                  <feather-icon name="file-text" class="w-8 h-8 text-blue-600" />
                  <div>
                    <p class="font-medium dark:text-gray-100">{{ uploadedFile.name }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatFileSize(uploadedFile.size) }}</p>
                  </div>
                </div>
                <button
                  @click="removeFile"
                  class="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                >
                  <feather-icon name="trash-2" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notizen -->
        <div class="bg-white dark:bg-gray-850 rounded-lg border dark:border-gray-800 p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Notizen
          </h3>
          <textarea
            v-model="formData.notes"
            rows="6"
            class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
            placeholder="Notizen zum Kunden..."
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fyo } from 'src/initFyo';
import { showToast } from 'src/utils/interactive';

const router = useRouter();

const formData = ref({
  name: '',
  status: 'Aktiv',
  email: '',
  phone: '',
  monthlyAmount: 0,
  customerGroup: '',
  contractStartDate: '',
  contractInterval: 'Monatlich',
  noticePeriod: '',
  contractDocument: '',
  contractFileName: '',
  notes: '',
});

// Function to reset form to initial state
function resetForm() {
  formData.value = {
    name: '',
    status: 'Aktiv',
    email: '',
    phone: '',
    monthlyAmount: 0,
    customerGroup: '',
    contractStartDate: '',
    contractInterval: 'Monatlich',
    noticePeriod: '',
    contractDocument: '',
    contractFileName: '',
    notes: '',
  };

  // Also reset file upload
  uploadedFile.value = null;
  uploadedFileBase64.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

const availableGroups = ref([]);

const uploadedFile = ref<File | null>(null);
const uploadedFileBase64 = ref<string>('');
const fileInput = ref<HTMLInputElement | null>(null);

onMounted(async () => {
  // Reset form when component is mounted (ensures clean form)
  resetForm();
  await loadAvailableGroups();
});

async function loadAvailableGroups() {
  try {
    const groups = await fyo.db.getAll('CustomerGroup', {
      fields: ['name'],
      orderBy: 'name'
    });
    availableGroups.value = groups;
  } catch (error) {
    console.error('Error loading customer groups:', error);
  }
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.type === 'application/pdf') {
      try {
        console.log('=== CONTRACT UPLOAD DEBUG (CREATE) ===');
        console.log('Starting upload for file:', file.name, 'Size:', file.size);

        uploadedFile.value = file;
        // Convert to base64 for storage
        uploadedFileBase64.value = await convertFileToBase64(file);

        console.log('Base64 conversion completed. Length:', uploadedFileBase64.value.length);
        console.log('Base64 starts with:', uploadedFileBase64.value.substring(0, 50));
        console.log('Base64 is valid PDF?', uploadedFileBase64.value.startsWith('JVBERi0'));

        formData.value.contractDocument = uploadedFileBase64.value;
        formData.value.contractFileName = file.name;

        showToast({
          message: 'Vertragsdokument erfolgreich hochgeladen!',
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

function removeFile() {
  uploadedFile.value = null;
  uploadedFileBase64.value = '';
  formData.value.contractDocument = '';
  formData.value.contractFileName = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

// Convert file to base64 - same as in SubscriptionCustomerDetail
function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`Converting contract PDF to base64. File size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

    // Check file size before processing
    const maxSizeInMB = 10;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      reject(new Error(`Die PDF-Datei ist zu groß (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximale Größe: ${maxSizeInMB} MB.`));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        // Remove the data:application/pdf;base64, prefix to store only the base64 string
        const base64String = (reader.result as string).split(',')[1];
        const estimatedSizeInMB = (base64String.length * 0.75) / (1024 * 1024);
        console.log(`Base64 conversion complete. Estimated size: ${estimatedSizeInMB.toFixed(2)} MB`);
        resolve(base64String);
      } else {
        reject(new Error('Fehler beim Lesen der Datei'));
      }
    };

    reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'));
    reader.readAsDataURL(file);
  });
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

async function saveCustomer() {
  // Validate required fields and show specific error messages
  const missingFields: string[] = [];

  if (!formData.value.name || formData.value.name.trim() === '') {
    missingFields.push('Name');
  }

  if (!formData.value.monthlyAmount || formData.value.monthlyAmount <= 0) {
    missingFields.push('Monatlicher Betrag');
  }

  if (missingFields.length > 0) {
    const fieldsList = missingFields.join(', ');
    showToast({
      message: `Bitte folgende Pflichtfelder ausfüllen: ${fieldsList}`,
      type: 'error',
    });
    return;
  }

  try {
    const doc = fyo.doc.getNewDoc('SubscriptionCustomer');

    // Set all fields
    await doc.set('name', formData.value.name);
    await doc.set('status', formData.value.status);
    await doc.set('email', formData.value.email);
    await doc.set('phone', formData.value.phone);
    await doc.set('monthlyAmount', formData.value.monthlyAmount);

    if (formData.value.customerGroup) {
      await doc.set('customerGroup', formData.value.customerGroup);
    }

    if (formData.value.contractStartDate) {
      await doc.set('contractStartDate', formData.value.contractStartDate);
    }
    await doc.set('contractInterval', formData.value.contractInterval);
    if (formData.value.noticePeriod) {
      await doc.set('noticePeriod', formData.value.noticePeriod);
    }
    // Handle contract document (base64 data) and filename
    if (formData.value.contractDocument) {
      await doc.set('contractDocument', formData.value.contractDocument);
    }
    if (formData.value.contractFileName) {
      await doc.set('contractFileName', formData.value.contractFileName);
    }
    if (formData.value.notes) {
      await doc.set('notes', formData.value.notes);
    }

    // Set createdAt to current datetime
    await doc.set('createdAt', new Date().toISOString());

    await doc.sync();

    showToast({
      message: 'Kunde erfolgreich erstellt!',
      type: 'success',
    });

    // Reset form for next customer
    resetForm();

    // Navigate to customer list
    router.push('/customers');
  } catch (error) {
    console.error('Error creating customer:', error);
    showToast({
      message: `Fehler beim Erstellen: ${error instanceof Error ? error.message : String(error)}`,
      type: 'error',
    });
  }
}

async function saveAndNew() {
  // Validate required fields
  const missingFields: string[] = [];
  if (!formData.value.name || formData.value.name.trim() === '') {
    missingFields.push('Name');
  }
  if (!formData.value.monthlyAmount || formData.value.monthlyAmount <= 0) {
    missingFields.push('Monatlicher Betrag');
  }
  if (missingFields.length > 0) {
    const fieldsList = missingFields.join(', ');
    showToast({
      message: `Bitte folgende Pflichtfelder ausfüllen: ${fieldsList}`,
      type: 'error',
    });
    return;
  }

  try {
    const doc = fyo.doc.getNewDoc('SubscriptionCustomer');

    // Set all fields (same as saveCustomer)
    await doc.set('name', formData.value.name);
    await doc.set('status', formData.value.status);
    await doc.set('email', formData.value.email);
    await doc.set('phone', formData.value.phone);
    await doc.set('monthlyAmount', formData.value.monthlyAmount);

    if (formData.value.customerGroup) {
      await doc.set('customerGroup', formData.value.customerGroup);
    }
    if (formData.value.contractStartDate) {
      await doc.set('contractStartDate', formData.value.contractStartDate);
    }
    await doc.set('contractInterval', formData.value.contractInterval);
    if (formData.value.noticePeriod) {
      await doc.set('noticePeriod', formData.value.noticePeriod);
    }
    // Handle contract document (base64 data) and filename
    if (formData.value.contractDocument) {
      await doc.set('contractDocument', formData.value.contractDocument);
    }
    if (formData.value.contractFileName) {
      await doc.set('contractFileName', formData.value.contractFileName);
    }
    if (formData.value.notes) {
      await doc.set('notes', formData.value.notes);
    }

    // Set createdAt to current datetime
    await doc.set('createdAt', new Date().toISOString());

    await doc.sync();

    showToast({
      message: 'Kunde erfolgreich erstellt! Formular wurde für neuen Kunden geleert.',
      type: 'success',
    });

    // Reset form for next customer but stay on the page
    resetForm();

  } catch (error) {
    console.error('Error creating customer:', error);
    showToast({
      message: `Fehler beim Erstellen: ${error instanceof Error ? error.message : String(error)}`,
      type: 'error',
    });
  }
}

function goBack() {
  router.push('/customers');
}
</script>
