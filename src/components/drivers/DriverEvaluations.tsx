import { useEffect, useState, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';

interface EvaluationScore {
  name: string;
  score: number;
  weight: number;
}

interface DriverEvaluationsProps {
  driverId: string;
}

export default function DriverEvaluations({ driverId }: DriverEvaluationsProps) {
  const [evaluations, setEvaluations] = useState<EvaluationScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchEvaluations = useCallback(async () => {
    try {
      setError(null);
      const { data: evaluationsData, error: fetchError } = await supabase
        .from('driver_evaluations')
        .select(`
          score,
          evaluation_items (
            id,
            name,
            weight
          )
        `)
        .eq('driver_id', driverId)
        .order('evaluated_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Process and aggregate scores
      const scoresByItem = (evaluationsData || []).reduce((acc: Record<string, { scores: number[]; weight: number }>, curr) => {
        const itemName = curr.evaluation_items.name;
        if (!acc[itemName]) {
          acc[itemName] = {
            scores: [],
            weight: curr.evaluation_items.weight
          };
        }
        acc[itemName].scores.push(curr.score);
        return acc;
      }, {});

      // Calculate weighted averages
      const processedScores = Object.entries(scoresByItem).map(([name, { scores, weight }]) => ({
        name,
        score: scores.reduce((a, b) => a + b, 0) / scores.length / 10,
        weight
      }));

      setEvaluations(processedScores);

      // Set up realtime subscription
      const subscription = supabase
        .channel(`driver-evaluations-${driverId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'driver_evaluations',
          filter: `driver_id=eq.${driverId}`
        }, () => {
          fetchEvaluations();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };

    } catch (err: any) {
      console.error('Error fetching evaluations:', err);
      setError(err.message || 'Erro ao carregar avaliações');
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, [driverId]);

  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        Carregando avaliações...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-2 p-3 bg-red-50 rounded-md">
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsRetrying(true);
            fetchEvaluations();
          }}
          disabled={isRetrying}
          className="mt-2"
        >
          {isRetrying ? 'Tentando novamente...' : 'Tentar novamente'}
        </Button>
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <div className="mt-2 text-sm text-gray-500 italic">
        Sem avaliações registradas
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
      {evaluations.map((evaluation) => (
        <div 
          key={evaluation.name} 
          className="flex items-center text-sm whitespace-nowrap"
          title={`Peso: ${evaluation.weight}`}
        >
          <span className="text-gray-600 mr-1.5">{evaluation.name}:</span>
          <span className={`font-medium ${getScoreColor(evaluation.score)}`}>
            {evaluation.score.toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );
}