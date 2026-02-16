import Printable from "./Printable";
import { forwardRef, ReactNode } from "react";

export interface PrintLayoutProps {
  header?: ReactNode;
  footer?: ReactNode;
  content: ReactNode;
  headerHeight?: number;
  footerHeight?: number;
  pagePadding?: number;
}

const PrintLayout = forwardRef<HTMLDivElement, PrintLayoutProps>(
  (
    {
      header,
      footer,
      content,
      headerHeight = 100,
      footerHeight = 45,
      pagePadding = 11,
    },
    ref,
  ) => {
    return (
      <Printable
        ref={ref}
        headerHeight={headerHeight}
        footerHeight={footerHeight}
        pagePadding={pagePadding}
        Header={header}
        Footer={footer}
        Content={content}
      />
    );
  },
);

export default PrintLayout;
