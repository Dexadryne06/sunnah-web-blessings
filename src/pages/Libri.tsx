import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import StarBorder from "@/components/StarBorder";

// Mock data for Italian books
const italianBooks = [
  {
    id: 1,
    title: "Il Sacro Corano",
    author: "Traduzione e commento in italiano",
    description: "Il testo sacro dell'Islam con traduzione accurata e note esplicative per una comprensione profonda dei versetti.",
    category: "Qur'an",
    image: "/lovable-uploads/9cc6428e-f19a-4bb8-9610-10df6a646b7d.png",
    downloadUrl: "#"
  },
  {
    id: 2,
    title: "Sahih al-Bukhari - Estratti",
    author: "Imam al-Bukhari",
    description: "Una selezione dei hadith più importanti dalla raccolta di al-Bukhari, con spiegazioni e contesto.",
    category: "Hadith",
    image: "/placeholder-book-2.jpg",
    downloadUrl: "#"
  },
  {
    id: 3,
    title: "I Fondamenti della Fede",
    author: "Guida all'Aqeedah",
    description: "I principi fondamentali della fede islamica spiegati in modo chiaro e accessibile.",
    category: "Aqeedah",
    image: "/placeholder-book-3.jpg",
    downloadUrl: "#"
  },
  {
    id: 4,
    title: "Il Fiqh per il Musulmano Contemporaneo",
    author: "Guida pratica",
    description: "Le regole islamiche per la vita quotidiana del musulmano nel mondo moderno, con esempi pratici.",
    category: "Fiqh",
    image: "/placeholder-book-4.jpg",
    downloadUrl: "#"
  }
];

// Mock data for English books
const englishBooks = [
  {
    id: 1,
    title: "The Noble Qur'an",
    author: "English Translation and Commentary",
    description: "The sacred text of Islam with accurate translation and explanatory notes for deep understanding of the verses.",
    category: "Qur'an",
    image: "/lovable-uploads/9cc6428e-f19a-4bb8-9610-10df6a646b7d.png",
    downloadUrl: "#"
  },
  {
    id: 2,
    title: "Sahih al-Bukhari",
    author: "Imam al-Bukhari",
    description: "A selection of the most important hadith from al-Bukhari's collection, with explanations and context.",
    category: "Hadith",
    image: "/placeholder-book-2.jpg",
    downloadUrl: "#"
  },
  {
    id: 3,
    title: "Foundations of Islamic Belief",
    author: "A Guide to Aqeedah",
    description: "The fundamental principles of Islamic faith explained clearly and accessibly.",
    category: "Aqeedah",
    image: "/placeholder-book-3.jpg",
    downloadUrl: "#"
  },
  {
    id: 4,
    title: "Fiqh for the Contemporary Muslim",
    author: "Practical Guide",
    description: "Islamic rules for the daily life of Muslims in the modern world, with practical examples.",
    category: "Fiqh",
    image: "/placeholder-book-4.jpg",
    downloadUrl: "#"
  },
  {
    id: 5,
    title: "The Sealed Nectar",
    author: "Safi-ur-Rahman al-Mubarakpuri",
    description: "A complete biography of Prophet Muhammad (PBUH), his teachings and example for humanity.",
    category: "Qur'an",
    image: "/placeholder-book-5.jpg",
    downloadUrl: "#"
  },
  {
    id: 6,
    title: "Riyad as-Salihin",
    author: "Imam an-Nawawi",
    description: "Gardens of the Righteous - A collection of authentic hadith arranged by topics for spiritual development.",
    category: "Hadith",
    image: "/placeholder-book-6.jpg",
    downloadUrl: "#"
  },
  {
    id: 7,
    title: "The Fundamentals of Tawheed",
    author: "Dr. Abu Ameenah Bilal Philips",
    description: "A comprehensive study of Islamic monotheism and the foundations of Islamic belief.",
    category: "Aqeedah",
    image: "/placeholder-book-7.jpg",
    downloadUrl: "#"
  },
  {
    id: 8,
    title: "Fiqh us-Sunnah",
    author: "Sayyid Sabiq",
    description: "A comprehensive guide to Islamic jurisprudence based on the Qur'an and Sunnah.",
    category: "Fiqh",
    image: "/placeholder-book-8.jpg",
    downloadUrl: "#"
  }
];

export const Libri = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'italian' | 'english'>('italian');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutti');

  const currentBooks = selectedLanguage === 'italian' ? italianBooks : englishBooks;
  const categories = ["Tutti", "Qur'an", "Hadith", "Aqeedah", "Fiqh"];

  const filteredBooks = selectedCategory === 'Tutti' 
    ? currentBooks 
    : currentBooks.filter(book => book.category === selectedCategory);

  const languageContent = {
    italian: {
      title: "Biblioteca Digitale",
      subtitle: "Scopri la nostra collezione di libri islamici, disponibili per la lettura e il download gratuito",
      explanation: "Molti testi fondamentali dell'Islam non sono mai stati tradotti in italiano o necessitano di maggiore accuratezza nella traduzione. Per questo motivo, offriamo anche una selezione di libri in lingua inglese per garantire l'accesso alle fonti più autentiche e complete.",
      downloadBtn: "Scarica",
      readBtn: "Leggi",
      freeAccess: "Accesso Gratuito alla Conoscenza",
      freeAccessDesc: "Tutti i libri della nostra biblioteca digitale sono disponibili gratuitamente per lo studio e l'approfondimento della fede islamica. Incoraggiamo la condivisione della conoscenza come forma di sadaqa jariyah (carità continua)."
    },
    english: {
      title: "Digital Library",
      subtitle: "Discover our collection of Islamic books, available for free reading and download",
      explanation: "Many fundamental Islamic texts have never been translated into Italian or require greater accuracy in translation. For this reason, we also offer a selection of books in English to ensure access to the most authentic and complete sources.",
      downloadBtn: "Download",
      readBtn: "Read",
      freeAccess: "Free Access to Knowledge",
      freeAccessDesc: "All books in our digital library are available for free for study and deepening of Islamic faith. We encourage the sharing of knowledge as a form of sadaqa jariyah (ongoing charity)."
    }
  };

  const content = languageContent[selectedLanguage];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          {content.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
          {content.subtitle}
        </p>
        <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {content.explanation}
        </p>
        <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-4">
          Vuoi prendere in prestito o comprare dei libri?{' '}
          <a 
            href="/acquista-o-prendi-in-prestito" 
            className="text-primary hover:text-primary/80 underline transition-colors"
          >
            clicca qui!
          </a>
        </p>
      </div>

      {/* Language Toggle */}
      <div className="mb-8 flex justify-center">
        <div className="flex items-center bg-muted/30 rounded-full p-1 backdrop-blur-sm">
          <button 
            onClick={() => setSelectedLanguage('italian')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedLanguage === 'italian' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Italiano
          </button>
          <button 
            onClick={() => setSelectedLanguage('english')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedLanguage === 'english' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            English
          </button>
        </div>
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
                onClick={() => setSelectedCategory(category)}
                variant={category === selectedCategory ? "default" : "outline"}
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
        {filteredBooks.map((book) => (
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
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
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
                      {content.downloadBtn}
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
                      {content.readBtn}
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
              {content.freeAccess}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {content.freeAccessDesc}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};