# Bolicare Vitals

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

### Run frontend + Mock API in parallel (optional)

```bash
npm install concurrently --save-dev
npm run dev:all
```

---

## Build (optional)

```bash
npm run build
```

- Generates production files in the `dist/` folder
- For local use only
