import React, { forwardRef, ReactNode, CSSProperties } from "react";
import "./printable.css";

type PrintableSlot<P = {}> = React.ReactNode | React.ComponentType<P>;

interface PrintableProps<HProps = unknown, CProps = unknown, FProps = unknown> {
  Header?: PrintableSlot<HProps>;
  Content: PrintableSlot<CProps>;
  Footer?: PrintableSlot<FProps>;

  headerProps?: HProps;
  contentProps?: CProps;
  footerProps?: FProps;

  pagePadding?: number;
  style?: React.CSSProperties;
}

function renderSlot<P>(Slot: PrintableSlot<P> | undefined, props?: P) {
  if (!Slot) return null;

  if (React.isValidElement(Slot)) {
    return Slot;
  }

  const Component = Slot as React.ComponentType<P>;
  return <Component {...(props as any)} />;
}

const Printable = React.forwardRef<HTMLDivElement, PrintableProps>(
  (
    {
      Header,
      Content,
      Footer,

      headerProps,
      contentProps,
      footerProps,

      pagePadding = 8,
      style,
    },
    ref
  ) => {
    const pagePaddingMM = pagePadding + "mm";

    return (
      <div ref={ref} className="print-wrapper" style={style}>
        <table className="print-table">
          <thead>
            <tr>
              <td>
                <div className="header-space" />
              </td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <div
                  className="content"
                  style={{
                    paddingLeft: pagePaddingMM,
                    paddingRight: pagePaddingMM,
                  }}
                >
                  {renderSlot(Content, contentProps)}
                </div>
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td>
                <div className="footer-space" />
              </td>
            </tr>
          </tfoot>
        </table>

        {Header && (
          <div
            className="header"
            style={{
              paddingTop: pagePadding / 1.5 + "mm",
              paddingLeft: pagePaddingMM,
              paddingRight: pagePaddingMM,
            }}
          >
            {renderSlot(Header, headerProps)}
          </div>
        )}

        {Footer && (
          <div
            className="footer"
            style={{
              paddingLeft: pagePaddingMM,
              paddingRight: pagePaddingMM,
            }}
          >
            {renderSlot(Footer, footerProps)}
          </div>
        )}
      </div>
    );
  }
);

Printable.displayName = "Printable";
export default Printable;
