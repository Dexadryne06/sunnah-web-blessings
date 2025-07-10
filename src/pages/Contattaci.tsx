import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import StarBorder from "@/components/StarBorder";

const contactInfo = [
  {
    icon: MapPin,
    title: "Indirizzo",
    details: ["Via dell'Esempio 123", "00100 Roma (RM)", "Italia"]
  },
  {
    icon: Phone,
    title: "Telefono",
    details: ["+39 06 1234567", "Disponibile dalle 9:00 alle 18:00"]
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@masjidassunnah.it", "imam@masjidassunnah.it"]
  },
  {
    icon: Clock,
    title: "Orari di Apertura",
    details: ["Tutti i giorni: 5:00 - 22:00", "Ufficio: Lun-Ven 9:00 - 18:00"]
  }
];

export const Contattaci = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Messaggio Inviato!",
      description: "Grazie per averci contattato. Ti risponderemo entro 24 ore.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });

    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Contattaci
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Siamo qui per rispondere alle tue domande e aiutarti nel tuo percorso spirituale
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Informazioni di Contatto
            </h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <StarBorder
                  key={index}
                  as="div"
                  color="hsl(var(--primary))"
                  speed="4s"
                  thickness={3.5}
                  className="w-full"
                >
                  <Card className="bg-transparent border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <info.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                          {info.details.map((detail, detailIndex) => (
                            <p key={detailIndex} className="text-muted-foreground text-sm">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StarBorder>
              ))}
            </div>
          </div>

          {/* Map Placeholder */}
          <Card>
            <CardContent className="p-6">
              <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground">Mappa della Moschea</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Invia un Messaggio</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Il tuo nome"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="tua@email.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Oggetto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Oggetto del messaggio"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Messaggio *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Scrivi qui il tuo messaggio..."
                    className="mt-1 min-h-32"
                  />
                </div>

                <StarBorder
                  as="div"
                  color="hsl(var(--primary))"
                  speed="4s"
                  thickness={3.5}
                  className="w-full"
                >
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full gap-2 bg-transparent border-0 hover:bg-transparent"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Invio in corso..."
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Invia Messaggio
                      </>
                    )}
                  </Button>
                </StarBorder>
              </form>
            </CardContent>
          </Card>

          {/* Response Time Info */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-2">
                Tempi di Risposta
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Cerchiamo di rispondere a tutti i messaggi entro 24 ore durante i giorni feriali. 
                Per questioni urgenti, ti consigliamo di contattarci direttamente per telefono 
                durante gli orari di apertura dell'ufficio.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-16 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Come Possiamo Aiutarti
            </h2>
            <div className="text-left space-y-3 text-muted-foreground">
              <p>• Informazioni sulle attività della moschea</p>
              <p>• Consulenza spirituale e religiosa</p>
              <p>• Organizzazione di eventi e cerimonie</p>
              <p>• Supporto per nuovi convertiti</p>
              <p>• Collaborazioni e partnership</p>
              <p>• Donazioni e contributi</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};