# 🟡 Ora Backend

API REST para **Ora**, una app personal de finanzas construida con Bun, Express, Prisma y Supabase.

---

## 📋 Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Base de datos](#base-de-datos)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Endpoints](#endpoints)
- [Autenticación](#autenticación)
- [Inteligencia Artificial](#inteligencia-artificial)
- [Correos con Resend](#correos-con-resend)
- [Deploy en Railway](#deploy-en-railway)

---

## 🛠 Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| [Bun](https://bun.sh) | 1.x | Runtime y gestor de paquetes |
| [Express](https://expressjs.com) | 5.x | Framework HTTP |
| [Prisma](https://prisma.io) | 7.x | ORM |
| [Supabase](https://supabase.com) | 2.x | Auth + PostgreSQL |
| [Zod](https://zod.dev) | 4.x | Validación de datos |
| [Gemini AI](https://ai.google.dev) | 0.24.x | Inteligencia artificial |
| [Resend](https://resend.com) | 6.x | Envío de correos |

---

## ✅ Requisitos previos

Antes de comenzar asegúrate de tener instalado:

- **Bun** >= 1.0 → [Instalar Bun](https://bun.sh/docs/installation)
- **Git**
- Cuenta en **Supabase** → [supabase.com](https://supabase.com)
- Cuenta en **Google AI Studio** → [aistudio.google.com](https://aistudio.google.com)
- Cuenta en **Resend** → [resend.com](https://resend.com)

---

## 🚀 Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/ora-backend.git
cd ora-backend
```

### 2. Instala las dependencias

```bash
bun install
```

### 3. Copia el archivo de variables de entorno

```bash
cp .env.example .env
```

### 4. Configura las variables de entorno

Edita el archivo `.env` con tus credenciales (ver sección [Variables de entorno](#variables-de-entorno)).

### 5. Genera el cliente de Prisma

```bash
bun db:generate
```

### 6. Ejecuta las migraciones

```bash
bun db:migrate
```

### 7. (Opcional) Ejecuta el seed con datos de prueba

```bash
bun db:seed
```

> ⚠️ El seed requiere que exista un usuario registrado con el email `johan@test.com`. Regístralo primero via `POST /api/auth/register`.

### 8. Inicia el servidor en desarrollo

```bash
bun dev
```

El servidor estará corriendo en `http://localhost:3000`.

---

## 🔑 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Supabase
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Base de datos (usar Session Pooler de Supabase para IPv4)
DATABASE_URL=postgresql://postgres.xxxx:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres

# Servidor
PORT=3000
NODE_ENV=development

# Gemini AI (Google AI Studio)
GEMINI_API_KEY=AIza...

# Resend
RESEND_API_KEY=re_...
```

### ¿Cómo obtener cada variable?

**Supabase:**
1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. En `Project Settings → API` copia `Project URL`, `anon public` y `service_role`
3. En `Project Settings → Database → Connect → Session pooler` copia la URI y reemplaza `[YOUR-PASSWORD]`

**Gemini AI:**
1. Ve a [aistudio.google.com](https://aistudio.google.com)
2. Click en `Get API Key → Create API Key`

**Resend:**
1. Ve a [resend.com](https://resend.com) y crea una cuenta
2. En `API Keys` crea una nueva key con permisos `Full access`

---

## 🗄 Base de datos

El proyecto usa **PostgreSQL** alojado en Supabase con **Prisma 7** como ORM.

### Comandos de base de datos

```bash
# Ejecutar migraciones en desarrollo
bun db:migrate

# Generar el cliente de Prisma
bun db:generate

# Abrir Prisma Studio (interfaz visual de la DB)
bun db:studio

# Ejecutar el seed con datos de prueba
bun db:seed

# Resetear la base de datos (¡cuidado! borra todo)
bun db:reset
```

### Modelos

| Modelo | Descripción |
|---|---|
| `User` | Usuario de la app |
| `Transaction` | Ingresos y egresos |
| `Group` | Grupos de transacciones (fiado, cuentas abiertas) |
| `Budget` | Presupuestos mensuales por categoría |
| `Goal` | Metas de ahorro |
| `Debt` | Deudas con seguimiento de pago |
| `Todo` | Tareas financieras pendientes |

---

## 📜 Scripts disponibles

```bash
bun dev          # Servidor en modo desarrollo con hot reload
bun start        # Servidor en producción
bun build        # Compilar TypeScript
bun db:migrate   # Ejecutar migraciones
bun db:generate  # Generar cliente Prisma
bun db:studio    # Abrir Prisma Studio
bun db:seed      # Poblar DB con datos de prueba
bun db:reset     # Resetear base de datos
```

---

## 📁 Estructura del proyecto

```
ora-backend/
├── generated/
│   └── prisma/              # Cliente Prisma generado (no editar)
├── prisma/
│   ├── migrations/          # Historial de migraciones
│   ├── schema.prisma        # Esquema de la base de datos
│   ├── seed.ts              # Datos de prueba
│   └── prisma.config.ts     # Configuración de Prisma 7
├── src/
│   ├── config/
│   │   ├── gemini.ts        # Configuración Gemini AI
│   │   ├── prisma.ts        # Instancia de Prisma Client
│   │   ├── resend.ts        # Configuración Resend
│   │   └── supabase.ts      # Clientes Supabase (admin + público)
│   ├── controllers/         # Lógica de cada módulo
│   ├── middlewares/
│   │   ├── auth.middleware.ts      # Verificación de JWT
│   │   ├── error.middleware.ts     # Manejo global de errores
│   │   └── validate.middleware.ts  # Validación con Zod
│   ├── routes/              # Definición de endpoints
│   ├── schemas/             # Schemas de validación Zod
│   ├── services/
│   │   ├── ai.service.ts    # Lógica de IA con Gemini
│   │   └── resend.service.ts # Lógica de correos
│   └── index.ts             # Punto de entrada del servidor
├── .env                     # Variables de entorno (no subir a git)
├── .env.example             # Plantilla de variables de entorno
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

---

## 🔗 Endpoints

Todos los endpoints protegidos requieren el header:
```
Authorization: Bearer <token>
```

### Auth

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registrar usuario | ❌ |
| POST | `/api/auth/login` | Iniciar sesión | ❌ |
| POST | `/api/auth/logout` | Cerrar sesión | ✅ |
| GET | `/api/auth/me` | Perfil del usuario | ✅ |

**Registro:**
```json
POST /api/auth/register
{
  "email": "usuario@email.com",
  "password": "MiPassword123",
  "name": "Mi Nombre"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "usuario@email.com",
  "password": "MiPassword123"
}
```

---

### Transacciones

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/transactions` | Listar transacciones (con filtros) |
| GET | `/api/transactions/:id` | Obtener una transacción |
| POST | `/api/transactions` | Crear transacción |
| PUT | `/api/transactions/:id` | Actualizar transacción |
| DELETE | `/api/transactions/:id` | Eliminar transacción |

**Query params para GET /api/transactions:**
```
?type=INCOME|EXPENSE
&category=Comida
&frequency=ONCE|DAILY|WEEKLY|MONTHLY|YEARLY
&groupId=uuid
&startDate=2026-01-01T00:00:00.000Z
&endDate=2026-03-31T23:59:59.000Z
&page=1
&limit=20
```

**Crear transacción:**
```json
POST /api/transactions
{
  "type": "EXPENSE",
  "amount": 45000,
  "category": "Comida",
  "description": "Almuerzo",
  "date": "2026-03-29T12:00:00.000Z",
  "frequency": "ONCE",
  "reminderOn": false
}
```

---

### Grupos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/groups` | Listar grupos |
| GET | `/api/groups/:id` | Obtener grupo con transacciones |
| POST | `/api/groups` | Crear grupo |
| PUT | `/api/groups/:id` | Actualizar grupo |
| DELETE | `/api/groups/:id` | Eliminar grupo |
| POST | `/api/groups/:id/transactions` | Agregar movimiento al grupo |

**Crear grupo:**
```json
POST /api/groups
{
  "name": "Tienda Don Jorge",
  "type": "EXPENSE",
  "category": "Mercado",
  "dueDate": "2026-04-30T00:00:00.000Z",
  "reminderOn": true,
  "description": "Fiado mensual"
}
```

**Agregar movimiento al grupo:**
```json
POST /api/groups/:id/transactions
{
  "amount": 25000,
  "description": "Aceite y arroz",
  "date": "2026-03-29T10:00:00.000Z"
}
```

---

### Presupuestos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/budgets` | Listar presupuestos con % gastado |
| POST | `/api/budgets` | Crear presupuesto |
| PUT | `/api/budgets/:id` | Actualizar presupuesto |
| DELETE | `/api/budgets/:id` | Eliminar presupuesto |

**Query params para GET /api/budgets:**
```
?month=3&year=2026
```

**Crear presupuesto:**
```json
POST /api/budgets
{
  "category": "Comida",
  "limitAmount": 300000,
  "month": 3,
  "year": 2026
}
```

---

### Metas

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/goals` | Listar metas con % de progreso |
| POST | `/api/goals` | Crear meta |
| PUT | `/api/goals/:id` | Actualizar meta |
| DELETE | `/api/goals/:id` | Eliminar meta |

```json
POST /api/goals
{
  "name": "Laptop nueva",
  "targetAmount": 2000000,
  "savedAmount": 500000,
  "deadline": "2026-12-31T00:00:00.000Z"
}
```

---

### Deudas

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/debts` | Listar deudas con % pagado |
| POST | `/api/debts` | Crear deuda |
| PUT | `/api/debts/:id` | Actualizar deuda |
| DELETE | `/api/debts/:id` | Eliminar deuda |

```json
POST /api/debts
{
  "name": "Tarjeta de crédito",
  "totalAmount": 800000,
  "paidAmount": 200000,
  "dueDate": "2026-04-15T00:00:00.000Z",
  "reminderOn": true
}
```

---

### To-do

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/todos` | Listar tareas (con filtros) |
| POST | `/api/todos` | Crear tarea |
| PUT | `/api/todos/:id` | Actualizar tarea |
| DELETE | `/api/todos/:id` | Eliminar tarea |

**Query params para GET /api/todos:**
```
?date=2026-03-29T00:00:00.000Z
&done=false
```

---

### Reportes

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/reports/summary` | Resumen financiero con gráficos |
| GET | `/api/reports/upcoming-payments` | Pagos próximos (7 días) |

**Query params para summary:**
```
?startDate=2026-01-01T00:00:00.000Z
&endDate=2026-03-31T23:59:59.000Z
```

---

### Inteligencia Artificial

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/ai/daily-tip` | Consejo financiero del día |
| GET | `/api/ai/report-summary` | Resumen hablado del periodo |
| GET | `/api/ai/suggest-budgets` | Sugerencias de presupuesto |
| POST | `/api/ai/voice-action` | Interpretar acción por voz |

**Query params para report-summary:**
```
?startDate=2026-01-01T00:00:00.000Z
&endDate=2026-03-31T23:59:59.000Z
```

**Voice action:**
```json
POST /api/ai/voice-action
{
  "transcript": "anota un gasto de veinte mil pesos en comida de hoy"
}
```

---

## 🔐 Autenticación

La API usa **Supabase Auth** para gestionar usuarios. El flujo es:

1. El cliente hace `POST /api/auth/login`
2. El servidor devuelve un `token` JWT de Supabase
3. El cliente incluye el token en cada petición: `Authorization: Bearer <token>`
4. El middleware `authenticate` verifica el token contra Supabase y adjunta el `userId` a la request

Los tokens expiran según la configuración de Supabase (por defecto 1 hora). Usa el `refreshToken` para renovar la sesión.

---

## 🤖 Inteligencia Artificial

La IA usa **Gemini 2.5 Flash Lite** de Google. Las funcionalidades son:

- **Tip diario** — analiza tus gastos del mes y genera un consejo personalizado
- **Resumen hablado** — genera un resumen conversacional de tus finanzas para un periodo
- **Sugerencias de presupuesto** — analiza tu historial de 3 meses y sugiere límites por categoría
- **Acciones por voz** — interpreta texto transcrito y extrae la intención y datos para registrar

El modelo se configura en `src/config/gemini.ts`. Para cambiar el modelo edita:
```typescript
export const geminiModel = gemini.getGenerativeModel({
  model: "gemini-2.5-flash-lite", // cambia aquí
});
```

---

## 📧 Correos con Resend

Los recordatorios de pago se envían con **Resend**. En el plan gratuito:

- Solo puedes enviar al email verificado de tu cuenta Resend
- El remitente debe ser `onboarding@resend.dev`
- Para enviar a otros emails necesitas verificar un dominio propio

El servicio de correo está en `src/services/resend.service.ts`.

---

## 🚂 Deploy en Railway

1. Crea una cuenta en [railway.app](https://railway.app)
2. Crea un nuevo proyecto → `Deploy from GitHub repo`
3. Selecciona el repositorio `ora-backend`
4. En `Variables` agrega todas las variables del `.env`
5. En `Settings → Start Command` pon: `bun src/index.ts`
6. Railway detectará automáticamente Bun y hará el deploy

> ⚠️ Asegúrate que el archivo `generated/` esté commiteado en git ya que Prisma necesita el cliente generado en producción.

---

## 🏥 Health Check

```
GET /api/health
```

Respuesta:
```json
{
  "ok": true,
  "message": "Ora API funcionando 🟢"
}
```

---

## 📝 Licencia

Proyecto personal — todos los derechos reservados.
