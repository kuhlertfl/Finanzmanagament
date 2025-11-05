<template>
  <div class="h-full">
    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="text-center">
        <feather-icon name="loader" class="w-6 h-6 text-blue-500 animate-spin mx-auto mb-2" />
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ t`PDF wird geladen...` }}</p>
      </div>
    </div>

    <div v-else-if="error" class="flex items-center justify-center h-full">
      <div class="text-center">
        <feather-icon name="alert-triangle" class="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        <div class="mt-4 space-y-2">
          <button
            @click="retryLoad"
            class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 mr-2"
          >
            {{ t`Erneut versuchen` }}
          </button>
          <button
            @click="openInNewTab"
            class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {{ t`In neuem Tab öffnen` }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="h-full">
      <!-- PDF Viewer using iframe -->
      <iframe
        ref="pdfFrame"
        :src="pdfUrl"
        class="w-full h-full border rounded"
        :title="`PDF: ${documentName}`"
        @load="handleLoad"
        @error="handleError"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from 'vue';
import { t } from 'fyo';
import featherIcon from 'src/components/FeatherIcon.vue';

export default defineComponent({
  name: 'PDFRenderer',
  components: {
    featherIcon,
  },
  props: {
    documentData: {
      type: String,
      required: true,
    },
    documentName: {
      type: String,
      default: 'document',
    },
  },
  emits: ['error'],
  setup(props, { emit }) {
    const loading = ref(true);
    const error = ref('');
    const pdfFrame = ref<HTMLIFrameElement | null>(null);
    const loadTimeout = ref<NodeJS.Timeout | null>(null);

    const pdfUrl = computed(() => {
      if (!props.documentData) return '';

      try {
        // If it's already a data URL, use it directly
        if (props.documentData.startsWith('data:')) {
          return props.documentData;
        }

        // If it's base64 without data URL prefix, add it
        if (props.documentData.match(/^[A-Za-z0-9+/=]+$/)) {
          return `data:application/pdf;base64,${props.documentData}`;
        }

        // If it starts with PDF signature (JVBERi0 is "%PDF-" in base64)
        if (props.documentData.startsWith('JVBERi0')) {
          return `data:application/pdf;base64,${props.documentData}`;
        }

        throw new Error('Unbekanntes PDF-Format');
      } catch (err) {
        console.error('Error creating PDF URL:', err);
        return '';
      }
    });

    const handleLoad = () => {
      console.log('PDF loaded successfully');
      if (loadTimeout.value) {
        clearTimeout(loadTimeout.value);
        loadTimeout.value = null;
      }
      loading.value = false;
      error.value = '';
    };

    const handleError = () => {
      loading.value = false;
      error.value = 'Fehler beim Laden des PDFs. Das Dokument könnte beschädigt sein.';
      emit('error', error.value);
    };

    const retryLoad = () => {
      loading.value = true;
      error.value = '';

      nextTick(() => {
        if (pdfFrame.value) {
          pdfFrame.value.src = pdfUrl.value;
        }
      });
    };

    const openInNewTab = () => {
      if (pdfUrl.value) {
        console.log('Opening PDF in new tab');
        window.open(pdfUrl.value, '_blank');
      }
    };

    // Watch for changes in document data
    watch(
      () => props.documentData,
      () => {
        console.log('PDF data changed, reloading...');
        loading.value = true;
        error.value = '';

        // Clear any existing timeout
        if (loadTimeout.value) {
          clearTimeout(loadTimeout.value);
        }

        // Set a timeout to handle slow loading
        loadTimeout.value = setTimeout(() => {
          if (loading.value) {
            console.log('PDF loading timeout');
            loading.value = false;
            error.value = 'PDF-Laden dauert zu lange. Versuchen Sie es erneut oder laden Sie eine kleinere Datei hoch.';
            emit('error', error.value);
          }
        }, 15000); // 15 seconds timeout
      },
      { immediate: true }
    );

    // Validate PDF data on mount
    watch(
      pdfUrl,
      (newUrl) => {
        if (!newUrl) {
          loading.value = false;
          error.value = 'Keine gültigen PDF-Daten gefunden';
          emit('error', error.value);
        }
      },
      { immediate: true }
    );

    return {
      loading,
      error,
      pdfUrl,
      pdfFrame,
      handleLoad,
      handleError,
      retryLoad,
      openInNewTab,
      t,
    };
  },
});
</script>

<style scoped>
iframe {
  border: 1px solid #e5e7eb;
}

.dark iframe {
  border-color: #374151;
}
</style>