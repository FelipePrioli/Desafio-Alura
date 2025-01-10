export interface UserRegistrationData {
  // Stage 1
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  password: string;
  securityQuestion: string;
  securityAnswer: string;
  
  // Stage 2
  role: 'admin' | 'manager' | 'standard' | 'guest';
  department: string;
  profilePhoto?: string;
  communicationPreference: 'email' | 'phone' | 'both';
  
  // Stage 3
  permissions: {
    accessLevel: 'read' | 'write' | 'delete' | 'full';
    modules: {
      dashboard: boolean;
      financial: boolean;
      userManagement: boolean;
      reports: boolean;
      documents: boolean;
      communication: boolean;
    };
  };
  
  // Stage 4
  termsAccepted: boolean;
  privacyAccepted: boolean;
  corporateEmail?: string;
}

export interface RegistrationStage {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
}