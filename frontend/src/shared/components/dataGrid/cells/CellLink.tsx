import Box from "@mui/material/Box";
import { ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";

type Props<TParams extends Record<string, any> = any> = {
  value?: ReactNode;
  to: string; // path route
  params?: TParams; // params مثل id
  breadcrumb?: string;
};

const CellLink = <TParams extends Record<string, any>>({
  value,
  to,
  params,
  breadcrumb,
}: Props<TParams>) => {
  if (!value) return null;
  const router = useRouter();

  const handleClick = () => {
    const href = router.buildLocation({
      to,
      params,
      search: {
        breadcrumb: breadcrumb ?? "",
      },
    }).href;

    window.open(href, "_blank");
  };

  return (
    <span
      onClick={handleClick}
      style={{ textDecoration: "underline", cursor: "pointer" }}
    >
      {value}
    </span>
  );
};

export default CellLink;
