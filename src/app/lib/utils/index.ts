"use client";

import { Hex, isAddress, isHex, slice } from "viem";

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

/**
 * Resume an address based on a given bytes. Useful format to display address
 * like `0x63A7...3A43` if `bytes` is 4
 * @param address - The address to resume
 * @param bytes - The bytes to use on the output
 */
export const addressResumer = (address: string, bytes: number) => {
  if (!isAddress(address)) {
    throw new Error("Not valid address - addressResumer");
  }
  return sliceString(address, bytes);
};

/**
 * Resume an hash based on a given bytes. Useful format to display hashes
 * like `0x63A73a...3A43f5` if `bytes` is 6
 * @param hash - The hash to resume
 * @param bytes - The bytes to use on the output
 */
export const hashResumer = (hash: string, bytes: number) => {
  if (!isHex(hash, { strict: false })) {
    throw new Error("Not valid hash - hashResumer");
  }
  return sliceString(hash, bytes);
};

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours() + 1;
  const minute = date.getMinutes() + 1;
  const seconds = date.getSeconds() + 1;

  return `${day.toString()} / ${month.toString()} / ${year.toString()} At ${hour}:${minute}:${seconds}  `;
};

const sliceString = (hexData: Hex, bytes: number) => {
  return (
    slice(hexData, 0, bytes) +
    "..." +
    slice(hexData, hexData.length / 2 - bytes - 1).replace("0x", "")
  );
};

export function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) {
    return `${seconds} ${seconds == 1 ? "second" : "seconds"} ago`;
  } else if (hours < 1) {
    return `${minutes} ${minutes == 1 ? "minute" : "minutes"} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours == 1 ? "hour" : "hours"} ago`;
  } else if (days < 7) {
    return `${days} ${days == 1 ? "day" : "days"} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export const processTime = (time: number | string): Date => {
  if (typeof time == "string") {
    time = parseInt(time);
  }

  return new Date(time * 1000);
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
