import { FC, ReactNode } from "react";
import { Link } from "@tanstack/react-router";

type Props<TParams extends Record<string, any> = any> = {
  value?: ReactNode;
  to: string; // path route
  params?: TParams; // params مثل id
  breadcrumb?: any;
  className?: string;
};

const CellLink = <TParams extends Record<string, any>>({
  value,
  to,
  params,
  breadcrumb,
  className,
}: Props<TParams>) => {
  if (!value) return null;

  return (
    <Link
      to={to}
      params={params}
      search={{ breadcrumb }}
      className={className}
      style={{ color: "unset" }}
    >
      {value}
    </Link>
  );
};

export default CellLink;
