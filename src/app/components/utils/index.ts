"use client";
export function wrapPromise<T>(promise: Promise<T>) {
  let status: "pending" | "success" | "error" = "pending";
  let response: T | undefined;

  const suspender = promise.then(
    (res) => {
      status = "success";
      response = res;
    },
    (err) => {
      status = "error";
      response = err;
    }
  );

  const read = () => {
    switch (status) {
      case "pending":
        throw suspender;
      case "error":
        // Throw an error object ???
        throw response;
      default:
        return response as T;
    }
  };

  return { read };
}
