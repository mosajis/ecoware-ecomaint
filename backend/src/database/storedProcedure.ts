import { connectPool } from "./pool";
import {
  spConfig,
  type SPNames,
  type SPConfigType,
} from "./storedProcedureConfig";
import { ConnectionPool, Request } from "mssql";

type ProcedureParams = {
  [key: string]: any; // Adjust this type if needed
};

// Define the function
export const runStoredProc = async <SP extends SPNames>(
  spName: SP,
  params: Partial<{
    [K in keyof SPConfigType[SP]["parameters"]]: any;
  }>
): Promise<{ recordset: any[]; output: ProcedureParams }> => {
  const sp = spConfig[spName];

  try {
    const pool: ConnectionPool = await connectPool();
    const request: Request = pool.request();

    // Add parameters to the request
    // @ts-ignore: Unreachable code error
    const procedureParams = sp.parameters;

    // Add parameters to the request
    for (const [key, config] of Object.entries(procedureParams)) {
      // @ts-ignore: Unreachable code error
      if (config.type === "output") {
        // @ts-ignore: Unreachable code error
        request.output(key, config.sqlType);
      } else {
        // @ts-ignore: Unreachable code error
        request.input(key, config.sqlType, params[key]);
      }
    }

    // Execute the stored procedure
    const result = await request.execute(spName);

    // Collect output parameters
    const output: ProcedureParams = {};
    for (const [key, config] of Object.entries(procedureParams)) {
      // @ts-ignore: Unreachable code error
      if (config.type === "output") {
        output[key] = result.output[key];
      }
    }

    return {
      recordset: result.recordset, // Data rows returned
      output, // Output parameters
    };
  } catch (err) {
    throw err;
  }
};
