import { httpServer, server, app } from "./server";

const PORT = 5000;

server.start().then(() => {
  server.applyMiddleware({ app });
  httpServer.listen({ port: PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    )
  );
});
