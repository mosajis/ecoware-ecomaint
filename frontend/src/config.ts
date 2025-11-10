const isProduction = process.env.NODE_ENV === "production";

export const configAxios = {
  httpURL: isProduction ? "/" : `http://localhost:5273`,
};
