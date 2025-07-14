import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Mail, Heart, Building, BookOpen, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import StarBorder from "@/components/StarBorder";
import sadaqaTreeImg from "@/assets/sadaqa-tree.jpg";
import mosqueHeroImg from "@/assets/mosque-hero.jpg";
import { useState } from "react";

const bankDetails = {
  beneficiary: "Associazione Masjid As-Sunnah",
  iban: "IT60 X054 2811 1010 0000 0123456",
  causale: "Donazione per moschea"
};

const impactAreas = [
  {
    icon: Building,
    title: "Manutenzione della Moschea",
    description: "Mantenimento e miglioramento degli spazi di preghiera e delle strutture"
  },
  {
    icon: BookOpen,
    title: "Materiale Educativo",
    description: "Acquisto di libri, risorse didattiche e tecnologie per l'apprendimento"
  },
  {
    icon: Users,
    title: "Attività Comunitarie",
    description: "Organizzazione di eventi, lezioni e programmi per la comunità"
  },
  {
    icon: Heart,
    title: "Aiuto ai Bisognosi",
    description: "Supporto a famiglie in difficoltà e progetti di beneficenza"
  }
];

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  toast({
    title: "Copiato!",
    description: `${label} copiato negli appunti`,
  });
};

export const Dona = () => {
  const [isLiked, setIsLiked] = useState(false);

  const handleHeartClick = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Rimosso dai preferiti" : "Aggiunto ai preferiti",
      description: isLiked ? "Hai rimosso questa causa dai tuoi preferiti" : "Grazie per aver mostrato apprezzamento per questa nobile causa",
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section with Tree Image */}
      <section className="text-center mb-16">
        <div className="relative mb-8">
          <div className="w-full max-w-2xl mx-auto aspect-[16/10] rounded-2xl overflow-hidden">
            <img 
              src={sadaqaTreeImg} 
              alt="Albero della Sadaqa Jariyah"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Sostieni la Nostra Comunità
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          La tua donazione è una sadaqa jariyah che continuerà a portare benefici anche dopo 
          di te, sostenendo la crescita spirituale della nostra comunità e l'aiuto a chi è nel bisogno.
        </p>
      </section>

      {/* Importance of Sadaqa Jariyah */}
      <section className="mb-16">
        <Card className="max-w-4xl mx-auto rounded-3xl">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
              Il Valore della Sadaqa Jariyah
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Il Profeta Muhammad (pace e benedizioni su di lui) disse: 
                  <em className="italic text-foreground"> "Quando il figlio di Adamo muore, 
                  tutte le sue azioni cessano, tranne tre: una carità continua (sadaqa jariyah), 
                  una conoscenza che beneficia gli altri, o un figlio pio che prega per lui."</em>
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Contribuendo alla nostra moschea, stai investendo in un progetto che continuerà 
                  a beneficiare generazioni di musulmani, attraverso l'educazione, la preghiera 
                  e il sostegno comunitario.
                </p>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105" onClick={handleHeartClick}>
                  <Heart 
                    className={`h-16 w-16 transition-all duration-300 ${
                      isLiked 
                        ? 'text-red-500 fill-red-500 scale-110' 
                        : 'text-primary hover:text-red-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Impact Areas */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Come Utilizziamo le Vostre Donazioni
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactAreas.map((area, index) => (
            <StarBorder
              key={index}
              as="div"
              color="hsl(var(--primary))"
              speed="5s"
              thickness={3.5}
              className="w-full h-full"
            >
              <Card className="text-center hover:shadow-lg transition-shadow bg-transparent border-0 h-[200px]">
                <CardContent className="p-6 h-full flex flex-col justify-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <area.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{area.title}</h3>
                  <p className="text-sm text-muted-foreground">{area.description}</p>
                </CardContent>
              </Card>
            </StarBorder>
          ))}
        </div>
      </section>

      {/* Bank Details */}
      <section className="mb-16">
        <Card className="max-w-2xl mx-auto rounded-3xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Dati Bancari per Donazioni</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Beneficiario</label>
                  <p className="font-medium text-foreground">{bankDetails.beneficiary}</p>
                </div>
                <StarBorder
                  as="div"
                  color="hsl(var(--accent))"
                  speed="3s"
                  thickness={2}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(bankDetails.beneficiary, "Beneficiario")}
                    className="bg-transparent border-0 hover:bg-transparent"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </StarBorder>
              </div>

              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">IBAN</label>
                  <p className="font-mono font-medium text-foreground">{bankDetails.iban}</p>
                </div>
                <StarBorder
                  as="div"
                  color="hsl(var(--accent))"
                  speed="3s"
                  thickness={2}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(bankDetails.iban, "IBAN")}
                    className="bg-transparent border-0 hover:bg-transparent"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </StarBorder>
              </div>

              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Causale</label>
                  <p className="font-medium text-foreground">{bankDetails.causale}</p>
                </div>
                <StarBorder
                  as="div"
                  color="hsl(var(--accent))"
                  speed="3s"
                  thickness={2}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(bankDetails.causale, "Causale")}
                    className="bg-transparent border-0 hover:bg-transparent"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </StarBorder>
              </div>
            </div>

            <div className="text-center pt-4">
              <StarBorder
                as="div"
                color="hsl(var(--primary))"
                speed="4s"
                thickness={3.5}
                className="inline-block"
              >
                <Button className="gap-2 bg-transparent border-0 hover:bg-transparent text-foreground hover:text-foreground" size="lg">
                  <Mail className="h-4 w-4" />
                  Invia Ricevuta via Email
                </Button>
              </StarBorder>
              <p className="text-sm text-muted-foreground mt-2">
                Clicca per aprire il tuo client email e inviarci la ricevuta della donazione
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Mosque Image */}
      <section className="text-center">
        <div className="max-w-3xl mx-auto">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6">
            <img 
              src={mosqueHeroImg} 
              alt="Masjid As-Sunnah"
              className="w-full h-full object-cover"
            />
          </div>
          
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                Ogni donazione, grande o piccola, è preziosa agli occhi di Allah. 
                La vostra generosità aiuta a mantenere viva questa casa di Allah e 
                a servire la comunità musulmana con amore e dedizione.
              </p>
              <p className="text-foreground font-medium mt-4">
                Jazakum Allahu Khairan - Che Allah vi ricompensi con il bene
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};