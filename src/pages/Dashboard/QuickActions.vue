<template>
  <div class="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{{ t`Schnellzugriff` }}</h3>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Neue Einnahme -->
      <button
        @click="$router.push('/income/one-time')"
        class="flex flex-col items-center p-4 border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
      >
        <feather-icon name="plus-circle" class="w-8 h-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
        <span class="text-sm font-medium text-green-700 dark:text-green-400">{{ t`Neue Einnahme` }}</span>
        <span class="text-xs text-green-600 dark:text-green-500 mt-1">{{ t`Einmalige Zahlung erfassen` }}</span>
      </button>

      <!-- Neue Ausgabe -->
      <button
        @click="$router.push('/expenses/one-time')"
        class="flex flex-col items-center p-4 border-2 border-dashed border-red-300 dark:border-red-700 rounded-lg hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
      >
        <feather-icon name="minus-circle" class="w-8 h-8 text-red-500 mb-2 group-hover:scale-110 transition-transform" />
        <span class="text-sm font-medium text-red-700 dark:text-red-400">{{ t`Neue Ausgabe` }}</span>
        <span class="text-xs text-red-600 dark:text-red-500 mt-1">{{ t`Kosten erfassen` }}</span>
      </button>

      <!-- Neuer Kunde -->
      <button
        @click="$router.push('/customers/create')"
        class="flex flex-col items-center p-4 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
      >
        <feather-icon name="user-plus" class="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
        <span class="text-sm font-medium text-blue-700 dark:text-blue-400">{{ t`Neuer Kunde` }}</span>
        <span class="text-xs text-blue-600 dark:text-blue-500 mt-1">{{ t`Kundenvertrag erstellen` }}</span>
      </button>

      <!-- Monatsabrechnung -->
      <button
        @click="$router.push('/payment-verification')"
        class="flex flex-col items-center p-4 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
      >
        <feather-icon name="calculator" class="w-8 h-8 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
        <span class="text-sm font-medium text-purple-700 dark:text-purple-400">{{ t`Monatsabrechnung` }}</span>
        <span class="text-xs text-purple-600 dark:text-purple-500 mt-1">{{ t`Zahlungen überprüfen` }}</span>
      </button>
    </div>

    <!-- Secondary Actions -->
    <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <button
          @click="$router.push('/income/recurring')"
          class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
        >
          <feather-icon name="repeat" class="w-5 h-5 text-gray-500 mr-3 group-hover:text-blue-500" />
          <div class="text-left">
            <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ t`Wiederkehrende Einnahmen` }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ t`Kundenverträge verwalten` }}</div>
          </div>
        </button>

        <button
          @click="$router.push('/expenses/recurring')"
          class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
        >
          <feather-icon name="clock" class="w-5 h-5 text-gray-500 mr-3 group-hover:text-red-500" />
          <div class="text-left">
            <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ t`Wiederkehrende Ausgaben` }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ t`Abos und Fixkosten` }}</div>
          </div>
        </button>

        <button
          @click="$router.push('/saved-verifications')"
          class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
        >
          <feather-icon name="archive" class="w-5 h-5 text-gray-500 mr-3 group-hover:text-purple-500" />
          <div class="text-left">
            <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ t`Abrechnungshistorie` }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ t`Vergangene Abrechnungen` }}</div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from 'fyo';
import FeatherIcon from 'src/components/FeatherIcon.vue';
</script>