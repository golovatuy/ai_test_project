import 'dotenv/config';

const requiredEnvVars = [
  'MONGODB_URI',
  // 'OPENAI_API_KEY', // Temporarily commented out for testing without API key
  'PORT',
  'NODE_ENV'
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

export default validateEnv;

