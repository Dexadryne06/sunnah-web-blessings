import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import StarBorder from "@/components/StarBorder";

// Mock data for books
const books = [
  {
    id: 1,
    title: "Il Sacro Corano",
    author: "Traduzione e commento in italiano",
    description: "Il testo sacro dell'Islam con traduzione accurata e note esplicative per una comprensione profonda dei versetti.",
    category: "Testo Sacro",
    image: "/placeholder-book-1.jpg",
    downloadUrl: "#"
  },
  {
    id: 2,
    title: "I Pilastri dell'Islam",
    author: "Guida completa per il musulmano",
    description: "Una guida dettagliata sui cinque pilastri fondamentali dell'Islam: Shahada, Salah, Zakat, Sawm e Hajj.",
    category: "Educazione",
    image: "/placeholder-book-2.jpg",
    downloadUrl: "#"
  },
  {
    id: 3,
    title: "La Vita del Profeta Muhammad (PBSL)",
    author: "Biografia completa",
    description: "La storia completa della vita del Profeta Muhammad, i suoi insegnamenti e il suo esempio per l'umanità.",
    category: "Biografia",
    image: "/placeholder-book-3.jpg",
    downloadUrl: "#"
  },
  {
    id: 4,
    title: "Hadith - Raccolta Autentica",
    author: "Sahih al-Bukhari - Estratti",
    description: "Una selezione dei hadith più importanti dalla raccolta di al-Bukhari, con spiegazioni e contesto.",
    category: "Hadith",
    image: "/placeholder-book-4.jpg",
    downloadUrl: "#"
  },
  {
    id: 5,
    title: "La Purificazione dell'Anima",
    author: "Imam Ibn Qayyim",
    description: "Un percorso spirituale per purificare il cuore e avvicinarsi ad Allah attraverso l'adorazione sincera.",
    category: "Spiritualità",
    image: "/placeholder-book-5.jpg",
    downloadUrl: "#"
  },
  {
    id: 6,
    title: "Il Fiqh per il Musulmano Contemporaneo",
    author: "Guida pratica",
    description: "Le regole islamiche per la vita quotidiana del musulmano nel mondo moderno, con esempi pratici.",
    category: "Fiqh",
    image: "/placeholder-book-6.jpg",
    downloadUrl: "#"
  },
  {
    id: 7,
    title: "La Bellezza della Preghiera",
    author: "Guida spirituale alla Salah",
    description: "Tutto quello che serve sapere sulla preghiera islamica: significato, movimenti e concentrazione spirituale.",
    category: "Adorazione",
    image: "/placeholder-book-7.jpg",
    downloadUrl: "#"
  },
  {
    id: 8,
    title: "Storie dei Compagni",
    author: "I Sahabah del Profeta",
    description: "Le storie ispiratrici dei compagni del Profeta Muhammad e i loro sacrifici per l'Islam.",
    category: "Storia",
    image: "/placeholder-book-8.jpg",
    downloadUrl: "#"
  },
  {
    id: 9,
    title: "L'Islam per i Bambini",
    author: "Educazione islamica illustrata",
    description: "Un libro colorato e divertente per insegnare ai bambini i principi base dell'Islam in modo semplice.",
    category: "Bambini",
    image: "/placeholder-book-9.jpg",
    downloadUrl: "#"
  }
];

const categories = ["Tutti", "Testo Sacro", "Educazione", "Biografia", "Hadith", "Spiritualità", "Fiqh", "Adorazione", "Storia", "Bambini"];

export const Libri = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Biblioteca Digitale
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Scopri la nostra collezione di libri islamici, disponibili per la lettura e il download gratuito
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <StarBorder
              key={category}
              as="div"
              color="hsl(var(--primary))"
              speed="4s"
              thickness={3.5}
              className="inline-block"
            >
              <Button
                variant={category === "Tutti" ? "default" : "outline"}
                size="sm"
                className="rounded-full bg-transparent border-0 hover:bg-transparent text-foreground hover:text-foreground"
              >
                {category}
              </Button>
            </StarBorder>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => (
          <StarBorder
            key={book.id}
            as="div"
            color="hsl(var(--accent))"
            speed="5s"
            thickness={3.5}
            className="w-full h-full"
          >
            <Card className="group hover:shadow-lg transition-all duration-300 bg-transparent border-0">
              <CardContent className="p-6">
                {/* Book Cover */}
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">
                    {book.title}
                  </span>
                </div>

                {/* Category Badge */}
                <div className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mb-3">
                  {book.category}
                </div>

                {/* Book Info */}
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  {book.author}
                </p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {book.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <StarBorder
                    as="div"
                    color="hsl(var(--primary))"
                    speed="3s"
                    thickness={2}
                    className="flex-1"
                  >
                    <Button size="sm" className="w-full gap-2 bg-transparent border-0 hover:bg-transparent text-foreground hover:text-foreground">
                      <Download className="h-4 w-4" />
                      Scarica
                    </Button>
                  </StarBorder>
                  <StarBorder
                    as="div"
                    color="hsl(var(--accent))"
                    speed="3s"
                    thickness={2}
                  >
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent border-0 hover:bg-transparent">
                      <ExternalLink className="h-4 w-4" />
                      Leggi
                    </Button>
                  </StarBorder>
                </div>
              </CardContent>
            </Card>
          </StarBorder>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-16 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Accesso Gratuito alla Conoscenza
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Tutti i libri della nostra biblioteca digitale sono disponibili gratuitamente 
              per lo studio e l'approfondimento della fede islamica. Incoraggiamo la condivisione 
              della conoscenza come forma di sadaqa jariyah (carità continua).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};