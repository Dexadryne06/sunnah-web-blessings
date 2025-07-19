
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { RefreshCw, Terminal, AlertTriangle, Info, Bug, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface FunctionLog {
  id: string;
  function_name: string;
  log_level: string;
  message: string;
  metadata: any;
  created_at: string;
}

const LogLevelIcon = ({ level }: { level: string }) => {
  switch (level) {
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case 'warn':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'debug':
      return <Bug className="h-4 w-4 text-blue-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const LogLevelBadge = ({ level }: { level: string }) => {
  const variants = {
    error: 'destructive',
    warn: 'secondary',
    info: 'default',
    debug: 'outline'
  } as const;

  return (
    <Badge variant={variants[level as keyof typeof variants] || 'default'} className="flex items-center gap-1">
      <LogLevelIcon level={level} />
      {level.toUpperCase()}
    </Badge>
  );
};

export const FunctionLogs = () => {
  const [logs, setLogs] = useState<FunctionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      
      // Calculate 24 hours ago in microseconds (Supabase analytics uses microseconds)
      const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
      const twentyFourHoursAgoMicroseconds = twentyFourHoursAgo * 1000;
      
      console.log('Fetching logs for update-daily-prayer-times from last 24 hours...');
      
      // Use the correct analytics query to get function logs for update-daily-prayer-times
      const { data: analyticsData, error } = await supabase.functions.invoke('analytics-query', {
        body: { 
          query: `select id, function_logs.timestamp, event_message, metadata.event_type, metadata.function_id, metadata.level from function_logs
  cross join unnest(metadata) as metadata
  where metadata.function_id = 'update-daily-prayer-times'
  and function_logs.timestamp > ${twentyFourHoursAgoMicroseconds}
  order by timestamp desc
  limit 100` 
        }
      });

      if (error) {
        console.error('Error fetching logs:', error);
        // Fallback to mock data if query fails
        const mockLogs: FunctionLog[] = [
          {
            id: '1',
            function_name: 'update-daily-prayer-times',
            log_level: 'info',
            message: 'Successfully updated current prayer times',
            metadata: { execution_time_ms: 250 },
            created_at: new Date().toISOString()
          },
          {
            id: '2', 
            function_name: 'update-daily-prayer-times',
            log_level: 'info',
            message: 'Current prayer times already exist for today, updating...',
            metadata: { execution_time_ms: 120 },
            created_at: new Date(Date.now() - 60000).toISOString()
          }
        ];
        setLogs(mockLogs);
        toast.error('Errore nel caricamento dei log, mostro dati mock');
      } else {
        console.log('Analytics data received:', analyticsData);
        
        // Transform analytics data to match our FunctionLog interface
        const transformedLogs: FunctionLog[] = (analyticsData || []).map((log: any) => ({
          id: log.id || Math.random().toString(),
          function_name: log.function_id || 'update-daily-prayer-times',
          log_level: log.level || 'info',
          message: log.event_message || 'Log message',
          metadata: {
            event_type: log.event_type,
            function_id: log.function_id,
            level: log.level,
            timestamp: log.timestamp
          },
          created_at: new Date(log.timestamp / 1000).toISOString() // Convert microseconds to milliseconds
        }));
        
        console.log('Transformed logs:', transformedLogs);
        setLogs(transformedLogs);
        
        if (transformedLogs.length === 0) {
          toast.info('Nessun log trovato per update-daily-prayer-times nelle ultime 24 ore');
        } else {
          toast.success(`Caricati ${transformedLogs.length} log per update-daily-prayer-times`);
        }
      }
    } catch (error) {
      console.error('Error loading function logs:', error);
      toast.error('Errore nel caricamento dei log');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const logsByFunction = logs.reduce((acc, log) => {
    if (!acc[log.function_name]) {
      acc[log.function_name] = [];
    }
    acc[log.function_name].push(log);
    return acc;
  }, {} as Record<string, FunctionLog[]>);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Caricamento log...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Log Edge Functions - update-daily-prayer-times ({logs.length})
          </CardTitle>
          <Button onClick={loadLogs} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aggiorna
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {Object.keys(logsByFunction).length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nessun log disponibile per update-daily-prayer-times nelle ultime 24 ore</p>
            <p className="text-sm mt-2">Prova a eseguire la funzione o controlla i filtri</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(logsByFunction).map(([functionName, functionLogs]) => (
              <div key={functionName}>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4" />
                  <h3 className="font-semibold">{functionName}</h3>
                  <Badge variant="outline">{functionLogs.length} log{functionLogs.length !== 1 ? 's' : ''}</Badge>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Livello</TableHead>
                        <TableHead>Messaggio</TableHead>
                        <TableHead>Data/Ora</TableHead>
                        <TableHead>Metadata</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {functionLogs.slice(0, 50).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <LogLevelBadge level={log.log_level} />
                          </TableCell>
                          <TableCell className="max-w-md">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {log.message}
                            </code>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: it })}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            {log.metadata ? (
                              <details className="cursor-pointer">
                                <summary className="text-xs text-muted-foreground">Mostra metadata</summary>
                                <pre className="text-xs mt-1 bg-muted p-2 rounded overflow-auto">
                                  {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                              </details>
                            ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
