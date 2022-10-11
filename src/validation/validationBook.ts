import type { Request } from "@hapi/hapi";
import { books } from "../database/book";
import type { Books } from "../config/types";

export const getIdValidation = (request: Request) => {
  const { id } = request.params;
  const book = books.find((item) => item.id === id);

  if (!book) {
    const error = {
      status: "fail",
      message: "Buku tidak ditemukan",
    };
    return { error, data: null };
  }

  return { error: null, data: book };
};

export const putValidation = (request: Request) => {
  const { id } = request.params;
  const input = <Books>request.payload;

  if (!input.name) {
    const error = {
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    };
    return { error, data: null, index: -1 };
  }

  if (
    typeof input.readPage === "number" &&
    typeof input.pageCount === "number"
  ) {
    if (input.readPage > input.pageCount) {
      const error = {
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      };
      return { error, data: null, index: -1 };
    }
  }

  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    const error = {
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    };
    return { error, data: null, index: -1 };
  }

  return { error: null, data: input, index };
};

export const postValidation = (request: Request) => {
  const input = <Books>request.payload;

  if (!input.name) {
    const error = {
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    };
    return { error, data: null };
  }

  if (
    typeof input.pageCount === "number" &&
    typeof input.readPage === "number"
  ) {
    if (input.readPage > input.pageCount) {
      const error = {
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      };
      return { error, data: input };
    }
  }

  return { error: null, data: input };
};

export const deleteValidation = (request: Request) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);
  if (index === -1) {
    const error = {
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    };
    return { error };
  }

  return { error: null, index };
};
