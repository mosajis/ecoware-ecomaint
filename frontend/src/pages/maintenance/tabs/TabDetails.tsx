import {useState} from "react";

export default function TabDetails() {
  const [data, setData] = useState("");

  return (
    <div
      style={{ direction: "rtl", maxWidth: 800, margin: "auto", padding: 20 }}
    >
      <h2>توضیحات کامل</h2>

      <div
        style={{
          marginTop: 20,
          border: "1px solid #ccc",
          padding: 10,
          borderRadius: 6,
        }}
      >
        <h3>پیش‌نمایش</h3>
        <div dangerouslySetInnerHTML={{ __html: data }} />
      </div>
    </div>
  );
}
