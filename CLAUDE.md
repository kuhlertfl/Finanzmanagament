# Frappe Books - Ausgaben- und Einnahmenverwaltung - Projektdokumentation

## Projektübersicht

Dieses Projekt ist eine erweiterte Version von Frappe Books, einer Open-Source-Buchhaltungssoftware, die speziell für die Verwaltung von Ausgaben und Einnahmen eines deutschen Unternehmens angepasst wurde. Die Anwendung ist komplett auf Deutsch lokalisiert und bietet eine benutzerfreundliche Oberfläche für das Management von wiederkehrenden Zahlungen, einmaligen Ausgaben und Einnahmen.

### Technologie-Stack
- **Frontend**: Vue.js 3 mit Composition API und TypeScript
- **CSS Framework**: Tailwind CSS mit Dark Mode Support
- **Icons**: Feather Icons
- **Backend/ORM**: Frappe Books ORM (fyo.db)
- **Datenbank**: SQLite
- **Build System**: Vite/Webpack (basierend auf Frappe Books)

## Projektstruktur

```
/Users/floriankuhlert/Documents/kuhlertmedia/books/
├── schemas/
│   └── app/
│       ├── OneTimeExpense.json          # Schema für einmalige Ausgaben
│       ├── RecurringExpense.json        # Schema für wiederkehrende Zahlungen
│       ├── OneTimeIncome.json           # Schema für einmalige Einnahmen
│       ├── PaymentVerificationRecord.json
│       └── SubscriptionCustomer.json
├── src/
│   ├── pages/
│   │   ├── Expenses/
│   │   │   ├── RecurringExpensesList.vue    # Wiederkehrende Zahlungen
│   │   │   └── OneTimeExpensesList.vue      # Einmalige Ausgaben
│   │   ├── Income/
│   │   │   └── OneTimeIncome.vue           # Einmalige Einnahmen
│   │   ├── PaymentVerification/
│   │   └── SubscriptionCustomer/
│   ├── utils/
│   │   ├── sidebarConfig.ts               # Navigation/Sidebar Konfiguration
│   │   ├── ui.ts                         # UI Utilities
│   │   ├── paymentMatching.ts            # Payment Matching Logik
│   │   └── pdfGenerator.ts               # PDF Generation
│   └── router.ts                         # Vue Router Konfiguration
├── translations/
│   └── de.csv                           # Deutsche Übersetzungen
└── testdata/                           # Test-Daten
```

## Implementierte Features

### 1. Wiederkehrende Zahlungen (RecurringExpensesList.vue)
**Funktionalität:**
- Vollständige CRUD-Operationen (Create, Read, Update, Delete)
- Modal-basierte Formulare für Hinzufügen und Bearbeiten
- PDF-Upload für Rechnungsdokumente
- Responsive Design mit Dark Mode Support
- Automatische Sortierung nach Datum
- Gesamtsummen-Berechnung

**Besondere Implementierungsdetails:**
- Manual naming strategy mit eindeutigen IDs (`RE-${timestamp}`)
- Robustes Error Handling für Datenbankoperationen
- Datei-Upload mit FileReader API für PDF-Dokumente

### 2. Einmalige Ausgaben (OneTimeExpensesList.vue)
**Funktionalität:**
- Komplettes Ausgabenmanagement für einmalige Kosten
- PDF-Rechnungsupload
- Kategorisierung von Ausgaben
- Monatliche, jährliche und Gesamt-Statistiken
- Modal-basierte Eingabeformulare

**Besondere Implementierungsdetails:**
- Entfernung der "Betriebsausgabe" Logik (alle Ausgaben sind Betriebsausgaben)
- Statistik-Dashboard mit verschiedenen Zeiträumen
- Robuste Formvalidierung

### 3. Einmalige Einnahmen (OneTimeIncome.vue)
**Funktionalität:**
- Einnahmenverfolgung mit Kategorisierung
- Notizen und Beschreibungen
- Gesamtsummen-Berechnung
- Datum-basierte Sortierung

## Datenbankschemas

### RecurringExpense Schema
```json
{
  "name": "RecurringExpense",
  "label": "Recurring Expense",
  "naming": "manual",
  "fields": [
    {
      "fieldname": "name",
      "fieldtype": "Data",
      "label": "Name",
      "required": true
    },
    {
      "fieldname": "amount",
      "fieldtype": "Float",
      "label": "Amount",
      "required": true
    },
    {
      "fieldname": "frequency",
      "fieldtype": "Data",
      "label": "Frequency",
      "required": true
    },
    {
      "fieldname": "category",
      "fieldtype": "Data",
      "label": "Category"
    },
    {
      "fieldname": "description",
      "fieldtype": "Data",
      "label": "Description"
    },
    {
      "fieldname": "supplier",
      "fieldtype": "Data",
      "label": "Supplier"
    },
    {
      "fieldname": "nextPaymentDate",
      "fieldtype": "Date",
      "label": "Next Payment Date"
    },
    {
      "fieldname": "isActive",
      "fieldtype": "Data",
      "label": "Is Active"
    },
    {
      "fieldname": "invoiceDocument",
      "fieldtype": "Data",
      "label": "Invoice Document"
    },
    {
      "fieldname": "notes",
      "fieldtype": "Text",
      "label": "Notes"
    }
  ]
}
```

### OneTimeExpense Schema
```json
{
  "name": "OneTimeExpense",
  "label": "One Time Expense",
  "naming": "manual",
  "fields": [
    {
      "fieldname": "name",
      "fieldtype": "Data",
      "label": "Name",
      "required": true
    },
    {
      "fieldname": "amount",
      "fieldtype": "Float",
      "label": "Amount",
      "required": true
    },
    {
      "fieldname": "date",
      "fieldtype": "Date",
      "label": "Date",
      "required": true
    },
    {
      "fieldname": "category",
      "fieldtype": "Data",
      "label": "Category"
    },
    {
      "fieldname": "description",
      "fieldtype": "Text",
      "label": "Description",
      "required": true
    },
    {
      "fieldname": "supplier",
      "fieldtype": "Data",
      "label": "Supplier"
    },
    {
      "fieldname": "invoiceNumber",
      "fieldtype": "Data",
      "label": "Invoice Number"
    },
    {
      "fieldname": "taxAmount",
      "fieldtype": "Float",
      "label": "Tax Amount"
    },
    {
      "fieldname": "isBusinessExpense",
      "fieldtype": "Check",
      "label": "Is Business Expense",
      "default": false
    },
    {
      "fieldname": "attachments",
      "fieldtype": "Data",
      "label": "Attachments"
    },
    {
      "fieldname": "notes",
      "fieldtype": "Text",
      "label": "Notes"
    }
  ]
}
```

### OneTimeIncome Schema
```json
{
  "name": "OneTimeIncome",
  "label": "One Time Income",
  "naming": "manual",
  "fields": [
    {
      "fieldname": "name",
      "fieldtype": "Data",
      "label": "Name",
      "required": true
    },
    {
      "fieldname": "amount",
      "fieldtype": "Float",
      "label": "Amount",
      "required": true
    },
    {
      "fieldname": "date",
      "fieldtype": "Date",
      "label": "Date",
      "required": true
    },
    {
      "fieldname": "category",
      "fieldtype": "Data",
      "label": "Category"
    },
    {
      "fieldname": "description",
      "fieldtype": "Text",
      "label": "Description"
    },
    {
      "fieldname": "notes",
      "fieldtype": "Text",
      "label": "Notes"
    }
  ]
}
```

## Häufige Fehler und Lösungen

### 1. SqliteError: NOT NULL constraint failed
**Problem:** Felder sind in der Datenbank als NOT NULL definiert, aber werden nicht gesetzt.

**Lösung:**
```json
{
  "fieldname": "frequency",
  "fieldtype": "Data",
  "label": "Frequency",
  "required": true  // Wichtig: required: true hinzufügen
}
```

**Vue.js Validation:**
```typescript
const isFormValid = computed(() => {
  return newEntry.value.amount > 0 &&
         newEntry.value.description.trim() !== '' &&
         newEntry.value.frequency.trim() !== '';
});
```

### 2. Check Field Validation Error
**Problem:** Check-Felder (Boolean) können null-Werte enthalten, die zu Validierungsfehlern führen.

**Lösung:**
```json
{
  "fieldname": "isBusinessExpense",
  "fieldtype": "Check",
  "label": "Is Business Expense",
  "default": false  // Wichtig: Standardwert setzen
}
```

**Robustes Loading:**
```typescript
async function loadEntries() {
  try {
    const entries = await fyo.db.getAll('OneTimeExpense', {
      fields: ['name', 'amount', 'description', 'date', 'category'],
    });
    // Fallback ohne problematische Felder
  } catch (error) {
    if (error.message?.includes('isBusinessExpense')) {
      // Erneut ohne problematisches Feld laden
    }
  }
}
```

### 3. Modal Formatting Issues
**Problem:** Modals sind nicht responsive und nicht scrollbar bei viel Inhalt.

**Lösung - Konsistente Modal-Struktur:**
```html
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div class="bg-white dark:bg-gray-850 rounded-lg w-full max-w-2xl h-full max-h-[80vh] flex flex-col">
    <!-- Fixed Header -->
    <div class="p-6 pb-0 flex-shrink-0">
      <h3 class="text-lg font-medium">Titel</h3>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto p-6 pt-4">
      <!-- Form Content -->
    </div>

    <!-- Fixed Footer -->
    <div class="p-6 pt-0 flex-shrink-0 border-t dark:border-gray-700">
      <div class="flex justify-end gap-3">
        <!-- Buttons -->
      </div>
    </div>
  </div>
</div>
```

**Wichtige CSS-Klassen:**
- `flex flex-col`: Vertikales Layout
- `flex-shrink-0`: Header/Footer fixiert
- `flex-1 overflow-y-auto`: Scrollbarer Hauptbereich
- `max-h-[80vh]`: Maximale Höhe
- `p-4`: Außenabstand für mobile Ansicht

### 4. PDF Upload Implementation
**Problem:** File-Upload funktioniert nicht korrekt mit Frappe Books ORM.

**Lösung:**
```typescript
const uploadedFile = ref<File | null>(null);

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.type === 'application/pdf') {
      uploadedFile.value = file;
    } else {
      alert('Nur PDF-Dateien sind erlaubt.');
    }
  }
}

async function saveEntry() {
  // ... andere Felder setzen

  if (uploadedFile.value) {
    await doc.set('attachments', uploadedFile.value.name);
  }

  await doc.sync();
}
```

### 5. Vue.js Template Syntax Errors
**Problem:** "Element is missing end tag" Fehler.

**Lösung:** HTML-Tags sorgfältig prüfen und balancieren:
```html
<!-- Falsch -->
<div>
  <div>Content</div>
</div>  <!-- Extra schließendes Tag -->

<!-- Richtig -->
<div>
  <div>Content</div>
</div>
```

### 6. Database Table Not Found
**Problem:** Tabelle existiert nicht beim ersten Laden.

**Lösung:**
```typescript
async function loadEntries() {
  try {
    const entries = await fyo.db.getAll('OneTimeExpense');
    incomeEntries.value = entries || [];
  } catch (error) {
    if (error.message?.includes('no such table')) {
      console.log('Table will be created when first entry is saved.');
    }
    incomeEntries.value = [];
  }
}
```

## Entwicklungspatterns

### 1. Manual Naming Strategy
Alle Entities verwenden manual naming mit eindeutigen Zeitstempel-basierten IDs:

```typescript
const timestamp = Date.now();
const uniqueName = `OTE-${timestamp}`; // OneTimeExpense
const uniqueName = `RE-${timestamp}`;  // RecurringExpense
const uniqueName = `OTI-${timestamp}`; // OneTimeIncome

await doc.set('name', uniqueName);
```

### 2. Form Validation Pattern
```typescript
const isFormValid = computed(() => {
  return newEntry.value.amount > 0 &&
         newEntry.value.description.trim() !== '' &&
         newEntry.value.date !== '';
});
```

### 3. Error Handling Pattern
```typescript
try {
  await doc.sync();
  await loadEntries();
  cancelAdd();
  alert('Erfolgreich gespeichert!');
} catch (error) {
  console.error('Error saving:', error);
  alert(`Fehler: ${error.message}`);
}
```

### 4. Data Loading Pattern
```typescript
onMounted(async () => {
  await loadEntries();
});

onActivated(async () => {
  await loadEntries();
});
```

### 5. Reactive Data Pattern
```typescript
const entries = ref<any[]>([]);
const showAddForm = ref(false);

const sortedEntries = computed(() => {
  return [...entries.value].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
});

const totalAmount = computed(() => {
  return entries.value.reduce((sum, entry) => sum + (entry.amount || 0), 0);
});
```

## Navigation und Routing

Die Anwendung ist in `/src/utils/sidebarConfig.ts` konfiguriert:

```typescript
{
  label: 'Ausgaben',
  name: 'expenses',
  route: '/expenses',
  icon: 'credit-card',
  children: [
    {
      label: 'Wiederkehrende Zahlungen',
      name: 'recurring-expenses',
      route: '/recurring-expenses'
    },
    {
      label: 'Einmalige Ausgaben',
      name: 'one-time-expenses',
      route: '/one-time-expenses'
    }
  ]
}
```

## Styling Guidelines

### Tailwind CSS Klassen
- **Containers**: `bg-white dark:bg-gray-875`, `border dark:border-gray-800`
- **Text**: `text-gray-900 dark:text-gray-100`, `text-gray-600 dark:text-gray-400`
- **Buttons**: `bg-green-600 hover:bg-green-700`, `text-red-600 hover:text-red-900`
- **Forms**: `border border-gray-300 dark:border-gray-700`, `bg-white dark:bg-gray-900`

### Dark Mode Support
Alle UI-Komponenten unterstützen Dark Mode mit entsprechenden `dark:` Varianten.

## Testing und Debugging

### Console Logging Pattern
```typescript
console.log('Creating new entry...');
console.log('Form data:', newEntry.value);
console.log('Generated name:', uniqueName);
console.log('About to sync...');
console.log('Sync completed successfully');
```

### Development Server
```bash
npm run dev
```

### Database Inspection
Frappe Books erstellt SQLite-Datenbanken im lokalen Datenverzeichnis. Tabellen werden automatisch aus den Schema-Definitionen generiert.

## Zukünftige Entwicklung

### Best Practices
1. **Schema Changes**: Immer zuerst Schema aktualisieren, dann Vue-Komponenten
2. **Error Handling**: Robuste Try-Catch-Blöcke in allen async Funktionen
3. **Form Validation**: Client-seitige Validation vor Datenbank-Operationen
4. **Modal Design**: Konsistente Modal-Struktur für alle Formulare verwenden
5. **File Handling**: Immer Dateityp-Validation bei Uploads

### Troubleshooting Checklist
1. Schema korrekt in `/schemas/app/` definiert?
2. Schema in `/schemas/schemas.ts` registriert?
3. Required fields korrekt gesetzt?
4. Default-Werte für Check-Felder definiert?
5. Modal-Struktur mit korrektem Flexbox-Layout?
6. Error Handling implementiert?
7. Form Validation aktiv?

### Performance Considerations
- Lazy Loading von großen Datensätzen implementieren
- Datei-Uploads optimieren (Größenbeschränkungen)
- Caching für häufige Datenbankabfragen
- Pagination für Listen mit vielen Einträgen

Diese Dokumentation sollte als vollständige Referenz für die Weiterentwicklung des Projekts dienen und alle wichtigen Implementierungsdetails, häufige Probleme und deren Lösungen abdecken.

---

*Diese Dokumentation wurde erstellt, um neuen Claude Code Instanzen den kompletten Kontext und Implementierungs-Wissen des Projekts zu vermitteln.*