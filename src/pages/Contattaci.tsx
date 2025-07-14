import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import StarBorder from "@/components/StarBorder";

const contactInfo = [
  {
    icon: MapPin,
    title: "Indirizzo",
    details: ["Via dell'Esempio 123", "00100 Roma (RM)"],
    action: "Visualizza su Maps"
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    details: ["+39 123 456 7890"],
    action: "Invia messaggio"
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@masjidassunnah.it"],
    action: "Invia email"
  },
  {
    icon: Clock,
    title: "Orari",
    details: ["Tutti i giorni: 5:00 - 22:00"],
    action: null
  }
];

export const Contattaci = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
          Siamo qui per rispondere alle tue domande
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {contactInfo.map((info, index) => (
          <StarBorder
            key={index}
            as="div"
            color="hsl(var(--primary))"
            speed="4s"
            thickness={3.5}
            className="w-full h-full"
          >
            <Card className="bg-transparent border-0 hover:scale-105 transition-transform duration-300 cursor-pointer group h-[280px]">
              <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <info.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-3">{info.title}</h3>
                {info.details.map((detail, detailIndex) => (
                  <p key={detailIndex} className="text-muted-foreground text-sm mb-2">
                    {detail}
                  </p>
                ))}
                {info.action && (
                  <Button variant="ghost" size="sm" className="mt-2 text-primary hover:text-primary">
                    {info.action}
                  </Button>
                )}
              </CardContent>
            </Card>
          </StarBorder>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {/* Large Map */}
        <div className="lg:col-span-2">
          <StarBorder
            as="div"
            color="hsl(var(--accent))"
            speed="5s"
            thickness={3.5}
            className="w-full h-full"
          >
            <Card className="bg-transparent border-0 h-full">
              <CardContent className="p-6 h-full">
                <div className="aspect-[16/10] bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <MapPin className="h-20 w-20 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-foreground mb-2">Masjid As-Sunnah</h3>
                    <p className="text-muted-foreground text-lg">Via dell'Esempio 123, Roma</p>
                    <Button className="mt-4" variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Apri in Google Maps
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </StarBorder>
        </div>

        {/* Simplified Contact Form */}
        <div>
          <StarBorder
            as="div"
            color="hsl(var(--primary))"
            speed="4s"
            thickness={3.5}
            className="w-full h-full"
          >
            <Card className="bg-transparent border-0 h-full">
              <CardHeader>
                <CardTitle className="text-xl">Invia un Messaggio</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
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

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full gap-2"
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
                </form>
              </CardContent>
            </Card>
          </StarBorder>
        </div>
      </div>
    </div>
  );
};