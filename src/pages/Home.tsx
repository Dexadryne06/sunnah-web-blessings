import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Link } from "react-router-dom";
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
    image: "/placeholder-book-1.jpg"
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
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Benvenuti a Masjid As-Sunnah
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Un luogo di ritrovo, adorazione e tranquillità
          </p>
        </div>
      </section>

      {/* Prayer Times Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Orari delle Preghiere
          </h2>
          <p className="text-muted-foreground">
            Orari aggiornati per le cinque preghiere quotidiane
          </p>
        </div>
        
        <Card className="max-w-2xl mx-auto">
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
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Scarica PDF del mese
              </Button>
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
            Scopri i testi fondamentali della nostra biblioteca
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {featuredBooks.map((book) => (
            <Card key={book.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="aspect-[3/4] bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-muted-foreground">Copertina libro</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg">
            <Link to="/libri">Tutti i libri</Link>
          </Button>
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

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {featuredLessons.map((lesson, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={lesson.image} 
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="inline-block bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full mb-3">
                    {lesson.day}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{lesson.title}</h3>
                  <p className="text-sm text-muted-foreground">{lesson.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/lezioni">Tutte le lezioni</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};