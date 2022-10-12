import type { ResponseToolkit, Request } from "@hapi/hapi";
import { v4 as uuidv4 } from "uuid";
import type { Books } from "../config/types";
import { books } from "../database/book";
import {
  deleteValidation,
  getIdValidation,
  postValidation,
  putValidation,
} from "../validation/validationBook";

export const getHandlerBook = async (request: Request, h: ResponseToolkit) => {
  const query = request.query;
  const [key] = Object.keys(query);
  if (key) {
    const data = books
      .filter((item) => {
        if (key === "name") {
          return item.name.toLowerCase().includes(query.name.toLowerCase());
        }
        if (key === "reading") {
          return parseInt(query.reading) ? item.reading : !item.reading;
        }
        if (key === "finished") {
          return parseInt(query.finished) ? item.finished : !item.finished;
        }
      })
      .map((item) => {
        return {
          id: item.id,
          name: item.name,
          publisher: item.publisher,
        };
      });

    const response = h.response({
      status: "success",
      data: {
        books: data,
      },
    });
    response.code(200);
    return response;
  }

  books.sort((i, j) => {
    const firstCase = i.insertedAt.toLowerCase();
    const secondCase = j.insertedAt.toLowerCase();
    if (firstCase < secondCase) {
      return 1;
    } else if (firstCase > secondCase) {
      return -1;
    } else {
      return 0;
    }
  });

  const data = books.map((item) => {
    return {
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    };
  });

  const response = h.response({
    status: "success",
    data: {
      books: data,
    },
  });
  response.code(200);
  return response;
};

export const getHandlerBookById = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { error, data } = getIdValidation(request);

  if (error) {
    const response = h.response(error);
    response.code(404);
    return response;
  }

  const response = h.response({
    status: "success",
    data: {
      book: data,
    },
  });
  response.code(200);
  return response;
};

export const putHandlerBookById = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { error, data, index } = putValidation(request);

  if (error?.message === "Gagal memperbarui buku. Mohon isi nama buku") {
    const response = h.response(error);
    response.code(400);
    return response;
  }

  if (
    error?.message ===
    "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
  ) {
    const response = h.response(error);
    response.code(400);
    return response;
  }

  if (error?.message === "Gagal memperbarui buku. Id tidak ditemukan") {
    const response = h.response(error);
    response.code(404);
    return response;
  }

  if (index >= 0 && data) {
    books[index] = {
      ...books[index],
      name: data.name,
      year: data.year,
      author: data.author,
      summary: data.summary,
      publisher: data.publisher,
      pageCount: data.pageCount,
      readPage: data.readPage,
      reading: data.reading,
      finished: data.readPage === data.pageCount,
      updatedAt: new Date().toISOString(),
    };
  }

  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
  response.code(200);
  return response;
};

export const postHandlerBook = async (request: Request, h: ResponseToolkit) => {
  const { error, data } = postValidation(request);

  if (error?.message === "Gagal menambahkan buku. Mohon isi nama buku") {
    const response = h.response(error);
    response.code(400);
    return response;
  }

  if (
    error?.message ===
    "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
  ) {
    const response = h.response(error);
    response.code(400);
    return response;
  }

  const book: Books = {
    id: uuidv4(),
    name: data?.name as string,
    year: data?.year,
    author: data?.author,
    summary: data?.summary,
    publisher: data?.publisher,
    pageCount: data?.pageCount,
    readPage: data?.readPage,
    finished: data?.readPage === data?.pageCount,
    reading: data?.reading as boolean,
    insertedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    books.push(book);
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: book.id,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    const response = h.response({
      status: "error",
      message: "Buku gagal ditambahkan",
    });
    response.code(500);
    return response;
  }
};

export const deleteHandlerBookById = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { error, index } = deleteValidation(request);

  if (error) {
    const response = h.response(error);
    response.code(404);
    return response;
  }

  books.splice(index, 1);
  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });
  response.code(200);
  return response;
};
