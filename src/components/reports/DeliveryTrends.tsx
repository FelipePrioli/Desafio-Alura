import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { supabase } from '@/lib/supabase';

interface DeliveryTrendsProps {
  period: string;
}

export default function DeliveryTrends({ period }: DeliveryTrendsProps) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulated data for now - will be replaced with actual database queries
        const mockData = [
          { date: '01/01', deliveries: 45, onTime: 42 },
          { date: '02/01', deliveries: 52, onTime: 48 },
          { date: '03/01', deliveries: 48, onTime: 45 },
          { date: '04/01', deliveries: 51, onTime: 49 },
          { date: '05/01', deliveries: 55, onTime: 52 },
        ];
        setData(mockData);
      } catch (err) {
        console.error('Error fetching delivery trends:', err);
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
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="deliveries" 
            stroke="#3B82F6" 
            name="Total Entregas"
          />
          <Line 
            type="monotone" 
            dataKey="onTime" 
            stroke="#10B981" 
            name="No Prazo"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}