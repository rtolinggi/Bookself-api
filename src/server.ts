import Hapi from "@hapi/hapi";
import { HOST, PORT } from "./config/constant";
import { routeBook } from "./routes/routeBook";
import("dotenv/config");

const init = async () => {
  const server = Hapi.server({
    port: parseInt(String(PORT)) || 5000,
    host: process.env.NODE_ENV === "production" ? HOST : "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route([...routeBook]);

  await server.start();

  console.log(
    `Server Running in HOST ${server.info.host} PORT ${server.info.port}`
  );
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
