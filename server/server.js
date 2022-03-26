import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express from 'express';
import cron from 'node-cron';
import { uploadData } from './data/handler.js';
import typeDefs from './gql/schema.js';
import resolvers from './gql/resolvers.js';

dotenv.config();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});
const app = express();

apolloServer.start().then((res) => {
  apolloServer.applyMiddleware({ app });
  app.get('/rest', (req, res) => {
    res.json({
      data: 'API is working...',
    });
  });

  cron.schedule('* * * * *', () => {
    uploadData();
  });

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${process.env.PORT}`);
  });
});
