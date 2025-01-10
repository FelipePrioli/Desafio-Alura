import { supabase } from './supabase';

export type Role = 'director' | 'administrator' | 'standard';

interface AuthResponse {
  success: boolean;
  error?: string;
  user?: any;
}

export async function authenticateUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      user: data.user
    };
  } catch (err) {
    return {
      success: false,
      error: 'Erro ao autenticar usuário'
    };
  }
}

export async function getUserRole(): Promise<Role | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id)
    .single();

  return userRoles?.roles?.name as Role || null;
}

export async function checkPermission(requiredRole: Role): Promise<boolean> {
  const userRole = await getUserRole();
  
  if (!userRole) return false;
  
  const roleHierarchy: Record<Role, number> = {
    director: 3,
    administrator: 2,
    standard: 1
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export async function assignRole(userId: string, role: Role): Promise<void> {
  const { data: roleData } = await supabase
    .from('roles')
    .select('id')
    .eq('name', role)
    .single();

  if (!roleData?.id) throw new Error('Role not found');

  await supabase
    .from('user_roles')
    .insert({ user_id: userId, role_id: roleData.id });
}