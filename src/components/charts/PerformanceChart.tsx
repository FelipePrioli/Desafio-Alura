import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PerformanceData {
  month: string;
  [key: string]: string | number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Evolução Mensal</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="João" stroke="#2563eb" />
            <Line type="monotone" dataKey="Maria" stroke="#7c3aed" />
            <Line type="monotone" dataKey="Pedro" stroke="#db2777" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}