import { appRouter } from "../server";
import { serverCaller } from "../server/trpc";

export const trpcServer = serverCaller(appRouter)({});
