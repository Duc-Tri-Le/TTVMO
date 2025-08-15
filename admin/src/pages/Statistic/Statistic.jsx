import React, { useContext, useState } from "react";
import { StoreContext } from "../../../context/StoreContext";
import "./Statistic.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Statistic = () => {
  const { statistic, getStatistic, formatDateLocal } = useContext(StoreContext);
  const [groupBy, setGroupBy] = useState("year");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleGetStatistic = () => {
    if (!startDate || !endDate) {
      alert("Vui lòng chọn đủ ngày bắt đầu và kết thúc!");
      return;
    }
    const tokenFromStorage = localStorage.getItem("token");
    getStatistic(
      tokenFromStorage,
      groupBy,
      formatDateLocal(startDate),
      formatDateLocal(endDate)
    );
  };

  // Xử lý dữ liệu hiển thị thời gian
  const formattedData = Array.isArray(statistic)
    ? statistic.map((item) => {
        let timeDisplay = item.thoi_gian;
        if (timeDisplay.includes("W")) {
          const [year, week] = timeDisplay.split("-W");
          timeDisplay = `Tuần ${week} (${year})`;
        }
        return {
          ...item,
          thoi_gian: timeDisplay,
          tong_doanh_thu: Number(item.tong_doanh_thu),
          so_nguoi_dang_ky: Number(item.so_nguoi_dang_ky),
        };
      })
    : [];

  return (
    <div className="statistic-container">
      {/* Chọn nhóm */}
      <div style={{ marginBottom: "10px" }}>
        <label>Nhóm theo: </label>
        <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
          <option value="day">Ngày</option>
          <option value="week">Tuần</option>
          <option value="month">Tháng</option>
          <option value="year">Năm</option>
        </select>
      </div>

      {/* Chọn ngày */}
      <div style={{ marginBottom: "10px" }}>
        <label>Bắt đầu: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label style={{ marginLeft: "10px" }}>Kết thúc: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Nút lấy dữ liệu */}
      <button onClick={handleGetStatistic}>Lấy thống kê</button>

      {/* Danh sách */}
      {formattedData.map((item, index) => (
        <div className="statistic-item" key={index}>
          <p>Thời gian đăng ký: {item.thoi_gian}</p>
          <p>Số người đăng ký: {item.so_nguoi_dang_ky}</p>
          <p>Tổng doanh thu: {item.tong_doanh_thu.toLocaleString()} VNĐ</p>
        </div>
      ))}

      {/* Biểu đồ */}
      {formattedData.length > 0 && (
        <div style={{ width: "90%", height: 400, marginTop: "20px" }}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={statistic}
              margin={{ top: 30, right: 50, left: 50, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              {/* Trục X */}
              <XAxis dataKey="thoi_gian" />

              {/* Trục Y trái - Doanh thu */}
              <YAxis
                yAxisId="left"
                domain={[0, (dataMax) => dataMax * 1.1]}
                tickFormatter={(value) => value.toLocaleString()}
                label={{
                  value: "Doanh thu (VNĐ)",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />

              {/* Trục Y phải - Số lượng đăng ký */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, (dataMax) => dataMax * 1.1]}
                label={{
                  value: "Số lượng đăng ký",
                  angle: -90,
                  position: "insideRight",
                  style: { textAnchor: "middle" },
                }}
              />

              <Tooltip
                formatter={(value, name) => {
                  if (name === "tong_doanh_thu") {
                    return [`${value.toLocaleString()} VNĐ`, "Doanh thu"];
                  }
                  if (name === "so_nguoi_dang_ky") {
                    return [value, "Số lượng đăng ký"];
                  }
                  return value;
                }}
              />
              <Legend />

              {/* Đường Doanh thu */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="tong_doanh_thu"
                stroke="#8884d8"
                name="tong_doanh_thu"
                strokeWidth={2}
                dot={{ r: 4 }}
              />

              {/* Đường Số lượng đăng ký */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="so_nguoi_dang_ky"
                stroke="#82ca9d"
                name="so_nguoi_dang_ky"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Statistic;
