import { Address, Hex, isAddress, isHex, slice } from "viem";

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
  return sliceHex(address, bytes);
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
  return sliceHex(hash, bytes);
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

export function truncateString(str: string) {
  if (str.length <= 13) {
    return str;
  }
  const firsts = str.slice(0, 5);
  const lasts = str.slice(-5);
  return firsts + "..." + lasts;
}

const sliceHex = (hexData: Hex, bytes: number) => {
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

export function checkAddress(
  value: string | undefined | null
): value is Address {
  return value !== null && value !== undefined && isAddress(value);
}

export function getUrl(refererUrl: string | null) {
  // This is on the vercel production env.
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return "https://" + process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Automatically set by Vercel. (preview deployments)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return "https://" + process.env.NEXT_PUBLIC_VERCEL_URL + "/";
  }

  if (refererUrl) {
    const urlEntity = new URL(refererUrl);
    return urlEntity.origin + "/";
  }

  return "http://localhost:3000/";
}

export const copyText = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // NOTE: This is a fallback for browsers that doesn't support
      // the Clipboard API like localhost or HTTP sites (not HTTPS)
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    }
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
};
