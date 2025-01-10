import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { supabase } from '@/lib/supabase';

interface PerformanceMetricsProps {
  period: string;
}

export default function PerformanceMetrics({ period }: PerformanceMetricsProps) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: driversData, error } = await supabase
          .from('drivers')
          .select(`
            id,
            user_id,
            driver_rating,
            users (
              first_name,
              last_name
            )
          `)
          .order('driver_rating', { ascending: false });

        if (error) throw error;

        const formattedData = driversData.map(driver => ({
          name: `${driver.users.first_name} ${driver.users.last_name}`,
          rating: driver.driver_rating,
        }));

        setData(formattedData);
      } catch (err) {
        console.error('Error fetching performance metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  if (isLoading) {
    return <div className="h-64 flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="rating" fill="#3B82F6" name="Avaliação" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}