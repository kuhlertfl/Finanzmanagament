import ChartOfAccounts from 'src/pages/ChartOfAccounts.vue';
import CommonForm from 'src/pages/CommonForm/CommonForm.vue';
import Dashboard from 'src/pages/Dashboard/Dashboard.vue';
import GetStarted from 'src/pages/GetStarted.vue';
import ImportWizard from 'src/pages/ImportWizard.vue';
import ListView from 'src/pages/ListView/ListView.vue';
import PrintView from 'src/pages/PrintView/PrintView.vue';
import ReportPrintView from 'src/pages/PrintView/ReportPrintView.vue';
import QuickEditForm from 'src/pages/QuickEditForm.vue';
import Report from 'src/pages/Report.vue';
import Settings from 'src/pages/Settings/Settings.vue';
import TemplateBuilder from 'src/pages/TemplateBuilder/TemplateBuilder.vue';
import CustomizeForm from 'src/pages/CustomizeForm/CustomizeForm.vue';
import POS from 'src/pages/POS/POS.vue';
import PaymentVerification from 'src/pages/PaymentVerification/PaymentVerification.vue';
import SavedVerifications from 'src/pages/SavedVerifications/SavedVerifications.vue';
import VerificationDetails from 'src/pages/SavedVerifications/VerificationDetails.vue';
import SubscriptionCustomerDetail from 'src/pages/SubscriptionCustomer/SubscriptionCustomerDetail.vue';
import SubscriptionCustomerList from 'src/pages/SubscriptionCustomer/SubscriptionCustomerList.vue';
import SubscriptionCustomerCreate from 'src/pages/SubscriptionCustomer/SubscriptionCustomerCreate.vue';
import CustomerGroupList from 'src/pages/CustomerGroup/CustomerGroupList.vue';
import CustomerGroupCreate from 'src/pages/CustomerGroup/CustomerGroupCreate.vue';
import CustomerGroupMembers from 'src/pages/CustomerGroup/CustomerGroupMembers.vue';
import ExpenseDashboard from 'src/pages/Expenses/ExpenseDashboard.vue';
import RecurringExpensesList from 'src/pages/Expenses/RecurringExpensesList.vue';
import OneTimeExpensesList from 'src/pages/Expenses/OneTimeExpensesList.vue';
import OneTimeIncome from 'src/pages/Income/OneTimeIncome.vue';
import type { HistoryState } from 'vue-router';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { historyState } from './utils/refs';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Dashboard,
  },
  {
    path: '/get-started',
    component: GetStarted,
  },
  {
    path: `/edit/:schemaName/:name`,
    name: `CommonForm`,
    components: {
      default: CommonForm,
      edit: QuickEditForm,
    },
    props: {
      default: (route) => ({
        schemaName: route.params.schemaName,
        name: route.params.name,
      }),
      edit: (route) => route.query,
    },
  },
  {
    path: '/list/:schemaName/:pageTitle?',
    name: 'ListView',
    components: {
      default: ListView,
      edit: QuickEditForm,
    },
    props: {
      default: (route) => {
        const { schemaName } = route.params;
        const pageTitle = route.params.pageTitle ?? '';

        const filters = {};
        const filterString = route.query.filters;
        if (typeof filterString === 'string') {
          Object.assign(filters, JSON.parse(filterString));
        }

        return {
          schemaName,
          filters,
          pageTitle,
        };
      },
      edit: (route) => route.query,
    },
  },
  {
    path: '/print/:schemaName/:name',
    name: 'PrintView',
    component: PrintView,
    props: true,
  },
  {
    path: '/report-print/:reportName',
    name: 'ReportPrintView',
    component: ReportPrintView,
    props: true,
  },
  {
    path: '/report/:reportClassName',
    name: 'Report',
    component: Report,
    props: true,
  },
  {
    path: '/chart-of-accounts',
    name: 'Chart Of Accounts',
    components: {
      default: ChartOfAccounts,
      edit: QuickEditForm,
    },
    props: {
      default: true,
      edit: (route) => route.query,
    },
  },
  {
    path: '/import-wizard',
    name: 'Import Wizard',
    component: ImportWizard,
  },
  {
    path: '/template-builder/:name',
    name: 'Template Builder',
    component: TemplateBuilder,
    props: true,
  },
  {
    path: '/customize-form',
    name: 'Customize Form',
    component: CustomizeForm,
  },
  {
    path: '/settings',
    name: 'Settings',
    components: {
      default: Settings,
      edit: QuickEditForm,
    },
    props: {
      default: true,
      edit: (route) => route.query,
    },
  },
  {
    path: '/pos',
    name: 'Point of Sale',
    components: {
      default: POS,
      edit: QuickEditForm,
    },
    props: {
      default: true,
      edit: (route) => route.query,
    },
  },
  {
    path: '/payment-verification',
    name: 'Payment Verification',
    component: PaymentVerification,
  },
  {
    path: '/saved-verifications',
    name: 'Saved Verifications',
    component: SavedVerifications,
  },
  {
    path: '/saved-verifications/:name',
    name: 'Verification Details',
    component: VerificationDetails,
    props: true,
  },
  {
    path: '/customer/:name',
    name: 'Customer Detail',
    component: SubscriptionCustomerDetail,
    props: true,
  },
  {
    path: '/customers',
    name: 'Customer List',
    component: SubscriptionCustomerList,
  },
  {
    path: '/customer/new',
    name: 'Create Customer',
    component: SubscriptionCustomerCreate,
  },
  {
    path: '/customer-groups',
    name: 'Customer Groups',
    component: CustomerGroupList,
  },
  {
    path: '/customer-groups/new',
    name: 'Create Customer Group',
    component: CustomerGroupCreate,
  },
  {
    path: '/customer-groups/:groupName/members',
    name: 'Customer Group Members',
    component: CustomerGroupMembers,
    props: true,
  },
  {
    path: '/expenses',
    name: 'Expense Dashboard',
    component: ExpenseDashboard,
  },
  {
    path: '/expenses/recurring',
    name: 'Recurring Expenses',
    component: RecurringExpensesList,
  },
  {
    path: '/expenses/one-time',
    name: 'One-time Expenses',
    component: OneTimeExpensesList,
  },
  {
    path: '/income/one-time',
    name: 'One-time Income',
    component: OneTimeIncome,
  },
];

const router = createRouter({ routes, history: createWebHistory() });

router.afterEach(({ fullPath }) => {
  const state = history.state as HistoryState;
  historyState.forward = !!state.forward;
  historyState.back = !!state.back;

  if (fullPath.includes('index.html')) {
    return;
  }

  localStorage.setItem('lastRoute', fullPath);
});

export default router;
