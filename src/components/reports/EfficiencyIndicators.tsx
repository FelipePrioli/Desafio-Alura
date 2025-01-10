import { useEffect, useState } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { supabase } from '@/lib/supabase';

interface EfficiencyIndicatorsProps {
  period: string;
}

export default function EfficiencyIndicators({ period }: EfficiencyIndicatorsProps) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulated data - will be replaced with actual database queries
        const mockData = [
          { metric: 'Pontualidade', value: 85 },
          { metric: 'Satisfação', value: 90 },
          { metric: 'Eficiência', value: 88 },
          { metric: 'Produtividade', value: 82 },
          { metric: 'Qualidade', value: 95 },
        ];
        setData(mockData);
      } catch (err) {
        console.error('Error fetching efficiency indicators:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  if (isLoading) {
    return <div className="h-80 flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Desempenho"
            dataKey="value"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}