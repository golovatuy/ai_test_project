import 'dotenv/config';
import app from './src/app.js';
import logger from './src/utils/logger.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

