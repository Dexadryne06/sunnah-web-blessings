import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Shield, AlertTriangle, Activity, Lock } from 'lucide-react';

interface SecurityEvent {
  id: string;
  user_id: string | null;
  event_type: string;
  event_description: string;
  ip_address: string | null;
  user_agent: string | null;
  metadata: any;
  created_at: string;
}

interface RateLimit {
  id: string;
  identifier: string;
  action: string;
  attempts: number;
  window_start: string;
  blocked_until: string | null;
  created_at: string;
}

export const SecurityDashboard = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [rateLimits, setRateLimits] = useState<RateLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    failedLogins: 0,
    blockedIPs: 0,
    adminLogins: 0
  });

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);

      // Load security events (last 100)
      const { data: events, error: eventsError } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (eventsError) throw eventsError;

      // Load active rate limits
      const { data: limits, error: limitsError } = await supabase
        .from('rate_limits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (limitsError) throw limitsError;

      setSecurityEvents(events || []);
      setRateLimits(limits || []);

      // Calculate stats
      const failedLogins = events?.filter(e => e.event_type === 'admin_login_failed').length || 0;
      const adminLogins = events?.filter(e => e.event_type === 'admin_login_success').length || 0;
      const blockedIPs = limits?.filter(l => l.blocked_until && new Date(l.blocked_until) > new Date()).length || 0;

      setStats({
        totalEvents: events?.length || 0,
        failedLogins,
        blockedIPs,
        adminLogins
      });

    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventBadgeVariant = (eventType: string) => {
    switch (eventType) {
      case 'admin_login_failed':
      case 'admin_unauthorized_access':
        return 'destructive';
      case 'admin_login_success':
      case 'admin_registration':
        return 'default';
      case 'contact_form_submission':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventi Totali</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Login Falliti</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.failedLogins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IP Bloccati</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blockedIPs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Login Admin</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.adminLogins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Eventi di Sicurezza Recenti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrizione</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Badge variant={getEventBadgeVariant(event.event_type)}>
                        {event.event_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {event.event_description}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {event.ip_address || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(event.created_at), 'dd/MM/yyyy HH:mm', { locale: it })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Limiting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identificatore</TableHead>
                  <TableHead>Azione</TableHead>
                  <TableHead>Tentativi</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Ultima Attività</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rateLimits.map((limit) => (
                  <TableRow key={limit.id}>
                    <TableCell className="font-mono text-sm">
                      {limit.identifier}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{limit.action}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={limit.attempts >= 5 ? 'destructive' : 'secondary'}>
                        {limit.attempts}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {limit.blocked_until && new Date(limit.blocked_until) > new Date() ? (
                        <Badge variant="destructive">Bloccato</Badge>
                      ) : (
                        <Badge variant="default">Attivo</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(limit.created_at), 'dd/MM/yyyy HH:mm', { locale: it })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};