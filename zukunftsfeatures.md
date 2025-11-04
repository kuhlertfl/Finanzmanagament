# Zukunfts-Features: Umfassendes Finanz- & Kundenverwaltungs-Tool

## Vision
Transformation von Frappe Books in ein umfassendes Tool für Kleinunternehmer zur Verwaltung von wiederkehrenden Abo-Einnahmen, Kunden, Ausgaben und Finanzen.

---

## Neue Struktur & Navigation

### Hauptbereiche (Sidebar):

```
📊 Dashboard
   └─ Finanzübersicht mit Charts & KPIs

👥 Kunden
   ├─ Alle Kunden
   ├─ Aktive Abos
   ├─ Gefährdete Kunden
   └─ Inaktive Kunden

💰 Einnahmen
   ├─ Monatsabrechnung (aktuell)
   ├─ Vergangene Abrechnungen
   └─ Zahlungshistorie

💸 Ausgaben
   ├─ Wiederkehrende Ausgaben
   ├─ Einmalige Ausgaben
   └─ Rechnungen & Belege

📈 Berichte & Analysen
   ├─ Gewinn & Verlust
   ├─ Cash-Flow
   └─ Jahresübersicht
```

---

## Feature-Übersicht nach Priorität

### Sprint 1: Kunden-Verwaltung erweitern ⭐ (AKTUELL)

#### 1.1 Erweitertes Kunden-Profil
- ✅ Name, Kontaktdaten (bereits vorhanden)
- **NEU:** Status-Feld: `Aktiv` | `Gefährdet` | `Inaktiv` | `Gekündigt`
- **NEU:** Vertrags-Upload (PDF/Dokumente)
- **NEU:** Vertragsdaten:
  - Vertragsbeginn
  - Vertragslaufzeit (Monatlich, Jährlich, etc.)
  - Kündigungsfrist
  - Monatlicher Betrag
- **NEU:** Notizen-Feld
- **NEU:** Zahlungshistorie-Ansicht

#### 1.2 Automatisches Status-Tracking
- System analysiert vergangene Abrechnungen
- Automatische Status-Aktualisierung:
  - **Aktiv**: Letzte 2 Monate korrekt bezahlt
  - **Gefährdet**: 1 Zahlung verpasst
  - **Inaktiv**: 2+ Zahlungen verpasst
  - **Gekündigt**: Manuell markiert

#### 1.3 Kunden-Detail-Ansicht
- Tab-Navigation:
  - **Übersicht**: Stammdaten, Status, Vertragsinformationen
  - **Vertrag**: Upload und Anzeige von Vertragsdokumenten
  - **Zahlungshistorie**: Alle vergangenen Zahlungen
  - **Notizen**: Freie Notizen zum Kunden

#### 1.4 Verbesserte Listen-Ansicht
- Farbliche Status-Kennzeichnung
- Filter nach Status
- Sortierung nach letzter Zahlung
- Quick-Actions (Details, Kündigen, etc.)

---

### Sprint 2: Ausgaben-Management 💸

#### 2.1 Wiederkehrende Ausgaben
**Schema: `RecurringExpense`**
- Name/Bezeichnung (z.B. "Büromiete")
- Betrag
- Intervall: Monatlich | Vierteljährlich | Jährlich
- Startdatum
- Kategorie: Miete | Personal | Marketing | Sonstiges
- Rechnung hochladen (optional)
- Aktiv/Inaktiv Status

#### 2.2 Einmalige Ausgaben
**Schema: `OneTimeExpense`**
- Name/Bezeichnung
- Betrag
- Datum
- Kategorie
- Rechnung hochladen (optional)
- Notizen

#### 2.3 Ausgaben-Übersicht
- Liste aller Ausgaben (gefiltert: Alle | Wiederkehrend | Einmalig)
- Monatliche Summe
- Upload-Bereich für Rechnungen/Belege
- Kategorisierung und Filterung

#### 2.4 Rechnungs-Archiv
- Zentrale Ablage aller hochgeladenen Rechnungen
- Suchfunktion
- Export als ZIP

---

### Sprint 3: Zahlungshistorie & Auto-Status 📊

#### 3.1 PaymentHistory Schema
**Schema: `PaymentHistory`**
- Verknüpfung zu Kunde
- Verknüpfung zu PaymentVerificationRecord
- Datum
- Erwarteter Betrag
- Bezahlter Betrag
- Status: Korrekt | Fehlerhaft | Fehlend

#### 3.2 Automatische Historien-Erstellung
- Nach jeder Monatsabrechnung: Erstelle PaymentHistory-Einträge
- Für jeden Kunden wird ein Eintrag erstellt
- Daten aus PaymentVerificationRecord

#### 3.3 Automatisches Kunden-Status-Update
- Nach Abrechnung: Analysiere letzten 2-3 Monate
- Update Kunden-Status automatisch
- Update `lastPaymentDate` und `missedPayments` Felder

#### 3.4 Zahlungshistorie-Ansicht
- Pro Kunde: Komplette Historie aller Zahlungen
- Filtert nach Jahr/Monat
- Export als CSV/PDF

---

### Sprint 4: Dashboard 🎯

#### 4.1 Haupt-KPIs (oben)
```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Erwartete       │ Tatsächliche    │ Monatliche      │ Gewinn/Verlust  │
│ Einnahmen       │ Einnahmen       │ Ausgaben        │ (Aktueller Mon.)│
│ 5.000 €         │ 4.750 € (95%)   │ 2.500 €         │ +2.250 €        │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

#### 4.2 Monats-Trend Chart
- Linie: Einnahmen (erwartet vs. tatsächlich)
- Linie: Ausgaben
- Linie: Gewinn/Verlust
- Zeitraum: Letzte 6 oder 12 Monate wählbar
- Interaktiv mit Hover-Informationen

#### 4.3 Kunden-Status Widget
```
┌──────────────────────────┐
│ Kunden-Status            │
├──────────────────────────┤
│ 🟢 Aktiv:       45       │
│ 🟡 Gefährdet:    3       │
│ 🔴 Inaktiv:      2       │
│ ⚫ Gekündigt:     5       │
└──────────────────────────┘
```

#### 4.4 Wichtige Aktionen & Alerts
- **Überfällige Zahlungen**: Liste mit direkten Links zu Kunden
- **Auslaufende Verträge**: Verträge die in nächsten 30 Tagen auslaufen
- **Gefährdete Kunden**: Quick-Links zu Kunden mit 1 verpasster Zahlung
- **Letzte Aktivitäten**: Timeline der letzten Aktionen

#### 4.5 Quick-Stats
- MRR (Monthly Recurring Revenue)
- Zahlungsquote (%)
- Churn-Rate (letzte 3 Monate)
- Durchschnittlicher Kundenwert

---

### Sprint 5: Berichte & Analysen 📈

#### 5.1 Gewinn & Verlust Report
- Einnahmen vs. Ausgaben pro Monat
- Kategorisiert nach Ausgaben-Typ
- Detaillierte Aufschlüsselung
- Vergleich mit Vormonat/Vorjahr
- Export als PDF

#### 5.2 Cash-Flow Prognose
- **Erwartete Einnahmen nächster Monat**: Basierend auf aktiven Abos
- **Geplante Ausgaben nächster Monat**: Wiederkehrende + geplante einmalige
- **Voraussichtlicher Gewinn**
- **Trend-Prognose**: "Bei aktuellem Wachstum: +X€ in 3 Monaten"
- **Worst-Case-Szenario**: "Wenn Y Kunden kündigen: -Z€"

#### 5.3 Jahresübersicht
- Gesamteinnahmen (Jahr)
- Gesamtausgaben (Jahr)
- Gewinn (Jahr)
- MRR-Entwicklung (Chart)
- Churn-Rate (Jahresschnitt)
- Top-Ausgaben-Kategorien

#### 5.4 Monatsvergleich
- Januar vs. Februar vs. März
- Beste/Schlechteste Monate
- Saisonale Trends erkennen

#### 5.5 Export-Funktionen
- **PDF-Berichte**: Professionelle Reports für Steuerberater
- **CSV-Export**: Rohdaten für Excel/Buchhaltung
- **Quartalsübersicht**: Für Umsatzsteuer-Voranmeldung

---

## Neue Datenbank-Schemas

### 1. SubscriptionCustomer (Erweitern)
```json
{
  "name": "SubscriptionCustomer",
  "fields": [
    // Bestehend:
    "name", "email", "phone", "monthlyAmount",

    // NEU:
    {
      "fieldname": "status",
      "label": "Status",
      "fieldtype": "Select",
      "options": ["Aktiv", "Gefährdet", "Inaktiv", "Gekündigt"],
      "default": "Aktiv"
    },
    {
      "fieldname": "contractStartDate",
      "label": "Vertragsbeginn",
      "fieldtype": "Date"
    },
    {
      "fieldname": "contractInterval",
      "label": "Vertragslaufzeit",
      "fieldtype": "Select",
      "options": ["Monatlich", "Jährlich", "Individuell"]
    },
    {
      "fieldname": "noticePeriod",
      "label": "Kündigungsfrist",
      "fieldtype": "Data"
    },
    {
      "fieldname": "contractDocument",
      "label": "Vertrag (PDF)",
      "fieldtype": "Attach"
    },
    {
      "fieldname": "notes",
      "label": "Notizen",
      "fieldtype": "Text"
    },
    {
      "fieldname": "lastPaymentDate",
      "label": "Letzte Zahlung",
      "fieldtype": "Date",
      "readOnly": true
    },
    {
      "fieldname": "missedPayments",
      "label": "Verpasste Zahlungen",
      "fieldtype": "Int",
      "default": 0,
      "readOnly": true
    }
  ]
}
```

### 2. RecurringExpense (NEU)
```json
{
  "name": "RecurringExpense",
  "label": "Wiederkehrende Ausgabe",
  "naming": "autoincrement",
  "fields": [
    {
      "fieldname": "name",
      "label": "ID",
      "fieldtype": "Data",
      "required": true,
      "readOnly": true
    },
    {
      "fieldname": "description",
      "label": "Bezeichnung",
      "fieldtype": "Data",
      "required": true
    },
    {
      "fieldname": "amount",
      "label": "Betrag",
      "fieldtype": "Currency",
      "required": true
    },
    {
      "fieldname": "interval",
      "label": "Intervall",
      "fieldtype": "Select",
      "options": ["Monatlich", "Vierteljährlich", "Jährlich"],
      "default": "Monatlich"
    },
    {
      "fieldname": "startDate",
      "label": "Startdatum",
      "fieldtype": "Date",
      "required": true
    },
    {
      "fieldname": "category",
      "label": "Kategorie",
      "fieldtype": "Select",
      "options": ["Miete", "Personal", "Marketing", "Software", "Sonstiges"]
    },
    {
      "fieldname": "receiptDocument",
      "label": "Rechnung/Beleg",
      "fieldtype": "Attach"
    },
    {
      "fieldname": "active",
      "label": "Aktiv",
      "fieldtype": "Check",
      "default": true
    }
  ]
}
```

### 3. OneTimeExpense (NEU)
```json
{
  "name": "OneTimeExpense",
  "label": "Einmalige Ausgabe",
  "naming": "autoincrement",
  "fields": [
    {
      "fieldname": "name",
      "label": "ID",
      "fieldtype": "Data",
      "required": true,
      "readOnly": true
    },
    {
      "fieldname": "description",
      "label": "Bezeichnung",
      "fieldtype": "Data",
      "required": true
    },
    {
      "fieldname": "amount",
      "label": "Betrag",
      "fieldtype": "Currency",
      "required": true
    },
    {
      "fieldname": "date",
      "label": "Datum",
      "fieldtype": "Date",
      "required": true
    },
    {
      "fieldname": "category",
      "label": "Kategorie",
      "fieldtype": "Select",
      "options": ["Miete", "Personal", "Marketing", "Software", "Sonstiges"]
    },
    {
      "fieldname": "receiptDocument",
      "label": "Rechnung/Beleg",
      "fieldtype": "Attach"
    },
    {
      "fieldname": "notes",
      "label": "Notizen",
      "fieldtype": "Text"
    }
  ]
}
```

### 4. PaymentHistory (NEU)
```json
{
  "name": "PaymentHistory",
  "label": "Zahlungshistorie",
  "naming": "autoincrement",
  "fields": [
    {
      "fieldname": "name",
      "label": "ID",
      "fieldtype": "Data",
      "required": true,
      "readOnly": true
    },
    {
      "fieldname": "customer",
      "label": "Kunde",
      "fieldtype": "Link",
      "target": "SubscriptionCustomer",
      "required": true
    },
    {
      "fieldname": "verificationRecord",
      "label": "Abrechnung",
      "fieldtype": "Link",
      "target": "PaymentVerificationRecord"
    },
    {
      "fieldname": "date",
      "label": "Datum",
      "fieldtype": "Date",
      "required": true
    },
    {
      "fieldname": "expectedAmount",
      "label": "Erwarteter Betrag",
      "fieldtype": "Currency",
      "required": true
    },
    {
      "fieldname": "paidAmount",
      "label": "Bezahlter Betrag",
      "fieldtype": "Currency",
      "default": 0
    },
    {
      "fieldname": "status",
      "label": "Status",
      "fieldtype": "Select",
      "options": ["Korrekt", "Fehlerhaft", "Fehlend"],
      "required": true
    }
  ]
}
```

---

## Automatisierungen

### 1. Nach jeder Monatsabrechnung:
- Erstelle PaymentHistory-Einträge für alle Kunden
- Aktualisiere Kunden-Status automatisch
- Aktualisiere `lastPaymentDate` und `missedPayments`
- Trigger Dashboard-Neuberechnung

### 2. Dashboard-Berechnungen:
- **Erwartete Einnahmen**: Summe aller aktiven Kunden (`monthlyAmount`)
- **Tatsächliche Einnahmen**: Summe aus letzter PaymentVerification
- **Monatliche Ausgaben**:
  - Wiederkehrende Ausgaben (berechnet für aktuellen Monat)
  - Einmalige Ausgaben (Summe aktueller Monat)
- **Gewinn**: Tatsächliche Einnahmen - Monatliche Ausgaben

### 3. Status-Update-Logik:
```javascript
function updateCustomerStatus(customer, paymentHistory) {
  const last2Months = paymentHistory.slice(-2);
  const missedCount = last2Months.filter(p => p.status === 'Fehlend').length;

  if (missedCount === 0) return 'Aktiv';
  if (missedCount === 1) return 'Gefährdet';
  if (missedCount >= 2) return 'Inaktiv';
}
```

---

## User Experience Prinzipien

✅ **Übersichtlich**: Max. 3-4 Hauptbereiche in Sidebar
✅ **Schnell**: Wichtigste Info im Dashboard auf einen Blick
✅ **Automatisch**: Status-Updates, Berechnungen laufen automatisch
✅ **Flexibel**: Filter, Zeiträume anpassbar
✅ **Vollständig**: Alle Dokumente zentral (Verträge, Rechnungen, Abrechnungen)
✅ **Intuitiv**: Klare Farbcodierung (Grün=Gut, Gelb=Warnung, Rot=Problem)
✅ **Actionable**: Direkte Links zu Aktionen (Kunde kontaktieren, etc.)

---

## Technische Implementierung

### Verwendete Libraries:
- **Chart.js** oder **recharts**: Für Dashboard-Charts
- **jspdf** & **jspdf-autotable**: PDF-Export (bereits vorhanden)
- **date-fns**: Datum-Berechnungen
- **Vue 3 Composition API**: Komponenten-Struktur

### Datei-Upload:
- Verwendung von Frappe's `Attach` fieldtype
- Speicherung in lokalen Datenbank/Dateisystem
- Preview-Funktion für PDFs

### Performance:
- Lazy-Loading für große Listen
- Pagination bei Zahlungshistorie
- Caching von Dashboard-Berechnungen

---

## Roadmap

### Phase 1: Foundation (Woche 1-2)
- ✅ Sprint 1: Kunden-Verwaltung erweitern

### Phase 2: Ausgaben (Woche 3)
- Sprint 2: Ausgaben-Management

### Phase 3: Intelligence (Woche 4)
- Sprint 3: Zahlungshistorie & Auto-Status

### Phase 4: Insights (Woche 5)
- Sprint 4: Dashboard

### Phase 5: Analytics (Woche 6)
- Sprint 5: Berichte & Analysen

---

## Future Ideas (Backlog)

- **E-Mail-Integration**: Automatische Zahlungserinnerungen versenden
- **Rechnungserstellung**: Automatische Rechnungsgenerierung für Kunden
- **Multi-Währungs-Support**: Für internationale Kunden
- **API-Integration**: Anbindung an Buchhaltungssoftware (DATEV, etc.)
- **Mobile App**: Für unterwegs
- **Benachrichtigungen**: Browser-Notifications bei wichtigen Events
- **Backup & Restore**: Automatische Backups
- **Multi-User**: Mehrere Benutzer mit Rollen-Verwaltung

---

*Erstellt: 2025-01-04*
*Status: In Entwicklung*
