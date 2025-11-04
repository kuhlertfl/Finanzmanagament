<template>
  <div class="p-4">
    <PageHeader :title="t`Neue Kundengruppe erstellen`" />

    <div class="mt-6 max-w-2xl">
      <form @submit.prevent="saveGroup" class="space-y-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">{{ t`Gruppeninformationen` }}</h3>

          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                {{ t`Gruppenname` }} *
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                :placeholder="t`z.B. Fitness Erwachsene`"
              />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">
                {{ t`Beschreibung` }}
              </label>
              <textarea
                id="description"
                v-model="formData.description"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                :placeholder="t`Beschreibung der Kundengruppe...`"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <Button
            type="secondary"
            @click="$router.push('/customer-groups')"
          >
            {{ t`Abbrechen` }}
          </Button>
          <Button
            type="primary"
            :disabled="saving || !formData.name"
            @click="saveGroup"
          >
            {{ saving ? t`Speichern...` : t`Speichern` }}
          </Button>
        </div>
      </form>
    </div>

    <!-- Success Toast (simple version) -->
    <div
      v-if="showSuccessMessage"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      {{ t`Kundengruppe erfolgreich erstellt!` }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { t } from 'fyo';
import { fyo } from 'src/initFyo';
import Button from 'src/components/Button.vue';
import PageHeader from 'src/components/PageHeader.vue';

const router = useRouter();

const formData = reactive({
  name: '',
  description: ''
});

const saving = ref(false);
const showSuccessMessage = ref(false);

async function saveGroup() {
  if (!formData.name.trim()) {
    return;
  }

  try {
    saving.value = true;
    console.log('Creating customer group:', formData);

    // Create new CustomerGroup document
    const doc = fyo.doc.getNewDoc('CustomerGroup');
    await doc.set('name', formData.name.trim());
    if (formData.description) {
      await doc.set('description', formData.description.trim());
    }

    await doc.sync();
    console.log('Customer group created successfully:', doc);

    // Show success message
    showSuccessMessage.value = true;

    // Navigate back to groups list after short delay
    setTimeout(() => {
      showSuccessMessage.value = false;
      router.push('/customer-groups');
    }, 1500);

  } catch (error) {
    console.error('Error creating customer group:', error);
    alert(t`Fehler beim Erstellen der Kundengruppe: ${error.message}`);
  } finally {
    saving.value = false;
  }
}
</script>