const isProduction = process.env.NODE_ENV === "production";
export const configAxios = {
    httpURL: isProduction ? "/api/" : `http://localhost:3000`,
};
