import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import StarBorder from "@/components/StarBorder";

// Mock data for lessons
const weeklyLessons = [
  {
    id: 1,
    day: "Lunedì",
    title: "Tafsir del Corano",
    description: "Studio approfondito dell'interpretazione coranica con focus sui versetti della settimana",
    time: "20:00 - 21:30",
    instructor: "Imam Abdullah",
    location: "Sala principale",
    level: "Intermedio",
    image: "/placeholder-lesson-1.jpg"
  },
  {
    id: 2,
    day: "Martedì",
    title: "Hadith e Sunnah",
    description: "Analisi dei detti e delle azioni del Profeta Muhammad (PBSL) per la vita quotidiana",
    time: "19:30 - 21:00",
    instructor: "Ustadh Omar",
    location: "Sala studio",
    level: "Principiante",
    image: "/placeholder-lesson-2.jpg"
  },
  {
    id: 3,
    day: "Mercoledì",
    title: "Fiqh Contemporaneo",
    description: "Discussione su questioni giuridiche islamiche nel mondo moderno",
    time: "20:30 - 22:00",
    instructor: "Sheikh Ahmed",
    location: "Aula conferenze",
    level: "Avanzato",
    image: "/placeholder-lesson-3.jpg"
  },
  {
    id: 4,
    day: "Giovedì",
    title: "Studio del Corano",
    description: "Lettura, memorizzazione e recitazione del Corano con tajweed",
    time: "19:00 - 20:30",
    instructor: "Qari Yusuf",
    location: "Sala principale",
    level: "Tutti i livelli",
    image: "/placeholder-lesson-4.jpg"
  },
  {
    id: 5,
    day: "Venerdì",
    title: "Khutbah del Venerdì",
    description: "Sermone del venerdì seguito dalla preghiera comunitaria",
    time: "12:30 - 13:30",
    instructor: "Imam Abdullah",
    location: "Sala principale",
    level: "Tutti",
    image: "/placeholder-lesson-5.jpg"
  },
  {
    id: 6,
    day: "Sabato",
    title: "Madrasa per Bambini",
    description: "Educazione islamica per bambini dai 6 ai 12 anni con attività ludiche",
    time: "10:00 - 12:00",
    instructor: "Ustadha Fatima",
    location: "Sala bambini",
    level: "Bambini",
    image: "/placeholder-lesson-6.jpg"
  },
  {
    id: 7,
    day: "Domenica",
    title: "Cerchio di Studio",
    description: "Discussione aperta su temi spirituali e crescita personale nell'Islam",
    time: "16:00 - 17:30",
    instructor: "Comunità",
    location: "Sala riunioni",
    level: "Tutti",
    image: "/placeholder-lesson-7.jpg"
  }
];

const specialEvents = [
  {
    title: "Conferenza: L'Islam nel XXI Secolo",
    date: "15 Marzo 2024",
    time: "19:00 - 21:00",
    speaker: "Dr. Ahmad Hassan",
    description: "Una riflessione sui valori islamici nella società contemporanea"
  },
  {
    title: "Iftar Comunitario",
    date: "22 Marzo 2024",
    time: "18:30 - 20:00",
    speaker: "Comunità",
    description: "Cena di rottura del digiuno aperta a tutti i fedeli e alle loro famiglie"
  },
  {
    title: "Seminario: La Famiglia nell'Islam",
    date: "5 Aprile 2024",
    time: "15:00 - 17:00",
    speaker: "Ustadha Aisha",
    description: "Workshop sui ruoli e le responsabilità familiari secondo gli insegnamenti islamici"
  }
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Principiante":
      return "bg-green-100 text-green-800";
    case "Intermedio":
      return "bg-yellow-100 text-yellow-800";
    case "Avanzato":
      return "bg-red-100 text-red-800";
    case "Bambini":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const Lezioni = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Lezioni e Attività
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Partecipa alle nostre lezioni settimanali e approfondisci la tua conoscenza dell'Islam
        </p>
      </div>

      {/* Weekly Schedule */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Programma Settimanale
        </h2>
        
        <div className="grid gap-6">
          {weeklyLessons.map((lesson) => (
            <StarBorder
              key={lesson.id}
              as="div"
              color="hsl(var(--primary))"
              speed="6s"
              thickness={3.5}
              className="w-full"
            >
              <Card className="hover:shadow-lg transition-shadow bg-transparent border-0">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="md:w-48 aspect-video md:aspect-square bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-muted-foreground text-sm text-center px-4">
                        {lesson.title}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <Badge variant="outline" className="font-semibold">
                          {lesson.day}
                        </Badge>
                        <Badge className={getLevelColor(lesson.level)}>
                          {lesson.level}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {lesson.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {lesson.description}
                      </p>
                      
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {lesson.time}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          {lesson.instructor}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {lesson.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StarBorder>
          ))}
        </div>
      </div>

      {/* Special Events */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Eventi Speciali
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialEvents.map((event, index) => (
            <StarBorder
              key={index}
              as="div"
              color="hsl(var(--accent))"
              speed="4s"
              thickness={3.5}
              className="w-full h-full"
            >
              <Card className="hover:shadow-lg transition-shadow bg-transparent border-0">
                <CardHeader>
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">{event.date}</span>
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <User className="h-4 w-4" />
                      {event.speaker}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </StarBorder>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-16 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Come Partecipare
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Tutte le nostre lezioni sono gratuite e aperte a tutti, indipendentemente dal livello 
              di conoscenza. Non è necessaria prenotazione per le lezioni regolari.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Per eventi speciali o workshop, consigliamo di contattarci in anticipo per 
              confermare la disponibilità dei posti.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};