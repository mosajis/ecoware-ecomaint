import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export default function TabDetails() {
    const [data, setData] = useState("");
    return (_jsxs("div", { style: { direction: "rtl", maxWidth: 800, margin: "auto", padding: 20 }, children: [_jsx("h2", { children: "\u062A\u0648\u0636\u06CC\u062D\u0627\u062A \u06A9\u0627\u0645\u0644" }), _jsxs("div", { style: {
                    marginTop: 20,
                    border: "1px solid #ccc",
                    padding: 10,
                    borderRadius: 6,
                }, children: [_jsx("h3", { children: "\u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634" }), _jsx("div", { dangerouslySetInnerHTML: { __html: data } })] })] }));
}
