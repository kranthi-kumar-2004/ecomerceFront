import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area
} from "recharts";

function RevenueChart() {
  const data = [
    { month: "Jan", revenue: 20000 },
    { month: "Feb", revenue: 26000 },
    { month: "Mar", revenue: 22000 },
    { month: "Apr", revenue: 30000 },
    { month: "May", revenue: 28000 },
    { month: "Jun", revenue: 36000 },
    { month: "Jul", revenue: 33000 },
    { month: "Aug", revenue: 42000 },
    { month: "Sep", revenue: 39000 },
    { month: "Oct", revenue: 47000 },
    { month: "Nov", revenue: 43000 },
    { month: "Dec", revenue: 52000 },
  ];

  return (
    <div>
      <h3 style={{ color: "#90abce", marginBottom: "10px" }}>
        Revenue Overview
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          <defs>
            <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#1e293b" strokeDasharray="2 6" />

          {/* ✅ changed dataKey */}
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="revenue"
            fill="url(#revGradient)"
            stroke="none"
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;