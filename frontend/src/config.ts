const isProduction = import.meta.env.MODE === "production";

export const developmentURL = "http://localhost:5273";

export const configAxios = {
  httpURL: isProduction ? "/" : developmentURL,
};

const menuLayouts = ["topBarMenu", "sidebarMenu"] as const;

export const menuLayout: (typeof menuLayouts)[number] = "topBarMenu";
