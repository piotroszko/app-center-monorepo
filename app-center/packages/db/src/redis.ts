import { createClient } from "redis";

const redisClientSingleton = () => {
  return createClient({
    database: 0,
    url: "redis://localhost:6379",
  });
};

declare const globalThis: {
  redisGlobal: ReturnType<typeof redisClientSingleton>;
} & typeof global;

const redis = globalThis.redisGlobal ?? redisClientSingleton();

export { redis };

if (process.env.NODE_ENV !== "production") globalThis.redisGlobal = redis;
