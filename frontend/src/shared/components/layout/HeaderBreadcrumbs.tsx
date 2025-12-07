import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useRouter, useRouterState } from "@tanstack/react-router";

export default function HeaderBreadcrumbs() {
  const router = useRouter();
  const { matches } = useRouterState();

  const breadcrumbMatches = matches.filter((m) => m.context?.breadcrumb);

  return (
    <Box display="flex" gap={1} alignItems="center">
      {breadcrumbMatches.map((match, index) => {
        const label = match.context!.breadcrumb;
        const isLast = index === breadcrumbMatches.length - 1;

        return (
          <Box key={match.routeId} display="flex" alignItems="center" gap={1}>
            {isLast ? (
              <Typography fontWeight={700}>{label}</Typography>
            ) : (
              <Typography
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  router.navigate({ to: match.pathname, params: match.params })
                }
              >
                {label}
              </Typography>
            )}
            {!isLast && <Typography>/</Typography>}
          </Box>
        );
      })}
    </Box>
  );
}
