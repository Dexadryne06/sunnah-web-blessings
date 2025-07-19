import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, User, LogIn, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const logSecurityEvent = async (eventType: string, description: string) => {
    try {
      await supabase.rpc('log_security_event', {
        p_event_type: eventType,
        p_event_description: description,
        p_ip_address: null, // Frontend can't reliably get IP
        p_user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'register') {
        // Register new admin user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // Add to admin_users_secure table
          const { error: adminError } = await supabase
            .from('admin_users_secure')
            .insert({
              user_id: authData.user.id,
              email: credentials.email,
              role: 'admin'
            });

          if (adminError) throw adminError;

          await logSecurityEvent('admin_registration', `Admin user registered: ${credentials.email}`);
          toast.success('Admin registrato con successo! Controlla la tua email per confermare l\'account.');
        }
      } else {
        // Login existing admin user
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        });

        if (authError) {
          await logSecurityEvent('admin_login_failed', `Failed login attempt for email: ${credentials.email}`);
          throw authError;
        }

        if (authData.user) {
          // Check if user is admin
          const { data: adminUser, error: adminError } = await supabase
            .from('admin_users_secure')
            .select('*')
            .eq('user_id', authData.user.id)
            .eq('is_active', true)
            .single();

          if (adminError || !adminUser) {
            await supabase.auth.signOut();
            await logSecurityEvent('admin_unauthorized_access', `Non-admin user attempted dashboard access: ${credentials.email}`);
            throw new Error('Accesso non autorizzato');
          }

          // Update last login
          await supabase
            .from('admin_users_secure')
            .update({ last_login: new Date().toISOString() })
            .eq('user_id', authData.user.id);

          await logSecurityEvent('admin_login_success', `Admin user logged in: ${credentials.email}`);
          onLogin();
          toast.success('Accesso effettuato con successo!');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Errore durante l\'autenticazione');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Lock className="h-6 w-6" />
            Admin Dashboard
          </CardTitle>
          <div className="flex justify-center mt-4">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={mode === 'login' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('login')}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Accedi
              </Button>
              <Button
                variant={mode === 'register' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('register')}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Registrati
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10"
                  placeholder="Password sicura"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                mode === 'register' ? 'Registrazione in corso...' : 'Accesso in corso...'
              ) : (
                mode === 'register' ? 'Registra Admin' : 'Accedi'
              )}
            </Button>
            
            {mode === 'register' && (
              <p className="text-sm text-muted-foreground text-center">
                La registrazione richiede conferma email
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};