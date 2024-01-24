// index.ts

import express from 'express';
import userRoutes from './routes/userRoutes';
import { sequelize } from './services/database';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/users', userRoutes);

// Sync the database and start the server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
