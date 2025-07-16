import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingCart, BookOpen, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StarBorder from "@/components/StarBorder";

// Libri disponibili (mock data)
const availableBooks = [
  {
    id: 1,
    title: "Il Sacro Corano",
    author: "Traduzione italiana",
    price: "€25.00",
    available: true,
    image: "/lovable-uploads/9cc6428e-f19a-4bb8-9610-10df6a646b7d.png"
  },
  {
    id: 2,
    title: "Sahih al-Bukhari",
    author: "Imam al-Bukhari",
    price: "€35.00",
    available: true,
    image: "/placeholder-book-2.jpg"
  },
  {
    id: 3,
    title: "I Fondamenti della Fede",
    author: "Guida all'Aqeedah",
    price: "€20.00",
    available: false,
    image: "/placeholder-book-3.jpg"
  },
  {
    id: 4,
    title: "The Sealed Nectar",
    author: "Safi-ur-Rahman al-Mubarakpuri",
    price: "€28.00",
    available: true,
    image: "/placeholder-book-5.jpg"
  },
  {
    id: 5,
    title: "Riyad as-Salihin",
    author: "Imam an-Nawawi",
    price: "€22.00",
    available: true,
    image: "/placeholder-book-6.jpg"
  }
];

export const AcquistaOPrendiInPrestito = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    requestType: "", // "purchase" or "borrow"
    selectedBook: "",
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.requestType || !formData.selectedBook) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://primary-production-a9d2d.up.railway.app/webhook-test/85f3d8ef-36c7-4519-a3fe-d8c70d921400", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          requestType: formData.requestType,
          selectedBook: formData.selectedBook,
          notes: formData.notes,
          timestamp: new Date().toISOString(),
          source: "website_book_request"
        }),
      });

      toast({
        title: "Richiesta inviata!",
        description: "La tua richiesta è stata inviata con successo. Ti contatteremo presto per i dettagli.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        requestType: "",
        selectedBook: "",
        notes: ""
      });

    } catch (error) {
      console.error("Error sending request:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'invio della richiesta. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBookData = availableBooks.find(book => book.id.toString() === formData.selectedBook);

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Acquista o Prendi in Prestito
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Scegli i libri che desideri acquistare o prendere in prestito dalla nostra collezione
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Available Books */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Libri Disponibili
          </h2>
          <div className="space-y-4">
            {availableBooks.map((book) => (
              <StarBorder
                key={book.id}
                as="div"
                color="hsl(var(--accent))"
                speed="6s"
                thickness={2}
                className="w-full"
              >
                <Card className={`transition-all duration-300 bg-transparent border-0 ${
                  !book.available ? 'opacity-50' : 'hover:shadow-md'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded flex-shrink-0 overflow-hidden">
                        <img 
                          src={book.image} 
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{book.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">{book.price}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            book.available 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {book.available ? 'Disponibile' : 'Non disponibile'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StarBorder>
            ))}
          </div>
        </div>

        {/* Request Form */}
        <div>
          <StarBorder
            as="div"
            color="hsl(var(--primary))"
            speed="5s"
            thickness={3}
            className="w-full"
          >
            <Card className="bg-transparent border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Richiesta Libro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome e Cognome *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Il tuo nome completo"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="tua@email.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+39 123 456 7890"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Indirizzo</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Via, città, CAP"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Request Type */}
                  <div>
                    <Label>Tipo di richiesta *</Label>
                    <RadioGroup
                      value={formData.requestType}
                      onValueChange={(value) => handleInputChange("requestType", value)}
                      className="mt-2 flex flex-row gap-6 justify-center"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="purchase" id="purchase" />
                        <Label htmlFor="purchase" className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          Acquisto
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="borrow" id="borrow" />
                        <Label htmlFor="borrow" className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Prestito
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Book Selection */}
                  <div>
                    <Label htmlFor="book">Libro richiesto *</Label>
                    <Select 
                      value={formData.selectedBook} 
                      onValueChange={(value) => handleInputChange("selectedBook", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona un libro" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBooks
                          .filter(book => book.available)
                          .map((book) => (
                            <SelectItem key={book.id} value={book.id.toString()}>
                              {book.title} - {book.price}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Book Preview */}
                  {selectedBookData && (
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Libro selezionato:</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded overflow-hidden">
                          <img 
                            src={selectedBookData.image} 
                            alt={selectedBookData.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{selectedBookData.title}</p>
                          <p className="text-sm text-muted-foreground">{selectedBookData.author}</p>
                          <p className="text-sm font-semibold text-primary">{selectedBookData.price}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes">Note aggiuntive</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Eventuali richieste particolari o note..."
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <StarBorder
                    as="div"
                    color="hsl(var(--primary))"
                    speed="3s"
                    thickness={2}
                    className="w-full"
                  >
                    <Button 
                      type="submit" 
                      className="w-full gap-2 bg-transparent border-0 hover:bg-transparent text-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      <Send className="h-4 w-4" />
                      {isLoading ? "Invio in corso..." : "Invia Richiesta"}
                    </Button>
                  </StarBorder>
                </form>
              </CardContent>
            </Card>
          </StarBorder>
        </div>
      </div>
    </div>
  );
};