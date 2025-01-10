import { useState } from 'react';
import { Award, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import DriverEditForm from './DriverEditForm';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  license: string;
  vehicle: string;
  plate: string;
  schedule: string;
  status: string;
  score: number;
  photo: string;
}

interface DriverCardProps extends Driver {}

export default function DriverCard(props: DriverCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [driverData, setDriverData] = useState<Driver>(props);

  const handleSave = (updatedDriver: Driver) => {
    setDriverData(updatedDriver);
    setIsEditing(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={driverData.photo}
              alt={driverData.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-100"
            />
            {driverData.score >= 90 && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1" title="Motorista destaque">
                <Award className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{driverData.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">São Paulo, SP</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Pontuação</span>
            <div className="flex items-center">
              <div className={`h-2 w-16 rounded-full mr-2 ${
                driverData.score >= 90 ? 'bg-green-500' :
                driverData.score >= 70 ? 'bg-yellow-500' :
                'bg-red-500'
              }`} />
              <span className={`text-lg font-semibold ${
                driverData.score >= 90 ? 'text-green-600' :
                driverData.score >= 70 ? 'text-yellow-600' :
                'text-red-600'
              }`}>{driverData.score}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              driverData.status === 'Ativo' 
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {driverData.status}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-gray-50"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 hover:bg-gray-200"
            >
              Detalhes
            </Button>
          </div>
        </div>
      </div>

      {isEditing && (
        <DriverEditForm
          driver={driverData}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}