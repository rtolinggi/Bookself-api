import Hapi from "@hapi/hapi";
import { HOST, PORT } from "./config/constant";
import {
  deleteRouteBookById,
  getRouteBook,
  getRouteBookById,
  postRouteBook,
  putRouteBookById,
} from "./routes/routeBook";
import("dotenv/config");

const init = async () => {
  const server = Hapi.server({
    port: parseInt(String(PORT)) || 5000,
    host: process.env.NODE_ENV === "production" ? HOST : "localhost",
  });

  server.route([
    postRouteBook,
    getRouteBook,
    getRouteBookById,
    putRouteBookById,
    deleteRouteBookById,
  ]);

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
