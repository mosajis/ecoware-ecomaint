import Printable from "./Printable";
import { forwardRef, ReactNode } from "react";

interface PrintLayoutProps {
  header?: ReactNode;
  footer?: ReactNode;
  content: ReactNode;
  headerHeight?: number;
  footerHeight?: number;
  pagePadding?: number;
}

const PrintLayout = forwardRef<HTMLDivElement, PrintLayoutProps>(
  (
    { header, footer, content, headerHeight, footerHeight, pagePadding },
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
