import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ComparisonData {
  month: string;
  [key: string]: string | number;
}

interface ComparisonChartProps {
  data: ComparisonData[];
}

export default function ComparisonChart({ data }: ComparisonChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Comparativo de Desempenho</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="João" fill="#2563eb" />
            <Bar dataKey="Maria" fill="#7c3aed" />
            <Bar dataKey="Pedro" fill="#db2777" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}