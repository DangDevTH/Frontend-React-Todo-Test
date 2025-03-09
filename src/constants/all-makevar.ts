import { makeVar } from "@apollo/client";

export const authenticatedVar = makeVar<boolean>(false);
export const isLoadingVar = makeVar<boolean>(true);
export const userIdVar = makeVar<number | null>(null);
