import sql from "mssql";

export const spConfig = {
  State_GetAll_Front: {
    parameters: {},
  },
} as const;

export type SPConfigType = typeof spConfig;
export type SPNames = keyof SPConfigType;
