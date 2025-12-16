import React, { forwardRef, ReactNode, CSSProperties } from "react";
import "./printable.css";

interface Props {
  Header: React.ComponentType | ReactNode;
  Footer: React.ComponentType | ReactNode;
  Content: React.ComponentType | ReactNode;
  customStyles?: CSSProperties;
}

const Printable = forwardRef<HTMLDivElement, Props>(
  ({ Header, Footer, Content, customStyles = {} }, ref) => {
    const renderElement = (element: React.ComponentType | ReactNode) => {
      if (typeof element === "function") {
        const Component = element as React.ComponentType;
        return <Component />;
      }
      return element;
    };

    return (
      <div className="print-wrapper" ref={ref} style={customStyles}>
        <table className="print-table">
          <thead>
            <tr>
              <td>
                <div className="header-space">&nbsp;</div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="content">{renderElement(Content)}</div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>
                <div className="footer-space">&nbsp;</div>
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="header">{renderElement(Header)}</div>

        <div className="footer">{renderElement(Footer)}</div>
      </div>
    );
  }
);

export default Printable;
