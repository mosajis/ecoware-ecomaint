import AppRouter from "./router";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "@/shared/theme/AppTheme";
import {Toaster} from "sonner";
import {type ReactNode} from "react";
import {QueryClientProvider} from "@tanstack/react-query";
import {Provider as JotaiProvider} from "jotai";
import {queryClient} from "@/core/api/queryClient";

interface ProvidersProps {
  children?: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <AppTheme>
          <CssBaseline enableColorScheme />
          <AppRouter />
          {children}
        </AppTheme>

        <Toaster />
      </QueryClientProvider>
    </JotaiProvider>
  );
};

export default Providers;
