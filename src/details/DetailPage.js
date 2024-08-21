import React, { useEffect, useState } from "react";

const DetailPage = () => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    // 從 localStorage 取出資料
    const storedData = localStorage.getItem("selectedData");
    if (storedData) {
      setDetails(JSON.parse(storedData));
    }
  }, []);

  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{details.title}</h1>
      <p>{details.description}</p>
      {/* 顯示更多詳細信息 */}
    </div>
  );
};

export default DetailPage;
