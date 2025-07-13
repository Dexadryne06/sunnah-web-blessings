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
    <div className="relative min-h-screen">
      {/* Dynamic Background that follows scroll */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${peacefulBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: 0.15
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-32"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 tracking-tight">
              Chi Siamo
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Masjid As-Sunnah è una comunità unita dalla fede, dedicata all'adorazione, 
              all'apprendimento e al servizio alla società.
            </p>
          </motion.div>

          {/* Journey Timeline */}
          <div className="max-w-4xl mx-auto space-y-32">
            {storyContent.map((section, index) => {
              const [ref, isInView] = useInView(0.2);
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={index}
                  ref={ref}
                  className={`flex flex-col lg:flex-row items-center gap-12 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                  initial={{ opacity: 0, x: isEven ? -100 : 100 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -100 : 100 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                        Passo {index + 1}
                      </div>
                      <h2 className="text-3xl font-bold text-foreground mb-6">
                        {section.title}
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {section.content}
                      </p>
                    </motion.div>
                  </div>

                  {/* Visual Element */}
                  <motion.div
                    className="flex-1 lg:max-w-md"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <div className="aspect-square bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 flex items-center justify-center">
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-primary">{index + 1}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Final Values Section */}
          <motion.div
            className="mt-32 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-12">
              I Nostri Pilastri
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { title: "Unità e Fratellanza", desc: "Crediamo nell'importanza dell'unità tra i musulmani", icon: "🤝" },
                { title: "Conoscenza e Educazione", desc: "Promuoviamo l'apprendimento continuo del Corano e della Sunnah", icon: "📚" },
                { title: "Servizio alla Comunità", desc: "Ci dedichiamo ad aiutare chi è nel bisogno", icon: "❤️" },
                { title: "Accoglienza e Inclusione", desc: "Accogliamo tutti coloro che desiderano avvicinarsi all'Islam", icon: "🌟" }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  className="p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.05)" }}
                >
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};