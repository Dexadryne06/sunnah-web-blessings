import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { toast } from "sonner";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { 
  Users, 
  Download, 
  Heart, 
  Mouse, 
  Clock, 
  FileText, 
  Mail, 
  BookOpen,
  GraduationCap,
  Eye,
  TrendingUp,
  LogOut,
  Settings
} from 'lucide-react';
import { AdminLogin } from '@/components/AdminLogin';
import { ContactsWithReply } from '@/components/ContactsWithReply';
import { FunctionLogs } from '@/components/FunctionLogs';
import { SecurityDashboard } from '@/components/SecurityDashboard';
import { AdminRegistrationDebug } from '@/components/AdminRegistrationDebug';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsData {
  totalEvents: number;
  totalSessions: number;
  totalDownloads: number;
  totalLikes: number;
  avgSessionDuration: number;
  topClickedElements: Array<{ element: string; count: number }>;
  pageViews: Array<{ page: string; count: number }>;
  dailyActivity: Array<{ date: string; events: number; sessions: number }>;
  downloadEvents: Array<{ id: string; created_at: string; page_url: string; download_details: any; user_agent: string; ip_address: string }>;
}

interface DatabaseTables {
  contacts: any[];
  bookRequests: any[];
  lessonRegistrations: any[];
  donationInteractions: any[];
  analyticsEvents: any[];
  userSessions: any[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#0088fe'];

export default function Dashboard() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [tables, setTables] = useState<DatabaseTables | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [updatingPrayerTimes, setUpdatingPrayerTimes] = useState(false);

  // Load dashboard data when user is authenticated and is admin
  useEffect(() => {
    console.log('📊 Dashboard effect triggered:', { 
      hasUser: !!user, 
      isAdmin, 
      authLoading 
    });
    
    if (!authLoading && user && isAdmin) {
      console.log('✅ Loading dashboard data for admin user');
      loadDashboardData();
    } else if (!authLoading) {
      console.log('❌ Not loading dashboard data:', { hasUser: !!user, isAdmin });
      setLoading(false); // Important: stop loading if conditions aren't met
    }
  }, [user, isAdmin, authLoading]);

  const handleLogout = async () => {
    console.log('👋 Logging out...');
    await signOut();
  };

  const updatePrayerTimes = async () => {
    setUpdatingPrayerTimes(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-daily-prayer-times');
      if (error) throw error;
      toast.success("Orari di preghiera aggiornati con successo!");
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating prayer times:', error);
      toast.error("Errore nell'aggiornamento degli orari di preghiera");
    } finally {
      setUpdatingPrayerTimes(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      console.log('📊 Loading dashboard data...');
      setLoading(true);
      
      // Load analytics data
      const analyticsData = await loadAnalytics();
      setAnalytics(analyticsData);
      
      // Load database tables
      const tablesData = await loadTables();
      setTables(tablesData);
      
      console.log('✅ Dashboard data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async (): Promise<AnalyticsData> => {
    // Get total events
    const { count: totalEvents } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true });

    // Get total sessions
    const { count: totalSessions } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true });

    // Get downloads with details
    const { data: downloadEvents, count: totalDownloads } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact' })
      .eq('event_type', 'download');

    // Get likes from donation interactions
    const { count: totalLikes } = await supabase
      .from('donation_interactions')
      .select('*', { count: 'exact', head: true })
      .eq('interaction_type', 'like');

    // Get average session duration
    const { data: sessions } = await supabase
      .from('user_sessions')
      .select('duration_seconds')
      .not('duration_seconds', 'is', null);

    const avgSessionDuration = sessions?.length 
      ? sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / sessions.length
      : 0;

    // Get top clicked elements
    const { data: clickEvents } = await supabase
      .from('analytics_events')
      .select('element_text, metadata')
      .eq('event_type', 'click')
      .not('element_text', 'is', null);

    const clickCounts: Record<string, number> = {};
    clickEvents?.forEach(event => {
      const element = event.element_text || 'Unknown';
      clickCounts[element] = (clickCounts[element] || 0) + 1;
    });

    const topClickedElements = Object.entries(clickCounts)
      .map(([element, count]) => ({ element, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get page views
    const { data: pageViewEvents } = await supabase
      .from('analytics_events')
      .select('page_url')
      .eq('event_type', 'page_view');

    const pageViewCounts: Record<string, number> = {};
    pageViewEvents?.forEach(event => {
      const page = event.page_url || '/';
      pageViewCounts[page] = (pageViewCounts[page] || 0) + 1;
    });

    const pageViews = Object.entries(pageViewCounts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count);

    // Get daily activity for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: dailyEvents } = await supabase
      .from('analytics_events')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString());

    const { data: dailySessions } = await supabase
      .from('user_sessions')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString());

    const dailyActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = format(date, 'dd/MM');
      
      const eventsCount = dailyEvents?.filter(e => 
        format(new Date(e.created_at), 'dd/MM') === dateStr
      ).length || 0;
      
      const sessionsCount = dailySessions?.filter(s => 
        format(new Date(s.created_at), 'dd/MM') === dateStr
      ).length || 0;

      return {
        date: dateStr,
        events: eventsCount,
        sessions: sessionsCount
      };
    });

    return {
      totalEvents: totalEvents || 0,
      totalSessions: totalSessions || 0,
      totalDownloads: totalDownloads || 0,
      totalLikes: totalLikes || 0,
      avgSessionDuration,
      topClickedElements,
      pageViews,
      dailyActivity,
      downloadEvents: downloadEvents || []
    };
  };

  const loadTables = async (): Promise<DatabaseTables> => {
    const [
      { data: contacts },
      { data: bookRequests },
      { data: lessonRegistrations },
      { data: donationInteractions },
      { data: analyticsEvents },
      { data: userSessions }
    ] = await Promise.all([
      supabase.from('contacts').select('*').order('created_at', { ascending: false }),
      supabase.from('book_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('lesson_registrations').select('*').order('created_at', { ascending: false }),
      supabase.from('donation_interactions').select('*').order('created_at', { ascending: false }),
      supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('user_sessions').select('*').order('created_at', { ascending: false }).limit(50)
    ]);

    return {
      contacts: contacts || [],
      bookRequests: bookRequests || [],
      lessonRegistrations: lessonRegistrations || [],
      donationInteractions: donationInteractions || [],
      analyticsEvents: analyticsEvents || [],
      userSessions: userSessions || []
    };
  };

  // Show login screen if not authenticated or not admin
  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Verifica autenticazione...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    console.log('🚪 Showing login screen:', { hasUser: !!user, isAdmin });
    return <AdminLogin />;
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Caricamento dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <div className="flex gap-2">
          <Button 
            onClick={updatePrayerTimes} 
            disabled={updatingPrayerTimes}
            className="bg-primary hover:bg-primary/90"
          >
            {updatingPrayerTimes ? "Aggiornando..." : "Aggiorna Orari Preghiera"}
          </Button>
          <Button onClick={loadDashboardData} variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Aggiorna Dati
          </Button>
          <Button onClick={handleLogout} variant="destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventi Totali</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalEvents || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessioni</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalSessions || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Download PDF</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalDownloads || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Like Donazioni</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalLikes || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="overview">Analytics</TabsTrigger>
          <TabsTrigger value="tables">Database</TabsTrigger>
          <TabsTrigger value="interactions">Interazioni</TabsTrigger>
          <TabsTrigger value="sessions">Sessioni</TabsTrigger>
          <TabsTrigger value="contacts">Messaggi</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="security">Sicurezza</TabsTrigger>
          <TabsTrigger value="downloads">Download</TabsTrigger>
          <TabsTrigger value="debug">Debug Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attività Giornaliera (Ultimi 7 giorni)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics?.dailyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="events" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="sessions" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pagine Più Visitate</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics?.pageViews?.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="page" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Elementi Più Cliccati</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics?.topClickedElements?.slice(0, 8).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm truncate max-w-[200px]">
                        {item.element || 'Elemento sconosciuto'}
                      </span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Durata Media Sessione</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {Math.round(analytics?.avgSessionDuration || 0)}s
                  </div>
                  <p className="text-muted-foreground">
                    Tempo medio di permanenza sul sito
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tables" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contatti ({tables?.contacts?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tables?.contacts?.slice(0, 5).map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell>{contact.name}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{format(new Date(contact.created_at), 'dd/MM/yyyy', { locale: it })}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Richieste Libri ({tables?.bookRequests?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Libro</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tables?.bookRequests?.slice(0, 5).map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>{request.name}</TableCell>
                          <TableCell>{request.selected_book}</TableCell>
                          <TableCell>
                            <Badge variant={request.request_type === 'acquisto' ? 'default' : 'secondary'}>
                              {request.request_type}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(request.created_at), 'dd/MM/yyyy', { locale: it })}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Iscrizioni Lezioni ({tables?.lessonRegistrations?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Genitore</TableHead>
                        <TableHead>Bambino</TableHead>
                        <TableHead>Età</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tables?.lessonRegistrations?.slice(0, 5).map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell>{registration.parent_name}</TableCell>
                          <TableCell>{registration.child_name}</TableCell>
                          <TableCell>{registration.child_age}</TableCell>
                          <TableCell>{format(new Date(registration.created_at), 'dd/MM/yyyy', { locale: it })}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Interazioni Donazioni ({tables?.donationInteractions?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Dettagli</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tables?.donationInteractions?.slice(0, 5).map((interaction) => (
                        <TableRow key={interaction.id}>
                          <TableCell>
                            <Badge>{interaction.interaction_type}</Badge>
                          </TableCell>
                          <TableCell>{JSON.stringify(interaction.details)}</TableCell>
                          <TableCell>{format(new Date(interaction.created_at), 'dd/MM/yyyy HH:mm', { locale: it })}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Eventi Analytics Recenti</CardTitle>
              <CardDescription>
                Ultimi 100 eventi di tracciamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Nome Evento</TableHead>
                      <TableHead>Elemento</TableHead>
                      <TableHead>Pagina</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tables?.analyticsEvents?.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Badge variant={
                            event.event_type === 'click' ? 'default' :
                            event.event_type === 'download' ? 'secondary' :
                            event.event_type === 'page_view' ? 'outline' : 'destructive'
                          }>
                            {event.event_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{event.event_name}</TableCell>
                        <TableCell className="max-w-32 truncate">{event.element_text || '-'}</TableCell>
                        <TableCell>{event.page_url}</TableCell>
                        <TableCell>{format(new Date(event.created_at), 'dd/MM HH:mm', { locale: it })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sessioni Utente</CardTitle>
              <CardDescription>
                Informazioni dettagliate sulle sessioni degli utenti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Sessione</TableHead>
                      <TableHead>Durata</TableHead>
                      <TableHead>Pagine</TableHead>
                      <TableHead>Click</TableHead>
                      <TableHead>Inizio</TableHead>
                      <TableHead>Fine</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tables?.userSessions?.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-mono text-xs">{session.session_id.slice(0, 16)}...</TableCell>
                        <TableCell>{session.duration_seconds ? `${session.duration_seconds}s` : '-'}</TableCell>
                        <TableCell>{session.pages_visited}</TableCell>
                        <TableCell>{session.total_clicks}</TableCell>
                        <TableCell>{format(new Date(session.start_time), 'dd/MM HH:mm', { locale: it })}</TableCell>
                        <TableCell>{session.end_time ? format(new Date(session.end_time), 'dd/MM HH:mm', { locale: it }) : 'Attiva'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <ContactsWithReply />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <FunctionLogs />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityDashboard />
        </TabsContent>

        <TabsContent value="downloads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Dettagli Download ({analytics?.downloadEvents?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Ora</TableHead>
                      <TableHead>Pagina</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>User Agent</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics?.downloadEvents?.slice(0, 50).map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(event.created_at), 'dd/MM/yyyy HH:mm', { locale: it })}
                        </TableCell>
                        <TableCell>{event.page_url}</TableCell>
                        <TableCell>
                          {event.download_details?.filename || 'PDF Download'}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {event.user_agent?.split(' ')[0] || '-'}
                        </TableCell>
                        <TableCell>{event.ip_address || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debug" className="space-y-6">
          <AdminRegistrationDebug />
        </TabsContent>
      </Tabs>
    </div>
  );
}
