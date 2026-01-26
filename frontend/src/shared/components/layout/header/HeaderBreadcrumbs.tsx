import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useRouter, useRouterState, useSearch } from "@tanstack/react-router";

export default function HeaderBreadcrumbs() {
  const router = useRouter();
  const { matches } = useRouterState();
  const allSearch = useSearch({ strict: false });

  // فقط matches با breadcrumb رو فیلتر کن
  const breadcrumbMatches = matches.filter((m) => m.context?.breadcrumb);

  // اگر هیچ breadcrumb نبود، خیلی چیزی رندر نشو
  if (breadcrumbMatches.length === 0) {
    return null;
  }

  return (
    <Box display="flex" gap={1} alignItems="center">
      {breadcrumbMatches.map((match, index) => {
        const isLast = index === breadcrumbMatches.length - 1;

        const label =
          typeof match.context!.breadcrumb === "function"
            ? match.context!.breadcrumb(match)
            : match.context!.breadcrumb;

        return (
          <Box key={match.id} display="flex" alignItems="center" gap={1}>
            {isLast ? (
              <Typography fontWeight={700}>{label}</Typography>
            ) : (
              <Typography
                sx={{
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() =>
                  router.navigate({ to: match.pathname, search: allSearch })
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
