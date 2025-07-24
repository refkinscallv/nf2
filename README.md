# NF2 — Node Framework v2

> 🚀 **NF2** is a modular, opinionated, and lightweight backend framework for Node.js built with TypeScript, Express.js, and TypeORM.

---

## 📁 Project Structure

```

src/
├── app/
│   ├── config/            # App, DB, Express, Socket configs
│   ├── database/
│   │   ├── entities/      # TypeORM Entities
│   │   ├── repositories/  # Custom Repositories
│   │   ├── seeders/       # Seeders for dev/test data
│   ├── hooks/             # Lifecycle or register hooks
│   ├── http/
│   │   ├── controllers/   # Route controllers
│   │   ├── middlewares/  # Express middlewares
│   │   └── validators/    # Input validation
│   ├── routes/            # Grouped route files (api, web, register)
│   ├── services/          # Service logic (business layer)
│
├── core/                  # Core utilities and framework logic
│   ├── \*.core.ts          # Boot, Scope, Server, JWT, Mailer, TypeORM, etc.
│
├── types/                 # Custom types and global declarations
│
└── index.ts               # App entry point

````

---

## ⚙️ Configuration (.env)

```env
# ============================================
# APPLICATION
# ============================================
APP_ENV=development                             # Defines the environment where the app is running (e.g., development, production)
APP_PORT=3456                                   # Optional port for running the application locally
APP_URL=http://localhost:3456                   # Base URL for the application; remove port in production
APP_NAME=NF2                                    # Application name (optional, use as needed globally)
APP_TIMEZONE=UTC                                # Sets the timezone for app logic and data storage (recommended: UTC)

# ============================================
# DATABASE CONFIGURATION
# ============================================
DB_STATUS=off                                   # Enable or disable database connection (off = app runs without DB)
DB_TYPE=mysql                                   # Type of database: mysql, postgres, sqlite, mongodb, oracle
DB_HOST=localhost                               # Hostname where the database is running
DB_PORT=3306                                    # Port number for the DB server
DB_USER=root                                    # Database username
DB_PASS=                                        # Database password (leave empty if not required)
DB_NAME=                                        # Name of the database
DB_CHARSET=utf8mb4_general_ci                   # Character set used for database tables (MySQL only)
DB_LOGGING=off                                  # Enable or disable query logging
DB_SYNC=on                                      # Auto-create DB schema based on entities (use with caution)
DB_SEED=off                                     # Automatically run database seeders (TypeORM sync)

# ===== PostgreSQL Only =====
DB_SCHEMA=public                                # Schema name used in PostgreSQL. Only used when DB_TYPE is 'postgres'

# ===== SQLite Only =====
DB_PATH=database.sqlite                         # Path to SQLite database file. Only used when DB_TYPE is 'sqlite'

# ===== MongoDB Only =====
DB_URL=mongodb://localhost:27017                # Connection string for MongoDB. Only used when DB_TYPE is 'mongodb'

# ===== Oracle Only =====
DB_SID=xe                                       # Oracle System ID (SID). Only used when DB_TYPE is 'oracle'
DB_CONNECT_STRING=localhost/XEPDB1              # Oracle connection string. Only used when DB_TYPE is 'oracle'

# ============================================
# JWT AUTHENTICATION
# ============================================
JWT_SECRET_KEY=                                 # Secret key used to sign JWT tokens
JWT_EXPIRE_IN=86400                             # Token expiration time in seconds (e.g., 86400 = 24 hours)

# ============================================
# COOKIE
# ============================================
COOKIE_NAME=nf2_session                         # Cookie name used for session tracking
COOKIE_SECRET=                                  # Secret used to sign/encrypt cookies
COOKIE_EXPIRE=86400                             # Cookie expiration time in seconds (e.g., 86400 = 24 hours)
COOKIE_PATH=/                                   # Cookie valid path
COOKIE_SECURE=false                             # Use true for HTTPS environments
COOKIE_HTTP_ONLY=true                           # Prevent JavaScript access to cookies (security best practice)

# ============================================
# MAILER
# ============================================
MAIL_DRIVER=gmail                               # Email service provider (e.g., smtp, sendgrid, gmail)
MAIL_USER=youremail@gmail.com                   # Email address used to send mails
MAIL_PASS=                                      # Password or app-specific password for mail authentication
MAIL_NAME=NF2                                   # Name that appears as the sender
```

---

## ⚙️ Setup & Installation

### 1. Clone and Install

```bash
git clone https://github.com/your-user/nf2.git
cd nf2
npm install
````

### 2. Create `.env`

```bash
cp .env.example .env
```

Isi variabel environment sesuai kebutuhan.

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

| Command            | Description                      |
| ------------------ | -------------------------------- |
| `npm run dev`      | Run in dev mode (with nodemon)   |
| `npm run build`    | Compile TypeScript to JavaScript |
| `npm start`        | Run compiled code from `dist/`   |
| `npm run lint`     | Lint the project with ESLint     |
| `npm run lint-fix` | Auto-fix ESLint issues           |
| `npm run format`   | Format code with Prettier        |

---

## 🧱 Aliases (via `module-alias`)

| Alias     | Maps to         |
| --------- | --------------- |
| `@core/*` | `./src/core/*`  |
| `@app/*`  | `./src/app/*`   |
| `@type/*` | `./src/types/*` |

---

## 🧪 Testing (Coming Soon)

> Jest or Supertest integration can be added easily.

---

## 🧬 Tech Stack

* **Node.js** + **TypeScript**
* **Express 5**
* **TypeORM 0.3**
* **MySQL** (support for PostgreSQL, SQLite, etc.)
* **Socket.IO**
* **Class-Validator** + **Class-Transformer**
* **Nodemailer**, **JWT**, **Bcrypt**
* **Modular Clean Architecture**

---

## 🔒 Environment Variables

Lihat `.env.example` untuk daftar lengkap konfigurasi.

---

## 📦 Seeder

Seeder dijalankan otomatis saat `DB_SEED=on` di `.env`.

Seeder file:

```ts
src/app/database/seeders/sample.seeder.ts
```

Register seeder:

```ts
src/app/database/seeders/register.seeder.ts
```

---

## 📄 License

MIT License © Refkinscallv
Contact: [refkinscallv@gmail.com](mailto:refkinscallv@gmail.com)
