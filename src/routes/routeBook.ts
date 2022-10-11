import type { ServerRoute } from "@hapi/hapi";
import {
  deleteHandlerBookById,
  getHandlerBook,
  getHandlerBookById,
  postHandlerBook,
  putHandlerBookById,
} from "../handler/handlerBook";

export const getRouteBook: ServerRoute = {
  path: "/books",
  method: "GET",
  handler: getHandlerBook,
};

export const getRouteBookById: ServerRoute = {
  path: "/books/{id}",
  method: "GET",
  handler: getHandlerBookById,
};

export const putRouteBookById: ServerRoute = {
  path: "/books/{id}",
  method: "PUT",
  handler: putHandlerBookById,
};

export const deleteRouteBookById: ServerRoute = {
  path: "/books/{id}",
  method: "DELETE",
  handler: deleteHandlerBookById,
};

export const postRouteBook: ServerRoute = {
  path: "/books",
  method: "POST",
  handler: postHandlerBook,
};
