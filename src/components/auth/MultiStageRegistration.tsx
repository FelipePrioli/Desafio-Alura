import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { UserRegistrationData, RegistrationStage } from '@/types/auth';
import Button from '@/components/ui/Button';
import BasicInfoForm from './registration/BasicInfoForm';
import RoleSelectionForm from './registration/RoleSelectionForm';
import PermissionsForm from './registration/PermissionsForm';
import VerificationForm from './registration/VerificationForm';
import ProgressIndicator from './registration/ProgressIndicator';

const initialStages: RegistrationStage[] = [
  {
    id: 1,
    title: 'Informações Básicas',
    description: 'Dados pessoais e credenciais',
    isComplete: false,
  },
  {
    id: 2,
    title: 'Função e Departamento',
    description: 'Escolha sua função no sistema',
    isComplete: false,
  },
  {
    id: 3,
    title: 'Permissões',
    description: 'Configure níveis de acesso',
    isComplete: false,
  },
  {
    id: 4,
    title: 'Verificação',
    description: 'Revise e confirme seus dados',
    isComplete: false,
  },
];

const initialData: UserRegistrationData = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  countryCode: '+55',
  password: '',
  securityQuestion: '',
  securityAnswer: '',
  role: 'standard',
  department: '',
  communicationPreference: 'email',
  permissions: {
    accessLevel: 'read',
    modules: {
      dashboard: true,
      financial: false,
      userManagement: false,
      reports: false,
      documents: true,
      communication: true,
    },
  },
  termsAccepted: false,
  privacyAccepted: false,
};

export default function MultiStageRegistration() {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(1);
  const [stages, setStages] = useState(initialStages);
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved progress from localStorage
    const savedData = localStorage.getItem('registrationData');
    const savedStage = localStorage.getItem('registrationStage');
    
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    if (savedStage) {
      setCurrentStage(parseInt(savedStage, 10));
    }
  }, []);

  const saveProgress = (data: Partial<UserRegistrationData>) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    localStorage.setItem('registrationData', JSON.stringify(updatedData));
    localStorage.setItem('registrationStage', currentStage.toString());
  };

  const handleStageComplete = (stageId: number) => {
    setStages(prevStages =>
      prevStages.map(stage =>
        stage.id === stageId ? { ...stage, isComplete: true } : stage
      )
    );
  };

  const handleNext = () => {
    if (currentStage < 4) {
      setCurrentStage(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStage > 1) {
      setCurrentStage(prev => prev - 1);
    }
  };

  const renderStageForm = () => {
    switch (currentStage) {
      case 1:
        return (
          <BasicInfoForm
            data={formData}
            onSave={saveProgress}
            onComplete={() => handleStageComplete(1)}
          />
        );
      case 2:
        return (
          <RoleSelectionForm
            data={formData}
            onSave={saveProgress}
            onComplete={() => handleStageComplete(2)}
          />
        );
      case 3:
        return (
          <PermissionsForm
            data={formData}
            onSave={saveProgress}
            onComplete={() => handleStageComplete(3)}
          />
        );
      case 4:
        return (
          <VerificationForm
            data={formData}
            onSave={saveProgress}
            onComplete={() => handleStageComplete(4)}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ProgressIndicator stages={stages} currentStage={currentStage} />
      
      <div className="bg-white rounded-lg shadow-lg p-8 mt-8 animate-fadeIn">
        {renderStageForm()}
        
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStage === 1 || isLoading}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          
          {currentStage < 4 && (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!stages[currentStage - 1].isComplete || isLoading}
              className="flex items-center gap-2"
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}