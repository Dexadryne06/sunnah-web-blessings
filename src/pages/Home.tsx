import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import StarBorder from "@/components/StarBorder";
import MetaBalls from "@/components/MetaBalls";
import quranStudyImg from "@/assets/quran-study.jpg";
import fridayPrayerImg from "@/assets/friday-prayer.jpg";
import childrenEducationImg from "@/assets/children-education.jpg";

// Mock data for prayer times
const prayerTimes = [
  { prayer: "Fajr", time: "05:30" },
  { prayer: "Dhuhr", time: "12:15" },
  { prayer: "Asr", time: "15:45" },
  { prayer: "Maghrib", time: "18:20" },
  { prayer: "Isha", time: "19:45" },
];

// Mock data for featured books
const featuredBooks = [
  {
    id: 1,
    title: "Il Corano",
    author: "Traduzione italiana",
    image: "/lovable-uploads/9cc6428e-f19a-4bb8-9610-10df6a646b7d.png"
  },
  {
    id: 2,
    title: "I Pilastri dell'Islam",
    author: "Guida essenziale",
    image: "/placeholder-book-2.jpg"
  },
  {
    id: 3,
    title: "La Vita del Profeta",
    author: "Storia e insegnamenti",
    image: "/placeholder-book-3.jpg"
  }
];

// Mock data for featured lessons
const featuredLessons = [
  {
    day: "Giovedì",
    title: "Studio del Corano",
    description: "Lettura e interpretazione dei versetti",
    image: quranStudyImg
  },
  {
    day: "Venerdì",
    title: "Preghiera del Venerdì",
    description: "Khutbah e preghiera comunitaria",
    image: fridayPrayerImg
  },
  {
    day: "Sabato",
    title: "Lezioni per bambini",
    description: "Educazione islamica per i più piccoli",
    image: childrenEducationImg
  }
];

export const Home = () => {
  return (
    <motion.div 
      className="space-y-16 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {/* MetaBalls Background */}
        <div className="absolute inset-0 opacity-30">
          <MetaBalls
            color="hsl(var(--muted-foreground))"
            cursorBallColor="hsl(var(--muted-foreground))"
            cursorBallSize={3}
            ballCount={12}
            animationSize={40}
            enableMouseInteraction={true}
            enableTransparency={true}
            hoverSmoothness={0.08}
            clumpFactor={0.8}
            speed={0.2}
          />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Benvenuti a Masjid As-Sunnah
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Un luogo di ritrovo, adorazione e tranquillità
          </motion.p>
        </div>
      </motion.section>

      {/* Prayer Times Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Orari delle Preghiere
          </h2>
          <p className="text-muted-foreground">
            Orari aggiornati per le cinque preghiere quotidiane
          </p>
          <p className="text-sm text-muted-foreground">
          Validi solo per <span className="text-red-600 underline">Bergamo e provincia</span>
        </p>
        </div>
        
        <Card className="max-w-3xl mx-auto shadow-2xl border-2 border-primary/20 rounded-2xl backdrop-blur-sm bg-background/80">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              Oggi - {new Date().toLocaleDateString('it-IT', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prayerTimes.map((prayer) => (
                <div key={prayer.prayer} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                  <span className="font-medium text-foreground">{prayer.prayer}</span>
                  <span className="text-lg font-semibold text-primary">{prayer.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <StarBorder
                as="div"
                color="hsl(var(--primary))"
                speed="4s"
                thickness={3.5}
                className="inline-block"
              >
                <Button className="gap-2 bg-transparent border-0 hover:bg-transparent text-foreground hover:text-foreground">
                  <Download className="h-4 w-4" />
                  Scarica PDF del mese
                </Button>
              </StarBorder>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Featured Books Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Libri in Evidenza
          </h2>
          <p className="text-muted-foreground">
            Scopri i testi fondamentali della nostra biblioteca - clicca per scaricare
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {featuredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <StarBorder
                as="div"
                color="hsl(var(--primary))"
                speed="5s"
                thickness={3.5}
                className="w-full h-full"
              >
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 bg-transparent border-0">
                  <CardContent className="p-6">
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={book.image} 
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </CardContent>
                </Card>
              </StarBorder>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <StarBorder
            as="div"
            color="hsl(var(--accent))"
            speed="6s"
            thickness={3.5}
            className="inline-block"
          >
            <Button asChild variant="outline" size="lg" className="bg-transparent border-0 hover:bg-transparent">
              <Link to="/libri">Tutti i libri</Link>
            </Button>
          </StarBorder>
        </div>
      </section>

      {/* Featured Lessons Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Lezioni in Evidenza
            </h2>
            <p className="text-muted-foreground">
              Partecipa alle nostre attività settimanali
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {featuredLessons.map((lesson, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <StarBorder
                  as="div"
                  color="hsl(var(--accent))"
                  speed="4s"
                  thickness={3.5}
                  className="w-full h-full"
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-transparent border-0">
                    <CardContent className="p-6">
                      <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                        <img 
                          src={lesson.image} 
                          alt={lesson.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="inline-block bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full mb-3">
                        {lesson.day}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">{lesson.description}</p>
                    </CardContent>
                  </Card>
                </StarBorder>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <StarBorder
              as="div"
              color="hsl(var(--primary))"
              speed="5s"
              thickness={3.5}
              className="inline-block"
            >
              <Button asChild variant="outline" size="lg" className="bg-transparent border-0 hover:bg-transparent">
                <Link to="/lezioni">Tutte le lezioni</Link>
              </Button>
            </StarBorder>
          </div>
        </div>
      </section>
    </motion.div>
  );
};