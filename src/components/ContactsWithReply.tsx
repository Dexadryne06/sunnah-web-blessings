import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Mail, Reply, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  webhook_sent: boolean;
  responded_at: string | null;
  response_status: string | null;
}

export const ContactsWithReply = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingReply, setSendingReply] = useState<string | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error('Errore nel caricamento dei contatti');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (contact: Contact) => {
    setSendingReply(contact.id);
    
    try {
      const response = await fetch('https://primary-production-a9d2d.up.railway.app/webhook-test/a5301f42-598a-4f34-9a89-50668cd136dd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reply_to_contact',
          contact_id: contact.id,
          name: contact.name,
          email: contact.email,
          original_message: contact.message,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        // Update the contact record
        const { error } = await supabase
          .from('contacts')
          .update({
            webhook_sent: true,
            responded_at: new Date().toISOString(),
            response_status: 'sent'
          })
          .eq('id', contact.id);

        if (error) throw error;

        toast.success('Risposta inviata con successo!');
        loadContacts(); // Refresh the list
      } else {
        throw new Error('Webhook failed');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Errore nell\'invio della risposta');
      
      // Update with error status
      await supabase
        .from('contacts')
        .update({
          webhook_sent: false,
          response_status: 'error'
        })
        .eq('id', contact.id);
    } finally {
      setSendingReply(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Caricamento contatti...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Messaggi Contatti ({contacts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Messaggio</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell className="max-w-xs truncate" title={contact.message}>
                    {contact.message}
                  </TableCell>
                  <TableCell>
                    {format(new Date(contact.created_at), 'dd/MM/yyyy HH:mm', { locale: it })}
                  </TableCell>
                  <TableCell>
                    {contact.responded_at ? (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Risposto
                      </Badge>
                    ) : contact.response_status === 'error' ? (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Errore
                      </Badge>
                    ) : (
                      <Badge variant="outline">In attesa</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleReply(contact)}
                      disabled={!!contact.responded_at || sendingReply === contact.id}
                      className="flex items-center gap-1"
                    >
                      <Reply className="h-3 w-3" />
                      {sendingReply === contact.id ? 'Invio...' : 'Rispondi'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};