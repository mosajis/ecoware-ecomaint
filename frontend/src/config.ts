import { tblDiscipline } from "./core/api/generated/api";
import { api } from "./service/axios";

const isProduction = import.meta.env.MODE === "production";

export const developmentURL = "http://194.147.142.13:5273";

export const configAxios = {
  httpURL: isProduction ? "/" : developmentURL,
};

const menuLayouts = ["topBarMenu", "sidebarMenu"] as const;

export const menuLayout: (typeof menuLayouts)[number] = "topBarMenu";
