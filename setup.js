// setup.js
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// === 1. setup log directory ===
const logDir = path.join(__dirname, './logs')

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
    console.log(`[SETUP] Logs directory successfully created`)
} else {
    console.log(`[SETUP] Logs directory already exists`)
}

// === 2. setup .env file ===
const envFile = path.join(__dirname, '.env')
const envExample = path.join(__dirname, '.env.example')

if (!fs.existsSync(envFile)) {
    if (fs.existsSync(envExample)) {
        fs.copyFileSync(envExample, envFile)
        console.log(`[SETUP] .env file created from .env.example`)
    } else {
        console.warn(`[SETUP] .env.example not found, skipping .env setup`)
    }
} else {
    console.log(`[SETUP] .env file already exists`)
}

// === 3. generate secret keys ===
function ensureSecretKey(key) {
    const env = fs.readFileSync(envFile, 'utf-8').split('\n')
    let updated = false

    const newEnv = env.map(line => {
        if (line.startsWith(key + '=')) {
            if (line.trim() === `${key}=`) {
                const secret = crypto.randomBytes(32).toString('hex')
                updated = true
                console.log(`[SETUP] Generated ${key}`)
                return `${key}=${secret}`
            }
        }
        return line
    })

    if (updated) {
        fs.writeFileSync(envFile, newEnv.join('\n'))
    }
}

setTimeout(() => {
    if (fs.existsSync(envFile)) {
        ensureSecretKey('JWT_SECRET_KEY')
        ensureSecretKey('COOKIE_SECRET')
    }
}, 1500)
