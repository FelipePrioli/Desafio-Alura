import { Check } from 'lucide-react';
import { RegistrationStage } from '@/types/auth';

interface ProgressIndicatorProps {
  stages: RegistrationStage[];
  currentStage: number;
}

export default function ProgressIndicator({ stages, currentStage }: ProgressIndicatorProps) {
  return (
    <div className="relative">
      <div className="absolute top-5 w-full h-0.5 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` }}
        />
      </div>
      
      <div className="relative flex justify-between">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`flex flex-col items-center ${
              stage.id <= currentStage ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                stage.id < currentStage
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : stage.id === currentStage
                  ? 'border-blue-600 bg-white text-blue-600'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {stage.id < currentStage ? (
                <Check className="w-5 h-5" />
              ) : (
                <span>{stage.id}</span>
              )}
            </div>
            <span className="mt-2 text-sm font-medium">{stage.title}</span>
            <span className="text-xs text-gray-500">{stage.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}