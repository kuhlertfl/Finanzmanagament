<template>
  <div class="flex flex-col h-full overflow-hidden bg-white dark:bg-gray-875">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b dark:border-gray-800">
      <div>
        <h1 class="text-2xl font-semibold dark:text-gray-100">Wiederkehrende Zahlungen</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ expenses.length }} {{ expenses.length === 1 ? 'Zahlung' : 'Zahlungen' }}
        </p>
      </div>
      <button
        @click="showAddForm = true"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
      >
        <feather-icon name="plus" class="w-4 h-4" />
        Neue Zahlung
      </button>
    </div>

    <!-- Add Form Modal -->
    <div
      v-if="showAddForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white dark:bg-gray-850 rounded-lg w-full max-w-2xl h-full max-h-[80vh] flex flex-col">
        <!-- Header -->
        <div class="p-6 pb-0 flex-shrink-0">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            Neue wiederkehrende Zahlung
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
                placeholder="z.B. Miete Büro"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <!-- Betrag und Frequenz nebeneinander -->
            <div class="grid grid-cols-2 gap-4">
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

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Frequenz *
                </label>
                <select
                  v-model="newExpense.frequency"
                  class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
                >
                  <option value="">Frequenz wählen</option>
                  <option value="Wöchentlich">Wöchentlich</option>
                  <option value="Monatlich">Monatlich</option>
                  <option value="Jährlich">Jährlich</option>
                </select>
              </div>
            </div>

            <!-- Kategorie und Anbieter -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kategorie
                </label>
                <select
                  v-model="newExpense.category"
                  class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
                >
                  <option value="">Kategorie wählen</option>
                  <option value="Miete">Miete</option>
                  <option value="Versicherung">Versicherung</option>
                  <option value="Software/Abos">Software/Abos</option>
                  <option value="Strom/Gas/Wasser">Strom/Gas/Wasser</option>
                  <option value="Internet/Telefon">Internet/Telefon</option>
                  <option value="Sonstige">Sonstige</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Anbieter/Firma
                </label>
                <input
                  v-model="newExpense.supplier"
                  type="text"
                  placeholder="z.B. Stadtwerke GmbH"
                  class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <!-- Nächste Zahlung -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nächste Zahlung
              </label>
              <input
                v-model="newExpense.nextPaymentDate"
                type="date"
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
                  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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

            <!-- Beschreibung -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Beschreibung *
              </label>
              <input
                v-model="newExpense.description"
                type="text"
                placeholder="Beschreibung der Zahlung"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
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
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              :disabled="!isFormValid"
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Form Modal -->
    <div
      v-if="showEditForm && editingExpense"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white dark:bg-gray-850 rounded-lg w-full max-w-2xl h-full max-h-[80vh] flex flex-col">
        <!-- Header -->
        <div class="p-6 pb-0 flex-shrink-0">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            Zahlung bearbeiten
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
                v-model="editingExpense.name"
                type="text"
                placeholder="z.B. Miete Büro"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <!-- Betrag -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Betrag (€) *
              </label>
              <input
                v-model.number="editingExpense.amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <!-- Frequenz -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Frequenz *
              </label>
              <select
                v-model="editingExpense.frequency"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              >
                <option value="">Frequenz wählen</option>
                <option value="Wöchentlich">Wöchentlich</option>
                <option value="Monatlich">Monatlich</option>
                <option value="Jährlich">Jährlich</option>
              </select>
            </div>

            <!-- Kategorie -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kategorie
              </label>
              <select
                v-model="editingExpense.category"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              >
                <option value="">Kategorie wählen</option>
                <option value="Miete">Miete</option>
                <option value="Versicherung">Versicherung</option>
                <option value="Software/Abos">Software/Abos</option>
                <option value="Strom/Gas/Wasser">Strom/Gas/Wasser</option>
                <option value="Internet/Telefon">Internet/Telefon</option>
                <option value="Sonstige">Sonstige</option>
              </select>
            </div>

            <!-- Anbieter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Anbieter/Firma
              </label>
              <input
                v-model="editingExpense.supplier"
                type="text"
                placeholder="z.B. Stadtwerke GmbH"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <!-- Nächste Zahlung -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nächste Zahlung
              </label>
              <input
                v-model="editingExpense.nextPaymentDate"
                type="date"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <!-- Beschreibung -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Beschreibung *
              </label>
              <input
                v-model="editingExpense.description"
                type="text"
                placeholder="Beschreibung der Zahlung"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              />
            </div>

            <!-- Notizen -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notizen
              </label>
              <textarea
                v-model="editingExpense.notes"
                rows="3"
                class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
                placeholder="Zusätzliche Informationen..."
              ></textarea>
            </div>

            <!-- Current PDF Display -->
            <div v-if="editingExpense.invoiceDocument">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Aktuelle Rechnung
              </label>
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded border dark:border-gray-700">
                <div class="flex items-center gap-3">
                  <feather-icon name="file-text" class="w-6 h-6 text-red-600" />
                  <div>
                    <p class="font-medium dark:text-gray-100">{{ editingExpense.invoiceDocument }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Aktuelle Rechnung</p>
                  </div>
                </div>
                <button
                  @click="removeCurrentPdf"
                  class="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                >
                  <feather-icon name="trash-2" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- New PDF Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ editingExpense.invoiceDocument ? 'Neue Rechnung hochladen (optional)' : 'Rechnung (PDF)' }}
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
                  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
          </div>
        </div>

        <!-- Footer Buttons -->
        <div class="p-6 pt-0 flex-shrink-0 border-t dark:border-gray-700">
          <div class="flex justify-end gap-3">
            <button
              @click="cancelEdit"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Abbrechen
            </button>
            <button
              @click="updateExpense"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              :disabled="!isEditFormValid"
            >
              Aktualisieren
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
            <p class="text-sm text-gray-600 dark:text-gray-400">Aktive Zahlungen</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ activeCount }}</p>
          </div>
          <div class="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-850 rounded-lg p-4 border dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Monatlich</p>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ monthlyTotal.toFixed(2) }} €</p>
          </div>
          <div class="w-2 h-2 rounded-full bg-blue-500"></div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-850 rounded-lg p-4 border dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Jährlich</p>
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ yearlyTotal.toFixed(2) }} €</p>
          </div>
          <div class="w-2 h-2 rounded-full bg-purple-500"></div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-850 rounded-lg p-4 border dark:border-gray-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Nächste Zahlung</p>
            <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ nextPaymentDays }} Tage</p>
          </div>
          <div class="w-2 h-2 rounded-full bg-orange-500"></div>
        </div>
      </div>
    </div>

    <!-- Expenses List -->
    <div class="flex-1 overflow-auto p-6">
      <div v-if="expenses.length === 0" class="text-center py-12">
        <feather-icon name="credit-card" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
        <p class="text-gray-600 dark:text-gray-400 text-lg">Keine wiederkehrenden Zahlungen</p>
        <p class="text-gray-500 dark:text-gray-500 mt-2">Klicken Sie auf "Neue Zahlung" um zu beginnen</p>
      </div>

      <div v-else class="bg-white dark:bg-gray-850 rounded-lg border dark:border-gray-800 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Frequenz
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Betrag
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kategorie
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nächste Zahlung
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-875 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="expense in expenses"
              :key="expense.name"
              class="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ expense.name }}
                </div>
                <div v-if="expense.supplier" class="text-sm text-gray-500 dark:text-gray-400">
                  {{ expense.supplier }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {{ expense.frequency }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ expense.amount?.toFixed(2) || '0.00' }} €
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="expense.category" class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {{ expense.category }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(expense.nextPaymentDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <button
                    v-if="expense.invoiceDocument"
                    @click="viewInvoice(expense)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                    title="Rechnung anzeigen"
                  >
                    <feather-icon name="file-text" class="w-4 h-4" />
                  </button>
                  <button
                    @click="editExpense(expense)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                    title="Zahlung bearbeiten"
                  >
                    <feather-icon name="edit" class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteExpense(expense)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                    title="Zahlung löschen"
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

    <!-- Invoice Viewer Modal -->
    <InvoiceViewer
      :show="showInvoiceViewer"
      :document-path="selectedInvoice.documentPath"
      :document-name="selectedInvoice.documentName"
      @close="showInvoiceViewer = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated } from 'vue';
import { fyo } from 'src/initFyo';
import InvoiceViewer from 'src/components/InvoiceViewer.vue';

const expenses = ref<any[]>([]);
const showAddForm = ref(false);
const showEditForm = ref(false);
const editingExpense = ref<any>(null);

const newExpense = ref({
  name: '',
  amount: 0,
  frequency: '',
  category: '',
  description: '',
  supplier: '',
  nextPaymentDate: '',
  notes: '',
  invoiceDocument: '',
  isActive: 'true',
});

const uploadedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Invoice Viewer
const showInvoiceViewer = ref(false);
const selectedInvoice = ref({
  documentPath: '',
  documentName: ''
});

const isFormValid = computed(() => {
  return newExpense.value.name.trim() !== '' &&
         newExpense.value.amount > 0 &&
         newExpense.value.frequency !== '' &&
         newExpense.value.description.trim() !== '';
});

const isEditFormValid = computed(() => {
  if (!editingExpense.value) return false;
  return editingExpense.value.name?.trim() !== '' &&
         editingExpense.value.amount > 0 &&
         editingExpense.value.frequency !== '' &&
         editingExpense.value.description?.trim() !== '';
});

const activeCount = computed(() => {
  return expenses.value.filter(e => e.isActive !== 'false').length;
});

const monthlyTotal = computed(() => {
  return expenses.value
    .filter(e => e.isActive !== 'false')
    .reduce((sum, expense) => {
      const amount = expense.amount || 0;
      switch (expense.frequency) {
        case 'Wöchentlich': return sum + (amount * 4.33);
        case 'Monatlich': return sum + amount;
        case 'Jährlich': return sum + (amount / 12);
        default: return sum;
      }
    }, 0);
});

const yearlyTotal = computed(() => {
  return monthlyTotal.value * 12;
});

const nextPaymentDays = computed(() => {
  const activeExpenses = expenses.value.filter(e => e.isActive !== 'false' && e.nextPaymentDate);
  if (activeExpenses.length === 0) return 0;

  const dates = activeExpenses.map(e => new Date(e.nextPaymentDate));
  const nextDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const today = new Date();
  const diffTime = nextDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
});

onMounted(async () => {
  await loadExpenses();
});

onActivated(async () => {
  await loadExpenses();
});

async function loadExpenses() {
  try {
    console.log('Loading recurring expenses...');
    const data = await fyo.db.getAll('RecurringExpense', {
      fields: ['name', 'amount', 'frequency', 'description', 'category', 'supplier', 'nextPaymentDate', 'isActive', 'invoiceDocument', 'notes'],
    });
    console.log('Loaded expenses:', data);
    expenses.value = data || [];
  } catch (error) {
    console.error('Error loading expenses:', error);
    console.error('Error details:', error.message, error.stack);
    expenses.value = [];
  }
}

async function saveExpense() {
  if (!isFormValid.value) return;

  try {
    console.log('Creating new RecurringExpense...');
    console.log('Form data:', newExpense.value);

    const doc = fyo.doc.getNewDoc('RecurringExpense');

    const timestamp = Date.now();
    const uniqueName = `RE-${timestamp}`;

    await doc.set('name', uniqueName);
    await doc.set('amount', newExpense.value.amount);
    await doc.set('frequency', newExpense.value.frequency);
    await doc.set('description', newExpense.value.description);
    await doc.set('isActive', newExpense.value.isActive);

    if (newExpense.value.category) {
      await doc.set('category', newExpense.value.category);
    }
    if (newExpense.value.supplier) {
      await doc.set('supplier', newExpense.value.supplier);
    }
    if (newExpense.value.nextPaymentDate) {
      await doc.set('nextPaymentDate', newExpense.value.nextPaymentDate);
    }
    if (newExpense.value.notes) {
      await doc.set('notes', newExpense.value.notes);
    }
    if (newExpense.value.invoiceDocument) {
      await doc.set('invoiceDocument', newExpense.value.invoiceDocument);
    }

    await doc.sync();
    console.log('Expense saved successfully');

    await loadExpenses();
    cancelAdd();

    alert('Wiederkehrende Zahlung erfolgreich gespeichert!');
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
    frequency: '',
    category: '',
    description: '',
    supplier: '',
    nextPaymentDate: '',
    notes: '',
    invoiceDocument: '',
    isActive: 'true',
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
    newExpense.value.invoiceDocument = target.files[0].name;
  }
}

function removeFile() {
  uploadedFile.value = null;
  newExpense.value.invoiceDocument = '';
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
  const confirmed = confirm(`Möchten Sie die Zahlung "${expense.name}" wirklich löschen?\n\nDiese Aktion kann nicht rückgängig gemacht werden.`);

  if (!confirmed) return;

  try {
    const doc = await fyo.doc.getDoc('RecurringExpense', expense.name);
    await doc.delete();

    await loadExpenses();
    alert('Zahlung erfolgreich gelöscht.');
  } catch (error) {
    console.error('Error deleting expense:', error);
    alert(`Fehler beim Löschen: ${error.message}`);
  }
}

function formatDate(date: any): string {
  if (!date) return 'Nicht gesetzt';
  const d = new Date(date);
  return d.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function viewInvoice(expense: any) {
  if (!expense.invoiceDocument) {
    alert('Keine Rechnung für diese Ausgabe hochgeladen.');
    return;
  }

  selectedInvoice.value = {
    documentPath: expense.invoiceDocument,
    documentName: `Rechnung_${expense.name || 'Ausgabe'}`
  };
  showInvoiceViewer.value = true;
}

function editExpense(expense: any) {
  console.log('Editing expense:', expense);

  editingExpense.value = {
    name: expense.name || '',
    amount: expense.amount || 0,
    frequency: expense.frequency || '',
    description: expense.description || '',
    category: expense.category || '',
    supplier: expense.supplier || '',
    notes: expense.notes || '',
    invoiceDocument: expense.invoiceDocument || '',
    isActive: expense.isActive || 'true',
    nextPaymentDate: expense.nextPaymentDate ?
      (typeof expense.nextPaymentDate === 'string' ?
        expense.nextPaymentDate.split('T')[0] :
        new Date(expense.nextPaymentDate).toISOString().split('T')[0]
      ) : ''
  };
  uploadedFile.value = null;
  showEditForm.value = true;
}

function cancelEdit() {
  showEditForm.value = false;
  editingExpense.value = null;
  uploadedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function removeCurrentPdf() {
  if (editingExpense.value) {
    editingExpense.value.invoiceDocument = '';
  }
}

async function updateExpense() {
  if (!isEditFormValid.value || !editingExpense.value) return;

  try {
    console.log('Updating RecurringExpense...', editingExpense.value.name);
    console.log('Form data:', editingExpense.value);

    const doc = await fyo.doc.getDoc('RecurringExpense', editingExpense.value.name);

    await doc.set('amount', editingExpense.value.amount);
    await doc.set('frequency', editingExpense.value.frequency);
    await doc.set('description', editingExpense.value.description);

    if (editingExpense.value.category) {
      await doc.set('category', editingExpense.value.category);
    } else {
      await doc.set('category', null);
    }

    if (editingExpense.value.supplier) {
      await doc.set('supplier', editingExpense.value.supplier);
    } else {
      await doc.set('supplier', null);
    }

    if (editingExpense.value.nextPaymentDate) {
      await doc.set('nextPaymentDate', editingExpense.value.nextPaymentDate);
    } else {
      await doc.set('nextPaymentDate', null);
    }

    if (editingExpense.value.notes) {
      await doc.set('notes', editingExpense.value.notes);
    } else {
      await doc.set('notes', null);
    }

    if (uploadedFile.value) {
      await doc.set('invoiceDocument', uploadedFile.value.name);
    } else if (editingExpense.value.invoiceDocument) {
      await doc.set('invoiceDocument', editingExpense.value.invoiceDocument);
    } else {
      await doc.set('invoiceDocument', null);
    }

    await doc.sync();
    console.log('Expense updated successfully');

    await loadExpenses();
    cancelEdit();

    alert('Wiederkehrende Zahlung erfolgreich aktualisiert!');
  } catch (error) {
    console.error('Error updating expense:', error);
    console.error('Error details:', error.message, error.stack);
    alert(`Fehler beim Aktualisieren: ${error.message}`);
  }
}
</script>