<template>
  <div class="h-screen" style="width: var(--w-desk)">
    <PageHeader :title="t`Unternehmens-Dashboard`" />

    <div
      class="no-scrollbar overflow-auto dark:bg-gray-875 p-6"
      style="height: calc(100vh - var(--h-row-largest) - 1px)"
    >
      <div class="space-y-6">
        <!-- Row 1: Financial KPIs -->
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ t`Finanz-Übersicht` }}</h2>
          <FinancialKPIs />
        </div>

        <!-- Row 2: Business Intelligence -->
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ t`Business Intelligence` }}</h2>
          <BusinessIntelligence />
        </div>

        <!-- Row 3: Activity and Trend -->
        <div class="grid gap-6 lg:grid-cols-3">
          <!-- Recent Activity (2/3 width) -->
          <div class="lg:col-span-2">
            <RecentActivity />
          </div>

          <!-- Monthly Trend (1/3 width) -->
          <div class="lg:col-span-1">
            <MonthlyTrend />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from 'src/components/PageHeader.vue';
import FinancialKPIs from './FinancialKPIs.vue';
import BusinessIntelligence from './BusinessIntelligence.vue';
import RecentActivity from './RecentActivity.vue';
import MonthlyTrend from './MonthlyTrend.vue';
import { docsPathRef } from 'src/utils/refs';

export default {
  name: 'Dashboard',
  components: {
    PageHeader,
    FinancialKPIs,
    BusinessIntelligence,
    RecentActivity,
    MonthlyTrend,
  },
  props: {
    darkMode: { type: Boolean, default: false },
  },
  activated() {
    docsPathRef.value = 'books/dashboard';
  },
  deactivated() {
    docsPathRef.value = '';
  },
};
</script>
