import { tblDiscipline } from "./core/api/generated/api";
import { api } from "./service/axios";

const isProduction = process.env.NODE_ENV === "production";

export const developmentURL = "http://localhost:5273";

export const configAxios = {
  httpURL: isProduction ? "/" : developmentURL,
};

const menuLayouts = ["topBarMenu", "sidebarMenu"] as const;

export const menuLayout: (typeof menuLayouts)[number] = "topBarMenu";
