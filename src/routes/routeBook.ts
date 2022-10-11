import type { ServerRoute } from "@hapi/hapi";
import {
  deleteHandlerBookById,
  getHandlerBook,
  getHandlerBookById,
  postHandlerBook,
  putHandlerBookById,
} from "../handler/handlerBook";

const getRouteBook: ServerRoute = {
  path: "/books",
  method: "GET",
  handler: getHandlerBook,
};

const getRouteBookById: ServerRoute = {
  path: "/books/{id}",
  method: "GET",
  handler: getHandlerBookById,
};

const putRouteBookById: ServerRoute = {
  path: "/books/{id}",
  method: "PUT",
  handler: putHandlerBookById,
};

const deleteRouteBookById: ServerRoute = {
  path: "/books/{id}",
  method: "DELETE",
  handler: deleteHandlerBookById,
};

const postRouteBook: ServerRoute = {
  path: "/books",
  method: "POST",
  handler: postHandlerBook,
};

export const routeBook = [
  getRouteBook,
  getRouteBookById,
  postRouteBook,
  putRouteBookById,
  deleteRouteBookById,
];
