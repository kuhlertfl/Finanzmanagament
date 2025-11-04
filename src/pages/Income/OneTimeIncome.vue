<template>
  <div class="flex flex-col h-full overflow-hidden bg-white dark:bg-gray-875">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b dark:border-gray-800">
      <div>
        <h1 class="text-2xl font-semibold dark:text-gray-100">Einmalige Einnahmen</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ incomeEntries.length }} {{ incomeEntries.length === 1 ? 'Eintrag' : 'Einträge' }}
        </p>
      </div>
      <button
        @click="showAddForm = true"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
      >
        <feather-icon name="plus" class="w-4 h-4" />
        Neue Einnahme
      </button>
    </div>

    <!-- Add Form Modal -->
    <div
      v-if="showAddForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-850 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Neue Einnahme eintragen
        </h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Betrag (€) *
            </label>
            <input
              v-model.number="newEntry.amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Beschreibung *
            </label>
            <input
              v-model="newEntry.description"
              type="text"
              placeholder="z.B. Barzahlung von Kunde XY"
              class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Datum *
            </label>
            <input
              v-model="newEntry.date"
              type="date"
              class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kategorie
            </label>
            <select
              v-model="newEntry.category"
              class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="Barzahlung">Barzahlung</option>
              <option value="Sonstige">Sonstige Einnahme</option>
              <option value="Trinkgeld">Trinkgeld</option>
              <option value="Nachzahlung">Nachzahlung</option>
              <option value="Bonus">Bonus</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notizen
            </label>
            <textarea
              v-model="newEntry.notes"
              rows="3"
              class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
              placeholder="Zusätzliche Informationen..."
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="cancelAdd"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Abbrechen
          </button>
          <button
            @click="saveEntry"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            :disabled="!isFormValid"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>

    <!-- Income Entries List -->
    <div class="flex-1 overflow-auto p-6">
      <div v-if="incomeEntries.length === 0" class="text-center py-12">
        <feather-icon name="dollar-sign" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
        <p class="text-gray-600 dark:text-gray-400 text-lg">Keine Einnahmen eingetragen</p>
        <p class="text-gray-500 dark:text-gray-500 mt-2">Klicken Sie auf "Neue Einnahme" um zu beginnen</p>
      </div>

      <div v-else class="bg-white dark:bg-gray-850 rounded-lg border dark:border-gray-800 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Datum
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Beschreibung
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kategorie
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Betrag
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-875 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="entry in sortedEntries"
              :key="entry.name"
              class="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ formatDate(entry.date) }}
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ entry.description }}
                </div>
                <div v-if="entry.notes" class="text-sm text-gray-500 dark:text-gray-400">
                  {{ entry.notes }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {{ entry.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                {{ entry.amount?.toFixed(2) || '0.00' }} €
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="deleteEntry(entry)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                  title="Eintrag löschen"
                >
                  <feather-icon name="trash-2" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Total Summary -->
        <div class="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t dark:border-gray-700">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Gesamteinnahmen:
            </span>
            <span class="text-lg font-bold text-green-600 dark:text-green-400">
              {{ totalAmount.toFixed(2) }} €
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated } from 'vue';
import { fyo } from 'src/initFyo';

const incomeEntries = ref<any[]>([]);
const showAddForm = ref(false);

const newEntry = ref({
  amount: 0,
  description: '',
  date: new Date().toISOString().split('T')[0],
  category: 'Barzahlung',
  notes: '',
});

const isFormValid = computed(() => {
  return newEntry.value.amount > 0 &&
         newEntry.value.description.trim() !== '' &&
         newEntry.value.date !== '';
});

const sortedEntries = computed(() => {
  return [...incomeEntries.value].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
});

const totalAmount = computed(() => {
  return incomeEntries.value.reduce((sum, entry) => sum + (entry.amount || 0), 0);
});

onMounted(async () => {
  await loadEntries();
});

onActivated(async () => {
  await loadEntries();
});

async function loadEntries() {
  try {
    console.log('Loading income entries...');

    // Simple query without orderBy to avoid issues
    const entries = await fyo.db.getAll('OneTimeIncome', {
      fields: ['name', 'amount', 'description', 'date', 'category', 'notes'],
    });
    console.log('Loaded entries:', entries);
    incomeEntries.value = entries || [];
  } catch (error) {
    console.error('Error loading income entries:', error);
    console.error('Error details:', error.message, error.stack);

    // If table doesn't exist, create a first entry to initialize it
    if (error.message?.includes('no such table: OneTimeIncome')) {
      console.log('Table does not exist, it will be created when first entry is saved.');
    }

    incomeEntries.value = [];
  }
}

async function saveEntry() {
  if (!isFormValid.value) return;

  try {
    console.log('Creating new OneTimeIncome entry...');
    console.log('Form data:', newEntry.value);

    const doc = fyo.doc.getNewDoc('OneTimeIncome');
    console.log('Created doc:', doc);

    // Generate unique name for manual naming
    const timestamp = Date.now();
    const uniqueName = `OTI-${timestamp}`;
    console.log('Generated name:', uniqueName);

    await doc.set('name', uniqueName);
    console.log('Set name');

    await doc.set('amount', newEntry.value.amount);
    console.log('Set amount:', newEntry.value.amount);

    await doc.set('description', newEntry.value.description);
    console.log('Set description:', newEntry.value.description);

    await doc.set('date', newEntry.value.date);
    console.log('Set date:', newEntry.value.date);

    await doc.set('category', newEntry.value.category);
    console.log('Set category:', newEntry.value.category);

    if (newEntry.value.notes) {
      await doc.set('notes', newEntry.value.notes);
      console.log('Set notes:', newEntry.value.notes);
    }

    console.log('About to sync...');
    await doc.sync();
    console.log('Sync completed successfully');

    console.log('Reloading entries...');
    await loadEntries();
    cancelAdd();

    alert('Einnahme erfolgreich gespeichert!');
  } catch (error) {
    console.error('Error saving entry:', error);
    console.error('Error details:', error.message, error.stack);
    alert(`Fehler beim Speichern: ${error.message}`);
  }
}

function cancelAdd() {
  showAddForm.value = false;
  newEntry.value = {
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Barzahlung',
    notes: '',
  };
}

async function deleteEntry(entry: any) {
  const confirmed = confirm(`Möchten Sie die Einnahme "${entry.description}" wirklich löschen?\n\nDiese Aktion kann nicht rückgängig gemacht werden.`);

  if (!confirmed) return;

  try {
    const doc = await fyo.doc.getDoc('OneTimeIncome', entry.name);
    await doc.delete();

    await loadEntries();
    alert('Einnahme erfolgreich gelöscht.');
  } catch (error) {
    console.error('Error deleting entry:', error);
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
</script>