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
