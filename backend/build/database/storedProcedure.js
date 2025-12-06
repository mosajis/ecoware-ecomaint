import { connectPool } from "./pool";
import { spConfig, } from "./storedProcedureConfig";
import { ConnectionPool, Request } from "mssql";
// Define the function
export const runStoredProc = async (spName, params) => {
    const sp = spConfig[spName];
    try {
        const pool = await connectPool();
        const request = pool.request();
        // Add parameters to the request
        // @ts-ignore: Unreachable code error
        const procedureParams = sp.parameters;
        // Add parameters to the request
        for (const [key, config] of Object.entries(procedureParams)) {
            // @ts-ignore: Unreachable code error
            if (config.type === "output") {
                // @ts-ignore: Unreachable code error
                request.output(key, config.sqlType);
            }
            else {
                // @ts-ignore: Unreachable code error
                request.input(key, config.sqlType, params[key]);
            }
        }
        // Execute the stored procedure
        const result = await request.execute(spName);
        // Collect output parameters
        const output = {};
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
    }
    catch (err) {
        throw err;
    }
};
