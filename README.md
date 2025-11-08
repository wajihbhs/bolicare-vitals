# Vita Care

Vue 3 + Vuetify 3 application for managing and monitoring patients, including interactive vital signs, charts, and forms.

---

## Technologies

- Vue 3
- Vuetify 3
- Pinia
- Vue Router
- Vue-i18n
- Apexchart
- vue-toastification
- Axios
- json-server (local mock API)
- Vitest + Testing Library

---

## Prerequisites

- Node.js v22.14.0
- npm v10+
- Git

---

## Installation

### Install dependencies

From the root of your local project:

```bash
npm install
```

---

## Local Development

### Run the frontend

```bash
npm run dev
```

### Run the Mock API

```bash
npm run mock:api
```
- The API is available at `http://localhost:3333`
- Example: `http://localhost:3333/api/patients`

## Mock Database Example

This project uses **JSON Server** as a mock REST API hosted on **Vercel**.  
Below is an example entry from `src/mock/db.json`, representing a patient record used for testing and visualization.

```json
{
  "patients": [
    {
      "id": "1",
      "firstName": "John",
      "lastName": "Doe",
      "age": 14,
      "medicalRecordNumber": "MR123456",
      "vitals": {
        "heartRate": [90, 85, 88, 92, 89, 90],
        "temperature": [37.1],
        "bloodPressure": [
          { "systolic": 120, "diastolic": 80 }
        ],
        "oxygenSaturation": [100]
      }
    }
  ]
}
```

### Mobile (Capacitor)

```bash
# Synchronise Capacitor
npx cap sync

# Android
npx cap open android
# Build and run from Android Studio

# iOS
npx cap open ios
# Build and Run from Xcode

```

---
### Unit tests

```bash
npm run test:unit
npm run test:unit:ui
```

---

### E2E tests

```bash
npm run test:e2e
npm run test:e2e:ui
```

---

## Build and Preview(optional)

```bash
npm run build
npm run preview
```

## Production links

The application is deployed on Vercel and available online:

```bash
Web App       : https://bolicare-vitals.vercel.app/
API Patients  : https://bolicare-vitals.vercel.app/api/patients
API PatientID : https://bolicare-vitals.vercel.app/api/patients/[id]
```


- Generates production files in the `dist/` folder
- For local use only
