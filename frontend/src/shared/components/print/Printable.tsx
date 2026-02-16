import React, { forwardRef, ReactNode, CSSProperties } from "react";
import "./printable.css";

type PrintableSlot<P = {}> = React.ReactNode | React.ComponentType<P>;

interface PrintableProps<HProps = unknown, CProps = unknown, FProps = unknown> {
  Header?: any;
  Content: any;
  Footer?: any;

  headerHeight: number;
  pagePadding: number;
  footerHeight: number;
  style?: React.CSSProperties;
}

const Printable = React.forwardRef<HTMLDivElement, PrintableProps>(
  (
    {
      Header,
      Content,
      Footer,
      headerHeight = 100,
      footerHeight = 45,
      pagePadding = 8,
      style,
    },
    ref,
  ) => {
    const pagePaddingMM = pagePadding + "mm";

    return (
      <div ref={ref} className="print-wrapper" style={style}>
        <table className="print-table">
          <thead>
            <tr>
              <td>
                <div
                  className="header-space"
                  style={{ height: headerHeight }}
                />
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
                  {Content}
                </div>
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td>
                <div className="footer-space" style={{ height: "45px" }} />
              </td>
            </tr>
          </tfoot>
        </table>

        {Header && (
          <div
            className="header"
            style={{
              height: headerHeight,
              paddingTop: pagePadding / 1.5 + "mm",
              paddingLeft: pagePaddingMM,
              paddingRight: pagePaddingMM,
            }}
          >
            {Header}
          </div>
        )}

        {Footer && (
          <div
            className="footer"
            style={{
              height: footerHeight,
              paddingLeft: pagePaddingMM,
              paddingRight: pagePaddingMM,
            }}
          >
            {Footer}
          </div>
        )}
      </div>
    );
  },
);

Printable.displayName = "Printable";
export default Printable;
