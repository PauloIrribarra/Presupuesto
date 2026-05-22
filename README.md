# Presupuesto

Aplicacion web para controlar un presupuesto personal por ciclos de pago. Permite registrar ingresos y gastos, ver el saldo disponible del ciclo actual, revisar el disponible diario y analizar movimientos agrupados por categoria.

## Funcionalidades

- Registro de movimientos como gasto o ingreso.
- Categorias configuradas para cuentas, comida, suscripciones, negocios, ahorro y otros.
- Calculo automatico del ciclo segun el dia de pago.
- Metricas de saldo actual, gastos, ingresos y disponible diario.
- Resumen de gastos e ingresos por categoria.
- Historial responsive con opcion de eliminar movimientos.
- Tema claro/oscuro persistente.
- Persistencia local con `localStorage`.
- Autenticacion opcional con Supabase.
- Configuracion PWA basica mediante manifest.

## Requisitos

- Node.js
- npm

## Instalacion

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores si quieres usar autenticacion.

```env
VITE_AUTH_ENABLED=true
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Si `VITE_AUTH_ENABLED` no es `true`, la app funciona sin login y guarda los datos solo en el navegador.

## Estado actual

La vista principal esta operativa. La vista de ahorros esta preparada como base para una siguiente etapa, pero aun no guarda ni calcula ahorro acumulado. Supabase se usa para autenticacion; los movimientos todavia no se sincronizan con la base de datos.
