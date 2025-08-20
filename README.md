# NF2 — Node Framework v2

> 🚀 **NF2** is a modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── config/            # Application, DB, Express, Socket configurations
│   ├── database/
│   │   ├── entities/      # TypeORM Entities
│   │   ├── repositories/  # Custom Repositories
│   │   ├── seeders/       # Seeders for development/test data
│   ├── hooks/             # Lifecycle or registration hooks
│   ├── http/
│   │   ├── controllers/   # Route controllers
│   │   ├── middlewares/   # Express middlewares
│   │   └── validators/    # Input validators
│   ├── routes/            # Grouped route files (api, web, register)
│   ├── services/          # Service layer (business logic)
│
├── core/                  # Core utilities and framework logic
│   ├── *.core.ts           # Boot, Scope, Server, JWT, Mailer, TypeORM, etc.
│
├── types/                 # Custom types and global declarations
│
└── index.ts               # Application entry point
```

---

## ⚙️ Configuration (.env)

```env
# ============================================
# APPLICATION
# --------------------------------------------
# APP_ENV     : Environment mode (development, production, staging, etc.)
# APP_PORT    : Local server port
# APP_URL     : Base URL of the application
# APP_NAME    : Application name (optional)
# APP_TIMEZONE: Default timezone (recommended: UTC)
# ============================================
APP_ENV=development
APP_PORT=3456
APP_URL=http://localhost:3456
APP_NAME=NF2
APP_TIMEZONE=UTC

# ============================================
# DATABASE CONFIGURATION
# --------------------------------------------
# DB_STATUS   : on/off (enable or disable DB connection)
# DB_TYPE     : mysql | postgres | sqlite | mongodb | oracle
# DB_HOST     : Database host
# DB_PORT     : Database port
# DB_USER     : Database username
# DB_PASS     : Database password
# DB_NAME     : Database name
# DB_CHARSET  : Charset (MySQL only)
# DB_LOGGING  : on/off (query logging)
# DB_SYNC     : on/off (auto sync entities → schema)
# DB_SEED     : on/off (auto run seeders)
# ============================================
DB_STATUS=off
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=
DB_CHARSET=utf8mb4_general_ci
DB_LOGGING=off
DB_SYNC=on
DB_SEED=off

# ===== PostgreSQL Only =====
DB_SCHEMA=public

# ===== SQLite Only =====
DB_PATH=database.sqlite

# ===== MongoDB Only =====
DB_URL=mongodb://localhost:27017

# ===== Oracle Only =====
DB_SID=xe
DB_CONNECT_STRING=localhost/XEPDB1

# ============================================
# JWT AUTHENTICATION
# --------------------------------------------
# JWT_SECRET_KEY : Secret key for signing JWT tokens
# JWT_EXPIRE_IN  : Expiration in seconds (default 86400 = 24h)
# ============================================
JWT_SECRET_KEY=
JWT_EXPIRE_IN=86400

# ============================================
# COOKIE
# --------------------------------------------
# COOKIE_NAME     : Session cookie name
# COOKIE_SECRET   : Secret for signing cookies
# COOKIE_EXPIRE   : Expiration in seconds
# COOKIE_PATH     : Valid path
# COOKIE_SECURE   : true = HTTPS only
# COOKIE_HTTP_ONLY: true = block JS access
# ============================================
COOKIE_NAME=nf2_session
COOKIE_SECRET=
COOKIE_EXPIRE=86400
COOKIE_PATH=/
COOKIE_SECURE=false
COOKIE_HTTP_ONLY=true

# ============================================
# MAILER
# --------------------------------------------
# MAIL_DRIVER : smtp | gmail | sendgrid | etc.
# MAIL_HOST   : SMTP host (if MAIL_DRIVER=smtp)
# MAIL_PORT   : SMTP port (587 = TLS, 465 = SSL)
# MAIL_SECURE : true = SSL, false = TLS/STARTTLS
# MAIL_USER   : Auth username/email
# MAIL_PASS   : Auth password/app password
# MAIL_NAME   : Sender name
# ============================================
MAIL_DRIVER=smtp
MAIL_HOST=host.domain.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=mail@domain.com
MAIL_PASS=
MAIL_NAME=NF2
```

---

## ⚙️ Setup & Installation

### 1. Clone and Install

```bash
git clone https://github.com/refkinscallv/nf2.git ./
npm install
```

### 2. Create `.env`

```bash
cp .env.example .env
```

Fill in the environment variables according to your setup.

### 3. Build Project

```bash
npm run build
```

### 4. Run Development

```bash
npm run dev
```

> Uses `nodemon` with `ts-node` and `tsconfig-paths`.

---

## 🚀 Scripts

| Command            | Description                            |
| ------------------ | -------------------------------------- |
| `npm run dev`      | Run in development mode (with nodemon) |
| `npm run build`    | Compile TypeScript to JavaScript       |
| `npm start`        | Run compiled code from `dist/`         |
| `npm run lint`     | Lint the project with ESLint           |
| `npm run lint-fix` | Auto-fix ESLint issues                 |
| `npm run format`   | Format code using Prettier             |

---

## 🧱 Aliases (via `module-alias`)

| Alias     | Maps to         |
| --------- | --------------- |
| `@core/*` | `./src/core/*`  |
| `@app/*`  | `./src/app/*`   |
| `@type/*` | `./src/types/*` |

---

## 🧬 Tech Stack

* **Node.js** + **TypeScript**
* **Express 5**
* **TypeORM 0.3**
* **MySQL** (supports PostgreSQL, SQLite, etc.)
* **Socket.IO**
* **Class-Validator** + **Class-Transformer**
* **Nodemailer**, **JWT**, **Bcrypt**
* **Modular Clean Architecture**

---

## 🔒 Environment Variables

See `.env.example` for the full list of configuration options.

---

## 📦 Seeder

Seeders run automatically when `DB_SEED=on` in `.env`.

Seeder file example:

```ts
src/app/database/seeders/sample.seeder.ts
```

Register seeders:

```ts
src/app/database/seeders/register.seeder.ts
```

---

## 📄 License

MIT License © Refkinscallv
Contact: [refkinscallv@gmail.com](mailto:refkinscallv@gmail.com)
