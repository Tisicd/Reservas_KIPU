# Reservas Tziwu

Sistema de reservas para eventos de intercambio cultural. Diseñado para un negocio local con ~100 clientes semanales y una base de datos pequeña.

## Características

- **Reservas públicas**: Los asistentes pueden reservar su lugar en eventos activos
- **Registro de asistentes** con:
  - Nombre completo
  - Edad
  - Idiomas que hablan
  - Cómo se enteraron del evento
  - Detección automática de usuarios nuevos vs. clientes frecuentes
- **Flujo de pago integrado**:
  - Selección de método de pago (QR, tarjeta, pago en evento)
  - **De Una! — Banco Pichincha**: Código QR para pago móvil
  - **Stripe**: Ejemplo de integración con tarjeta de crédito (modo prueba)
- **Panel de administración protegido** con:
  - Autenticación por contraseña
  - Crear eventos con fecha, hora y ubicación
  - Ver lista de asistentes por evento
  - Consultar base de clientes
  - Estadísticas básicas
  - Eliminar reservas

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Túnel público (ngrok)

```bash
npm run dev       # primero inicia el servidor
ngrok http 3000   # en otra terminal, expone localhost:3000
```

## Configuración

Copia `.env.local` y ajusta las variables:

### Administración

| Variable | Descripción | Default |
|----------|-------------|---------|
| `ADMIN_PASSWORD` | Contraseña para acceder a /admin | `admin123` |
| `ADMIN_SESSION_SECRET` | Secreto para firmar tokens de sesión | (cambiar en producción) |

### Métodos de pago

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PAYMENT_METHODS` | Métodos habilitados: `qr`, `stripe`, `both` | `both` |

#### De Una! — Banco Pichincha (QR)

| Variable | Descripción |
|----------|-------------|
| `PICHINCHA_QR_IMAGE` | Ruta de la imagen QR (colocar en /public) |
| `PICHINCHA_ACCOUNT_NAME` | Nombre del titular de la cuenta |
| `PICHINCHA_ACCOUNT_ID` | Número de cuenta o identificación |
| `PICHINCHA_PHONE` | Teléfono asociado a De Una! |
| `PICHINCHA_AMOUNT` | Monto a cobrar (0 = sin monto fijo) |

#### Stripe (modo prueba)

| Variable | Descripción |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe |
| `STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe |
| `STRIPE_PRICE` | Precio en centavos (0 = sin precio) |
| `STRIPE_CURRENCY` | Moneda (usd, eur, etc.) |

## Seguridad

- Las credenciales de pago y administración se configuran exclusivamente mediante variables de entorno en `.env.local`
- El archivo `.env.local` está en `.gitignore` y nunca se sube al repositorio
- Los datos sensibles de pago (QR, claves) se sirven solo desde el servidor a través de APIs protegidas
- El panel de administración requiere autenticación con token firmado

## Uso

### Para la administradora

1. Ve a **Administración** (`/admin`)
2. Ingresa la contraseña configurada
3. Crea un evento indicando título, fecha, hora y **ubicación**
4. Comparte el enlace principal con los asistentes
5. Revisa las reservas en el detalle de cada evento
6. Usa "Cerrar sesión" al terminar

### Para los asistentes

1. Entra a la página principal
2. Elige un evento y haz clic en **Reservar lugar**
3. Completa el formulario con tus datos
4. Selecciona el método de pago:
   - **De Una!**: Escanea el QR con tu app de Banco Pichincha
   - **Tarjeta**: Paga con Stripe (modo prueba)
   - **Pagar en el evento**: Confirma sin pago en línea
5. Recibe la confirmación de tu reserva

## Estructura del proyecto

```
src/
├── app/
│   ├── admin/                    # Panel de administración
│   │   ├── layout.tsx            # Layout público del admin (sin auth)
│   │   ├── (auth)/               # Grupo de rutas protegidas
│   │   │   ├── layout.tsx        # Verifica autenticación
│   │   │   ├── page.tsx          # Dashboard
│   │   │   ├── clientes/         # Directorio de clientes
│   │   │   └── eventos/[id]/     # Detalle de evento + asistentes
│   │   └── login/                # Página de inicio de sesión
│   ├── api/
│   │   ├── admin/                # APIs protegidas (eventos, reservas)
│   │   ├── auth/                 # Login/logout
│   │   ├── payment/              # Configuración de pago
│   │   ├── eventos/              # API pública de eventos
│   │   └── reservas/             # API pública de reservas
│   ├── reservar/[id]/            # Flujo de reserva público
│   └── page.tsx                  # Página principal
├── components/
│   ├── FormularioReserva.tsx     # Formulario multi-paso + pago
│   ├── FormularioEvento.tsx      # Creación de eventos (admin)
│   ├── PaymentSelector.tsx       # Selector de método de pago
│   ├── PaymentQR.tsx             # Pantalla de QR De Una!
│   ├── StripePayment.tsx         # Formulario Stripe (ejemplo)
│   ├── BotonEliminarReserva.tsx  # Eliminar reserva (admin)
│   └── BotonCerrarSesion.tsx     # Cerrar sesión admin
├── db/                           # Base de datos SQLite + Drizzle ORM
├── lib/
│   ├── actions.ts                # Operaciones CRUD
│   ├── auth.ts                   # Autenticación admin
│   ├── payment.ts                # Configuración de pagos
│   └── constants.ts              # Opciones y utilidades
└── middleware.ts                  # Protección de rutas admin
```

## Tecnología

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- SQLite (better-sqlite3)
- Drizzle ORM
- Stripe (ejemplo de integración)
- Banco Pichincha "De Una!" (QR)
