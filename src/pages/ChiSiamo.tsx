import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import peacefulBg from "@/assets/peaceful-background.jpg";

const storyContent = [
  {
    title: "La Nostra Missione",
    content: "La nostra missione è quella di fornire un luogo sacro e accogliente dove i musulmani possano riunirsi per adorare Allah, apprendere gli insegnamenti dell'Islam e rafforzare i legami di fratellanza. Ci impegniamo a seguire la Sunnah del Profeta Muhammad (pace e benedizioni su di lui) in ogni aspetto della nostra vita comunitaria."
  },
  {
    title: "I Nostri Valori",
    content: "Crediamo nell'importanza dell'unità tra i musulmani, indipendentemente dalla loro origine o background culturale. Promuoviamo l'apprendimento continuo del Corano, della Sunnah e delle scienze islamiche. Ci dedichiamo ad aiutare chi è nel bisogno e a contribuire positivamente alla società."
  },
  {
    title: "La Nostra Storia",
    content: "Masjid As-Sunnah è stata fondata con l'obiettivo di creare uno spazio dove la comunità musulmana locale potesse riunirsi per la preghiera, l'apprendimento e il sostegno reciproco. Nel corso degli anni, siamo cresciuti come famiglia, accogliendo fedeli di diverse età e background."
  },
  {
    title: "Le Nostre Attività",
    content: "Oggi la nostra moschea non è solo un luogo di culto, ma un centro culturale e educativo che organizza regolarmente lezioni, conferenze e attività comunitarie. Continuiamo a lavorare per rafforzare i legami all'interno della nostra comunità."
  }
];

const useInView = (threshold = 0.3) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isInView] as const;
};

export const ChiSiamo = () => {
  return (
    <div className="relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `url(${peacefulBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Chi Siamo
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Masjid As-Sunnah è una comunità unita dalla fede, dedicata all'adorazione, 
                all'apprendimento e al servizio alla società.
              </p>
            </motion.div>

            {/* Story Sections */}
            <div className="space-y-16">
              {storyContent.map((section, index) => {
                const [ref, isInView] = useInView();
                
                return (
                  <motion.div
                    key={index}
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Card className="bg-background/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-8">
                        <motion.h2 
                          className="text-2xl font-semibold text-foreground mb-4"
                          initial={{ opacity: 0 }}
                          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                        >
                          {section.title}
                        </motion.h2>
                        <motion.p 
                          className="text-muted-foreground leading-relaxed text-lg"
                          initial={{ opacity: 0 }}
                          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ duration: 0.6, delay: 0.6 }}
                        >
                          {section.content}
                        </motion.p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Values Grid */}
            <motion.div
              className="mt-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-background/90 backdrop-blur-sm shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
                    I Nostri Pilastri
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { title: "Unità e Fratellanza", desc: "Crediamo nell'importanza dell'unità tra i musulmani" },
                      { title: "Conoscenza e Educazione", desc: "Promuoviamo l'apprendimento continuo del Corano e della Sunnah" },
                      { title: "Servizio alla Comunità", desc: "Ci dedichiamo ad aiutare chi è nel bisogno" },
                      { title: "Accoglienza e Inclusione", desc: "Accogliamo tutti coloro che desiderano avvicinarsi all'Islam" }
                    ].map((value, index) => (
                      <motion.div
                        key={index}
                        className="p-4 rounded-lg bg-muted/30"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <h3 className="text-lg font-medium text-foreground mb-2">{value.title}</h3>
                        <p className="text-muted-foreground text-sm">{value.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};