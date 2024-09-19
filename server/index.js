import express from "express";
import { ApolloServer } from "apollo-server-express";

const app = express();

const port = process.env.PORT || 4008;



app.listen(port, () => {
  console.log(`GraphQL Server is running at http://localhost:${port}`);
});
