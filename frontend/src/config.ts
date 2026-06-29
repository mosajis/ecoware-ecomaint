const isProduction = process.env.NODE_ENV === "production";

export const developmentURL = "http://localhost:5273";

export const configAxios = {
  httpURL: isProduction ? "/" : developmentURL,
};
