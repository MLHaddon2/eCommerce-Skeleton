import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';
import axios from 'axios';
import path from 'path';
import crypto from "crypto";

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;

var allowlist = process.env.ALLOW_LIST || 'http://localhost:3000';

var corsOptionsDelegate = function (req, callback) {
    var corsOptions = {
      origin: process.env.CLIENT_ORIGIN || true,
      credentials: true,
      optionsSuccessStatus: 200
    };

    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

// ── Shared cookie configuration ───────────────────────────────────────────────
// Keep these names in sync with the client-side COOKIE_KEYS in cookieUtils.js.
export const COOKIE_KEYS = {
    SESSION_ID: 'sessionId',
    USER_ID:    'user_id',
};

export const cookieOptions = {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge:   parseInt(process.env.COOKIE_MAX_AGE) || 1000 * 60 * 60 * 24 * 7, // 7 days
    path:     '/',
};

// ── Cookie-seeding middleware ─────────────────────────────────────────────────
// Seeds a sessionId on every request.
// user_id should be set explicitly by your auth/login routes via:
//   res.cookie(COOKIE_KEYS.USER_ID, id, cookieOptions)
const seedCookies = (req, res, next) => {
    if (!req.cookies?.[COOKIE_KEYS.SESSION_ID]) {
        const sessionId = crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2);
        res.cookie(COOKIE_KEYS.SESSION_ID, sessionId, cookieOptions);
    }
    next();
};

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(cookieParser());
app.use(seedCookies);

app.use('/api', router);

app.get('/proxy', async (req, res) => {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Server Error With API');
    }
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build/index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
