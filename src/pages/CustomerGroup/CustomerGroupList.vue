<template>
  <div class="p-4">
    <PageHeader :title="t`Kundengruppen`">
      <Button
        class="text-xs text-white"
        type="primary"
        @click="$router.push('/customer-groups/new')"
      >
        <feather-icon name="plus" class="w-4 h-4 mr-1" />
        {{ t`Neue Gruppe` }}
      </Button>
    </PageHeader>

    <div class="mt-6">
      <div v-if="!loading && groups.length === 0" class="text-center py-12 text-gray-500">
        <feather-icon name="users" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p class="text-lg font-medium">{{ t`Keine Gruppen gefunden` }}</p>
        <p class="mt-1">{{ t`Erstellen Sie Ihre erste Kundengruppe` }}</p>
        <Button
          class="mt-4"
          type="primary"
          @click="$router.push('/customer-groups/new')"
        >
          {{ t`Gruppe erstellen` }}
        </Button>
      </div>

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="group in groups"
          :key="group.name"
          class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col h-full"
        >
          <!-- Header -->
          <div class="flex items-center mb-4">
            <div class="w-4 h-4 rounded-full mr-3 bg-blue-500 flex-shrink-0"></div>
            <h3 class="text-lg font-semibold text-gray-900 truncate">{{ group.name }}</h3>
          </div>

          <!-- Description (flex-grow to take available space) -->
          <div class="flex-grow mb-4">
            <p v-if="group.description" class="text-gray-600 text-sm leading-relaxed">
              {{ group.description }}
            </p>
            <p v-else class="text-gray-400 text-sm italic">
              {{ t`Keine Beschreibung` }}
            </p>
          </div>

          <!-- Member count -->
          <div class="mb-4">
            <div class="text-sm text-gray-500 flex items-center">
              <feather-icon name="users" class="w-4 h-4 mr-1" />
              {{ group.memberCount || 0 }} {{ t`Mitglieder` }}
            </div>
          </div>

          <!-- Actions (always at bottom) -->
          <div class="flex gap-2 mt-auto">
            <Button
              size="sm"
              class="flex-1"
              @click="$router.push(`/customer-groups/${group.name}/members`)"
            >
              {{ 'Mitglieder' }}
            </Button>
            <Button
              size="sm"
              type="secondary"
              class="flex-1"
              @click="$router.push(`/edit/CustomerGroup/${group.name}`)"
            >
              {{ 'Bearbeiten' }}
            </Button>
            <button
              @click="deleteGroup(group)"
              class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
              title="Gruppe löschen"
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
import { computed, ref, onMounted, onActivated } from 'vue';
import { t } from 'fyo';
import { fyo } from 'src/initFyo';
import Button from 'src/components/Button.vue';
import PageHeader from 'src/components/PageHeader.vue';
import FeatherIcon from 'src/components/FeatherIcon.vue';

const groups = ref([]);
const loading = ref(true);

onMounted(async () => {
  await loadGroups();
});

// Reload groups when component becomes active (e.g., navigating back from create page)
onActivated(async () => {
  await loadGroups();
});

async function loadGroups() {
  try {
    loading.value = true;
    console.log('Loading customer groups...');
    const docs = await fyo.db.getAll('CustomerGroup', {
      fields: ['name', 'description'],
      orderBy: 'name'
    });
    console.log('Loaded customer groups:', docs);

    // Calculate member count for each group
    const groupsWithCounts = await Promise.all(
      docs.map(async (group) => {
        try {
          const members = await fyo.db.getAll('SubscriptionCustomer', {
            fields: ['name'],
            filters: { customerGroup: group.name }
          });
          return {
            ...group,
            memberCount: members.length
          };
        } catch (error) {
          console.error(`Error counting members for group ${group.name}:`, error);
          return {
            ...group,
            memberCount: 0
          };
        }
      })
    );

    groups.value = groupsWithCounts;
  } catch (error) {
    console.error('Error loading groups:', error);
    // Try with minimal fields in case of issues
    try {
      const simpleDocs = await fyo.db.getAll('CustomerGroup', {
        fields: ['name'],
        orderBy: 'name'
      });
      console.log('Loaded groups with minimal fields:', simpleDocs);
      groups.value = simpleDocs.map(group => ({ ...group, memberCount: 0 }));
    } catch (simpleError) {
      console.error('Error loading groups with minimal fields:', simpleError);
    }
  } finally {
    loading.value = false;
  }
}

async function deleteGroup(group: any) {
  const confirmed = confirm(`Möchten Sie die Gruppe "${group.name}" wirklich löschen?\n\nAlle Kunden werden aus der Gruppe entfernt.\nDiese Aktion kann nicht rückgängig gemacht werden.`);

  if (!confirmed) return;

  try {
    console.log('Deleting group:', group.name);

    // First, remove all customers from this group
    const members = await fyo.db.getAll('SubscriptionCustomer', {
      fields: ['name'],
      filters: { customerGroup: group.name }
    });

    // Remove group assignment from all members
    for (const member of members) {
      try {
        const customerDoc = await fyo.doc.getDoc('SubscriptionCustomer', member.name);
        await customerDoc.set('customerGroup', '');
        await customerDoc.sync();
      } catch (error) {
        console.error(`Error removing group from customer ${member.name}:`, error);
      }
    }

    // Delete the group
    const groupDoc = await fyo.doc.getDoc('CustomerGroup', group.name);
    await groupDoc.delete();

    // Refresh the groups list
    await loadGroups();

    alert(`Gruppe "${group.name}" wurde erfolgreich gelöscht.`);
  } catch (error) {
    console.error('Error deleting group:', error);
    alert(`Fehler beim Löschen der Gruppe: ${error.message}`);
  }
}

</script>