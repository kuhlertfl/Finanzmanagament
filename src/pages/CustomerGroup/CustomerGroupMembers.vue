<template>
  <div class="p-4">
    <PageHeader :title="groupName ? `${groupName} - Mitglieder` : 'Mitglieder'">
      <Button
        class="text-xs text-white"
        type="secondary"
        @click="$router.push('/customer-groups')"
      >
        <feather-icon name="arrow-left" class="w-4 h-4 mr-1" />
        Zurück zu Gruppen
      </Button>
    </PageHeader>

    <!-- Debug Info -->
    <div v-if="!groupName" class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 class="text-red-800 font-medium">Debug Info</h3>
      <p class="text-red-600">Gruppenname ist leer!</p>
      <p class="text-sm text-red-500">Route params: {{ JSON.stringify($route.params) }}</p>
      <p class="text-sm text-red-500">Current route: {{ $route.path }}</p>
    </div>

    <div class="mt-6 space-y-6">
      <!-- Add Member Section -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Neues Mitglied hinzufügen</h3>
        <div class="flex gap-3">
          <select
            v-model="selectedCustomerToAdd"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="addingMember"
          >
            <option value="">Kunde auswählen...</option>
            <option
              v-for="customer in availableCustomers"
              :key="customer.name"
              :value="customer.name"
            >
              {{ customer.name }} ({{ customer.email }})
            </option>
          </select>
          <Button
            type="primary"
            @click="addMemberToGroup"
            :disabled="!selectedCustomerToAdd || addingMember"
          >
            {{ addingMember ? 'Hinzufügen...' : 'Hinzufügen' }}
          </Button>
        </div>
      </div>

      <!-- Current Members List -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Aktuelle Mitglieder ({{ groupMembers.length }})
        </h3>

        <div v-if="loading" class="text-center py-8 text-gray-500">
          <p>Laden...</p>
        </div>

        <div v-else-if="groupMembers.length === 0" class="text-center py-8 text-gray-500">
          <feather-icon name="users" class="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Keine Mitglieder in dieser Gruppe</p>
          <p class="text-sm">Fügen Sie oben einen Kunden hinzu</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="member in groupMembers"
            :key="member.name"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex-1">
              <div class="font-medium text-lg">{{ member.name }}</div>
              <div class="text-sm text-gray-500">{{ member.email }}</div>
              <div class="text-sm text-gray-600 mt-1">
                Status: {{ member.status || 'Nicht gesetzt' }}
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Button
                size="sm"
                type="secondary"
                @click="$router.push(`/customer/${member.name}`)"
                class="text-blue-600 hover:text-blue-700"
              >
                Details
              </Button>
              <Button
                size="sm"
                type="secondary"
                @click="removeMemberFromGroup(member)"
                class="text-red-600 hover:text-red-700"
              >
                <feather-icon name="x" class="w-4 h-4" />
                Entfernen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { t } from 'fyo';
import { fyo } from 'src/initFyo';
import Button from 'src/components/Button.vue';
import PageHeader from 'src/components/PageHeader.vue';
import FeatherIcon from 'src/components/FeatherIcon.vue';

const route = useRoute();
const groupName = ref(route.params.groupName as string);

console.log('Route params:', route.params);
console.log('Group name:', groupName.value);

const loading = ref(true);
const groupMembers = ref([]);
const availableCustomers = ref([]);
const selectedCustomerToAdd = ref('');
const addingMember = ref(false);

onMounted(async () => {
  await loadData();
});

async function loadData() {
  try {
    loading.value = true;
    console.log('Loading data for group:', groupName.value);

    // Load current group members
    const members = await fyo.db.getAll('SubscriptionCustomer', {
      fields: ['name', 'email', 'status', 'customerGroup'],
      filters: { customerGroup: groupName.value }
    });
    console.log('Found members:', members);
    groupMembers.value = members;

    // Load all customers for the dropdown
    const allCustomers = await fyo.db.getAll('SubscriptionCustomer', {
      fields: ['name', 'email', 'customerGroup'],
      orderBy: 'name'
    });
    console.log('All customers:', allCustomers);

    // Filter out customers that are already in this group
    availableCustomers.value = allCustomers.filter(customer =>
      !customer.customerGroup || customer.customerGroup !== groupName.value
    );
    console.log('Available customers for dropdown:', availableCustomers.value);

  } catch (error) {
    console.error('Error loading data:', error);
    alert(`Fehler beim Laden der Daten: ${error.message}`);
  } finally {
    loading.value = false;
  }
}

async function addMemberToGroup() {
  if (!selectedCustomerToAdd.value) return;

  try {
    addingMember.value = true;
    console.log('Adding member to group:', selectedCustomerToAdd.value, groupName.value);

    // Get the customer document and update its group
    const customerDoc = await fyo.doc.getDoc('SubscriptionCustomer', selectedCustomerToAdd.value);
    await customerDoc.set('customerGroup', groupName.value);
    await customerDoc.sync();

    // Refresh the data
    await loadData();
    selectedCustomerToAdd.value = '';

    alert(`Kunde erfolgreich zur Gruppe hinzugefügt!`);
  } catch (error) {
    console.error('Error adding member to group:', error);
    alert(`Fehler beim Hinzufügen des Mitglieds: ${error.message}`);
  } finally {
    addingMember.value = false;
  }
}

async function removeMemberFromGroup(member) {
  if (!confirm(`${member.name} aus der Gruppe "${groupName.value}" entfernen?`)) return;

  try {
    console.log('Removing member from group:', member.name);

    // Get the customer document and remove its group
    const customerDoc = await fyo.doc.getDoc('SubscriptionCustomer', member.name);
    await customerDoc.set('customerGroup', '');
    await customerDoc.sync();

    // Refresh the data
    await loadData();

    alert(`${member.name} wurde aus der Gruppe entfernt.`);
  } catch (error) {
    console.error('Error removing member from group:', error);
    alert(`Fehler beim Entfernen des Mitglieds: ${error.message}`);
  }
}
</script>