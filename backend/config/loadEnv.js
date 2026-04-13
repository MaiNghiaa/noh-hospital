const path = require('path');
const dotenv = require('dotenv');

// Load backend/.env (preferred) then repo-root .env (fallback)
const backendEnv = path.join(__dirname, '..', '.env');
const rootEnv = path.join(__dirname, '..', '..', '.env');

dotenv.config({ path: backendEnv });
dotenv.config({ path: rootEnv });

