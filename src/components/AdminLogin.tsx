
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, User, LogIn, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const { signIn, signUp, resetPassword, loading: authLoading } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const logSecurityEvent = async (eventType: string, description: string) => {
    try {
      await supabase.rpc('log_security_event', {
        p_event_type: eventType,
        p_event_description: description,
        p_ip_address: null,
        p_user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRegistrationStatus('idle');
    setErrorMessage('');

    try {
      if (mode === 'register') {
        console.log('Starting registration process for:', credentials.email);
        
        const { error: authError } = await signUp(credentials.email, credentials.password);

        if (authError) {
          console.error('Registration auth error:', authError);
          if (authError.message.includes('already registered')) {
            setErrorMessage('Questo indirizzo email è già registrato. Prova ad accedere invece.');
          } else {
            setErrorMessage(`Errore durante la registrazione: ${authError.message}`);
          }
          throw authError;
        }

        console.log('Registration successful');
        
        // Wait a moment for the trigger to execute and check admin creation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await logSecurityEvent('admin_registration_success', `Admin user registered successfully: ${credentials.email}`);
        
        setRegistrationStatus('success');
        toast.success('Admin registrato con successo! Controlla la tua email per confermare l\'account.');
        
        // Reset form
        setCredentials({ email: '', password: '' });
        
      } else {
        // Login existing admin user
        console.log('Starting login process for:', credentials.email);
        
        const { error: authError } = await signIn(credentials.email, credentials.password);

        if (authError) {
          console.error('Login error:', authError);
          await logSecurityEvent('admin_login_failed', `Failed login attempt for email: ${credentials.email}`);
          
          if (authError.message.includes('Invalid login credentials')) {
            setErrorMessage('Email o password non corretti. Controlla le credenziali o usa "Password dimenticata?"');
          } else {
            setErrorMessage(`Errore durante l'accesso: ${authError.message}`);
          }
          throw authError;
        }

        console.log('Login successful, checking admin status...');
        
        // Get current user from session to check admin status
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Check if user is admin
          const { data: adminUser, error: adminError } = await supabase
            .from('admin_users_secure')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .maybeSingle();

          console.log('Admin check result:', { adminUser, adminError });

          if (adminError) {
            console.error('Error checking admin status:', adminError);
            await supabase.auth.signOut();
            await logSecurityEvent('admin_check_error', `Error checking admin status for: ${credentials.email}`);
            setErrorMessage('Errore nella verifica dello stato admin.');
            throw adminError;
          }

          if (!adminUser) {
            await supabase.auth.signOut();
            await logSecurityEvent('admin_unauthorized_access', `Non-admin user attempted dashboard access: ${credentials.email}`);
            setErrorMessage('Accesso non autorizzato. Solo gli amministratori possono accedere.');
            throw new Error('Accesso non autorizzato');
          }

          // Update last login
          await supabase
            .from('admin_users_secure')
            .update({ last_login: new Date().toISOString() })
            .eq('user_id', user.id);

          await logSecurityEvent('admin_login_success', `Admin user logged in: ${credentials.email}`);
          onLogin();
          toast.success('Accesso effettuato con successo!');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      if (!errorMessage) {
        setErrorMessage(error.message || 'Errore durante l\'autenticazione');
      }
      setRegistrationStatus('error');
      toast.error(errorMessage || error.message || 'Errore durante l\'autenticazione');
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
                onClick={() => {
                  setMode('login');
                  setRegistrationStatus('idle');
                  setErrorMessage('');
                }}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Accedi
              </Button>
              <Button
                variant={mode === 'register' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setMode('register');
                  setRegistrationStatus('idle');
                  setErrorMessage('');
                }}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Registrati
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          {registrationStatus === 'success' && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Registrazione completata con successo! Controlla la tua email.
              </AlertDescription>
            </Alert>
          )}

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
            
            {mode === 'login' && (
              <Button
                type="button"
                variant="link"
                className="w-full mt-2"
                onClick={async () => {
                  if (!credentials.email) {
                    setErrorMessage("Inserisci la tua email per resettare la password");
                    return;
                  }
                  
                  setIsLoading(true);
                  const { error } = await supabase.auth.resetPasswordForEmail(credentials.email, {
                    redirectTo: `${window.location.origin}/dashboard`,
                  });
                  
                  if (error) {
                    setErrorMessage(error.message);
                    toast.error("Errore nell'invio dell'email di reset");
                  } else {
                    toast.success("Email di reset inviata! Controlla la tua casella di posta");
                  }
                  setIsLoading(false);
                }}
                disabled={isLoading}
              >
                Password dimenticata?
              </Button>
            )}
            
            {mode === 'register' && (
              <div className="text-sm text-muted-foreground text-center space-y-2">
                <p>La registrazione crea automaticamente un utente admin</p>
                <p className="text-xs">Potrebbe essere richiesta la conferma email</p>
              </div>
            )}
            
            {mode === 'login' && (
              <p className="text-sm text-muted-foreground text-center">
                Non hai un account? Usa la tab "Registrati" per creare un admin
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
