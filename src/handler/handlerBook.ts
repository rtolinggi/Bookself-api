import type { ResponseToolkit, Request } from "@hapi/hapi";
import { v4 as uuidv4 } from "uuid";
import type { Books } from "../config/types";
import { books } from "../database/book";

export const getHandlerBook = async (request: Request, h: ResponseToolkit) => {
  books.sort((i, j) => {
    let firstCase = i.insertedAt.toLowerCase();
    let secondCase = j.insertedAt.toLowerCase();
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
  const { id } = request.params;
  const book = books.find((item) => item.id === id);

  if (!book) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: "success",
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

export const putHandlerBookById = async (
  request: Request,
  h: ResponseToolkit
) => {
  const { id } = request.params;
  const input = <Books>request.payload;

  if (!input.name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (
    typeof input.readPage === "number" &&
    typeof input.pageCount === "number"
  ) {
    if (input.readPage > input.pageCount) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    }
  }

  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = input;

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished: readPage === pageCount,
    updatedAt: new Date().toISOString(),
  };

  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
  response.code(200);
  return response;
};

export const postHandlerBook = async (request: Request, h: ResponseToolkit) => {
  const input = <Books>request.payload;

  if (!input.name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (
    typeof input.pageCount === "number" &&
    typeof input.readPage === "number"
  ) {
    if (input.readPage > input.pageCount) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    }
  }

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = input;

  const book: Books = {
    id: uuidv4(),
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: input.readPage === input.pageCount,
    reading,
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
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);
  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
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
