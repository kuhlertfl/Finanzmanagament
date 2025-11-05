<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-850 rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="p-6 pb-0 flex-shrink-0">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            {{ t`Rechnung anzeigen` }}
          </h3>
          <div class="flex items-center gap-3">
            <button
              v-if="documentData"
              @click="downloadInvoice"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <feather-icon name="download" class="w-4 h-4" />
              {{ t`Herunterladen` }}
            </button>
            <button
              @click="closeViewer"
              class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              {{ t`Schließen` }}
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-hidden p-6 pt-4">
        <div v-if="loading" class="flex items-center justify-center h-full">
          <div class="text-center">
            <feather-icon name="loader" class="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
            <p class="text-gray-600 dark:text-gray-400">{{ t`Rechnung wird geladen...` }}</p>
          </div>
        </div>

        <div v-else-if="error" class="flex items-center justify-center h-full">
          <div class="text-center">
            <feather-icon name="alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {{ t`Fehler beim Laden der Rechnung` }}
            </h4>
            <p class="text-gray-600 dark:text-gray-400">{{ error }}</p>
          </div>
        </div>

        <div v-else-if="!documentData" class="flex items-center justify-center h-full">
          <div class="text-center">
            <feather-icon name="file-x" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {{ t`Keine Rechnung verfügbar` }}
            </h4>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t`Für diesen Eintrag wurde keine Rechnung hochgeladen.` }}
            </p>
          </div>
        </div>

        <div v-else class="h-full">
          <PDFRenderer
            :document-data="documentData"
            :document-name="documentName"
            @error="handlePDFError"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { t } from 'fyo';
import featherIcon from 'src/components/FeatherIcon.vue';
import PDFRenderer from './PDFRenderer.vue';

export default defineComponent({
  name: 'InvoiceViewer',
  components: {
    featherIcon,
    PDFRenderer,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    documentPath: {
      type: String,
      default: '',
    },
    documentName: {
      type: String,
      default: 'Rechnung',
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const loading = ref(false);
    const error = ref('');
    const documentData = ref<string | null>(null);

    const closeViewer = () => {
      emit('close');
      // Reset state
      documentData.value = null;
      error.value = '';
      loading.value = false;
    };

    const loadDocument = async () => {
      if (!props.documentPath || !props.show) {
        return;
      }

      loading.value = true;
      error.value = '';
      documentData.value = null;

      try {
        // Check if documentPath is already base64 encoded
        if (props.documentPath.startsWith('data:')) {
          documentData.value = props.documentPath;
        } else if (props.documentPath.startsWith('JVBERi0')) {
          // Base64 PDF data
          documentData.value = `data:application/pdf;base64,${props.documentPath}`;
        } else {
          // Treat as filename - for now show error since we don't have file storage
          throw new Error('Datei-basierte Rechnungen werden noch nicht unterstützt. Nur Base64-kodierte PDFs.');
        }
      } catch (err: any) {
        console.error('Error loading document:', err);
        error.value = err.message || 'Unbekannter Fehler beim Laden der Rechnung';
      } finally {
        loading.value = false;
      }
    };

    const downloadInvoice = () => {
      if (!documentData.value) return;

      try {
        // Create download link
        const link = document.createElement('a');
        link.href = documentData.value;
        link.download = `${props.documentName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Error downloading invoice:', err);
        alert('Fehler beim Herunterladen der Rechnung');
      }
    };

    const handlePDFError = (errorMessage: string) => {
      error.value = errorMessage;
    };

    // Watch for changes in show prop
    watch(
      () => props.show,
      (newValue) => {
        if (newValue) {
          loadDocument();
        }
      },
      { immediate: true }
    );

    // Watch for changes in documentPath
    watch(
      () => props.documentPath,
      () => {
        if (props.show) {
          loadDocument();
        }
      }
    );

    return {
      loading,
      error,
      documentData,
      closeViewer,
      downloadInvoice,
      handlePDFError,
      t,
    };
  },
});
</script>