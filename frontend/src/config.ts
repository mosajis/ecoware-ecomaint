const isProduction = process.env.NODE_ENV === "production";

export const configAxios = {
  httpURL: isProduction ? "/" : `http://46.100.16.242:5273`,
};
