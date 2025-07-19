
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { RefreshCw, Database, Users, AlertCircle } from 'lucide-react';

interface TriggerInfo {
  trigger_name: string;
  event_manipulation: string;
  event_object_table: string;
  action_timing: string;
  action_statement: string;
}

interface SecurityLog {
  id: string;
  user_id: string;
  event_type: string;
  event_description: string;
  metadata: any;
  created_at: string;
}

export const AdminRegistrationDebug = () => {
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDebugInfo = async () => {
    setLoading(true);
    try {
      // Get recent security logs related to admin registration
      const { data: logData } = await supabase
        .from('security_audit_log')
        .select('*')
        .in('event_type', ['admin_user_trigger', 'admin_user_created', 'admin_user_creation_error', 'admin_registration_success'])
        .order('created_at', { ascending: false })
        .limit(20);
      
      setSecurityLogs(logData || []);

      // Get admin users
      const { data: adminData } = await supabase
        .from('admin_users_secure')
        .select('*')
        .order('created_at', { ascending: false });
      
      setAdminUsers(adminData || []);

    } catch (error) {
      console.error('Error loading debug info:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDebugInfo();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Debug Registrazione Admin</h2>
        <Button onClick={loadDebugInfo} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Aggiorna
        </Button>
      </div>

      {/* Database Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Stato Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge variant="default" className="bg-blue-100 text-blue-800">
              Sistema Attivo
            </Badge>
            <p className="text-sm text-muted-foreground">
              La registrazione automatica degli admin è configurata. 
              Controlla i log di sicurezza per dettagli sui trigger.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Admin Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Utenti Admin ({adminUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {adminUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Ruolo</TableHead>
                  <TableHead>Attivo</TableHead>
                  <TableHead>Creato</TableHead>
                  <TableHead>Ultimo Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Badge>{admin.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={admin.is_active ? "default" : "secondary"}>
                        {admin.is_active ? "Sì" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(admin.created_at), 'dd/MM/yyyy HH:mm', { locale: it })}
                    </TableCell>
                    <TableCell>
                      {admin.last_login ? 
                        format(new Date(admin.last_login), 'dd/MM/yyyy HH:mm', { locale: it }) : 
                        'Mai'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">Nessun utente admin trovato</p>
          )}
        </CardContent>
      </Card>

      {/* Security Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Log di Sicurezza Registrazione</CardTitle>
        </CardHeader>
        <CardContent>
          {securityLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo Evento</TableHead>
                  <TableHead>Descrizione</TableHead>
                  <TableHead>Metadata</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge variant={
                        log.event_type.includes('error') ? 'destructive' :
                        log.event_type.includes('success') || log.event_type.includes('created') ? 'default' :
                        'secondary'
                      }>
                        {log.event_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md truncate">
                      {log.event_description}
                    </TableCell>
                     <TableCell className="max-w-xs pr-8">
                       {log.metadata && (
                         <pre className="text-xs bg-muted p-1 rounded max-w-[200px] overflow-auto">
                           {JSON.stringify(log.metadata, null, 2)}
                         </pre>
                       )}
                     </TableCell>
                    <TableCell>
                      {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: it })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">Nessun log di registrazione trovato</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
