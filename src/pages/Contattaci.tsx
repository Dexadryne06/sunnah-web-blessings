import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import StarBorder from "@/components/StarBorder";
import { supabase } from "@/integrations/supabase/client";

const contactInfo = [
  {
    icon: MapPin,
    title: "Indirizzo",
    details: ["Via Paolo VI, 30", "24058 Romano di Lombardia BG"],
    action: "Visualizza su Maps",
    link: "https://maps.google.com/maps?hl=it&gl=it&um=1&ie=UTF-8&fb=1&sa=X&ftid=0x47814759cd685e35:0x92d57af1ef6eaec7"
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    details: ["+39 349 814 0152"],
    action: "Invia messaggio"
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@masjidas-sunnah.xyz"],
    action: "Invia email"
  },
  {
    icon: Clock,
    title: "Orari",
    details: ["Aperto agli orari di preghiera", "e durante le lezioni"],
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

    try {
      // Input validation
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
        toast({
          title: "Errore",
          description: "Tutti i campi sono obbligatori.",
          variant: "destructive",
        });
        return;
      }

      // Use secure edge function instead of direct webhook
      const { data, error } = await supabase.functions.invoke('secure-contact-form', {
        body: formData
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Errore durante l\'invio');
      }

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
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    }

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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-primary hover:text-primary"
                    onClick={() => info.link && window.open(info.link, '_blank')}
                  >
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
            <Card className="bg-transparent border-0 h-[500px]">
              <CardContent className="p-6 h-full">
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.2305700811003!2d9.7465551!3d45.5255655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47814759cd685e35%3A0x92d57af1ef6eaec7!2z2YXYs9is2K8g2KfZhNiz2YbYqQ!5e0!3m2!1sit!2sit!4v1752592381693!5m2!1sit!2sit" 
                    width="100%" 
                    height="100%" 
                    style={{border: 0}} 
                    allowFullScreen={true}
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
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
            <Card className="bg-transparent border-0 h-[500px]">
              <CardHeader>
                <CardTitle className="text-xl">Invia un Messaggio</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
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