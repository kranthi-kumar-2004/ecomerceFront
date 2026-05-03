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

function OrdersChart() {

  const data = [
    { month: "Jan", orders: 5 },
    { month: "Feb", orders: 10 },
    { month: "Mar", orders: 8 },
    { month: "Apr", orders: 15 },
    { month: "May", orders: 12 },
    { month: "Jun", orders: 18 },
    { month: "Jul", orders: 14 },
    { month: "Aug", orders: 20 },
    { month: "Sep", orders: 17 },
    { month: "Oct", orders: 22 },
    { month: "Nov", orders: 19 },
    { month: "Dec", orders: 25 },
  ];

  return (
    <div>
      <h3 style={{ color: "#90abce", marginBottom: "10px" }}>
        Orders Overview
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          {/* Gradient (same style but different color) */}
          <defs>
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#1e293b" strokeDasharray="2 6" />

          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />

          <Tooltip/>

          {/* Area (same as revenue) */}
          <Area
            type="monotone"
            dataKey="orders"
            fill="url(#ordersGradient)"
            stroke="none"
          />

          {/* Line */}
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OrdersChart;