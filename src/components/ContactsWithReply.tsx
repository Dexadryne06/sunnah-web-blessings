import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Mail, Reply, Check, AlertCircle, Send, X } from 'lucide-react';
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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
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

  const handleStartReply = (contactId: string) => {
    setReplyingTo(contactId);
    setReplyText("");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handleSendReply = async (contact: Contact) => {
    if (!replyText.trim()) {
      toast.error('Inserisci un messaggio di risposta');
      return;
    }

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
          reply_message: replyText,
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
            response_status: 'completed'
          })
          .eq('id', contact.id);

        if (error) throw error;

        toast.success('Risposta inviata con successo!');
        setReplyingTo(null);
        setReplyText("");
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
                <>
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
                       {contact.response_status === 'completed' ? (
                         <Badge variant="secondary" className="flex items-center gap-1">
                           <Check className="h-3 w-3" />
                           Completato
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
                      {replyingTo === contact.id ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSendReply(contact)}
                            disabled={sendingReply === contact.id}
                            className="flex items-center gap-1"
                          >
                            <Send className="h-3 w-3" />
                            {sendingReply === contact.id ? 'Invio...' : 'Invia'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelReply}
                            disabled={sendingReply === contact.id}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleStartReply(contact.id)}
                          disabled={!!contact.responded_at}
                          className="flex items-center gap-1"
                        >
                          <Reply className="h-3 w-3" />
                          Rispondi
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  {replyingTo === contact.id && (
                    <TableRow>
                      <TableCell colSpan={6} className="p-4 bg-muted/50">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Scrivi la tua risposta:</label>
                          <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Inserisci il messaggio di risposta..."
                            rows={3}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};