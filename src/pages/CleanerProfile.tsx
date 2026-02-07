import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Star,
  MapPin,
  Shield,
  Clock,
  Heart,
  Share2,
  CheckCircle,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  ChevronLeft,
  MessageSquare,
  ThumbsUp,
  Award,
  Leaf,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Mock cleaner data
const mockCleanerData = {
  id: 1,
  name: "SparklePro Cleaning",
  tagline: "Professional cleaning with a personal touch",
  image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=400&fit=crop",
  rating: 4.9,
  reviewCount: 127,
  location: "Toronto, ON",
  address: "Serving Toronto & GTA",
  verified: true,
  featured: true,
  instantBooking: true,
  responseTime: "Usually responds within 1 hour",
  memberSince: "January 2022",
  completedJobs: 342,
  repeatClients: "89%",
  description: `SparklePro Cleaning is a professional cleaning service dedicated to making your home or office spotless. With over 5 years of experience, we pride ourselves on attention to detail, reliability, and eco-friendly practices.

Our team of trained professionals uses only the highest quality, environmentally safe products to ensure a clean that's safe for your family, pets, and the planet.

We offer flexible scheduling, competitive pricing, and a 100% satisfaction guarantee. If you're not happy with our service, we'll come back and make it right - no questions asked.`,
  services: [
    { name: "Standard Home Cleaning", price: 85, duration: "2-3 hours", description: "Complete cleaning of all rooms, kitchen, and bathrooms" },
    { name: "Deep Cleaning", price: 150, duration: "4-5 hours", description: "Thorough cleaning including inside appliances, baseboards, and hard-to-reach areas" },
    { name: "Move In/Out Cleaning", price: 200, duration: "5-6 hours", description: "Comprehensive cleaning for moving, including closets and cabinets" },
    { name: "Airbnb/Rental Turnover", price: 95, duration: "2-3 hours", description: "Quick turnaround cleaning between guests" },
    { name: "Office Cleaning", price: 120, duration: "2-4 hours", description: "Professional office and commercial space cleaning" },
    { name: "Post-Construction", price: 250, duration: "6-8 hours", description: "Heavy-duty cleaning after renovation or construction" },
  ],
  addOns: [
    { name: "Inside Fridge", price: 25 },
    { name: "Inside Oven", price: 25 },
    { name: "Interior Windows", price: 35 },
    { name: "Laundry (wash & fold)", price: 20 },
    { name: "Organize Closet", price: 40 },
  ],
  gallery: [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=300&fit=crop",
  ],
  badges: [
    { icon: Shield, label: "Verified Pro", color: "text-secondary" },
    { icon: Award, label: "Top Rated", color: "text-accent" },
    { icon: Leaf, label: "Eco-Friendly", color: "text-secondary" },
  ],
  availability: {
    monday: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
    tuesday: ["9:00 AM", "11:00 AM", "2:00 PM"],
    wednesday: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
    thursday: ["9:00 AM", "2:00 PM", "4:00 PM"],
    friday: ["9:00 AM", "11:00 AM", "2:00 PM"],
    saturday: ["10:00 AM", "1:00 PM"],
    sunday: [],
  },
  reviews: [
    {
      id: 1,
      author: "Sarah M.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      rating: 5,
      date: "2 weeks ago",
      service: "Deep Cleaning",
      comment: "Absolutely fantastic service! The team was professional, thorough, and left my home sparkling clean. They even cleaned areas I didn't expect. Highly recommend!",
      helpful: 12,
    },
    {
      id: 2,
      author: "Michael T.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      rating: 5,
      date: "1 month ago",
      service: "Standard Home Cleaning",
      comment: "Been using SparklePro for 6 months now on a bi-weekly basis. Consistently excellent service. They're always on time and do a great job.",
      helpful: 8,
    },
    {
      id: 3,
      author: "Jennifer L.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      rating: 4,
      date: "1 month ago",
      service: "Move In/Out Cleaning",
      comment: "Great job on our move-out cleaning. The apartment looked better than when we moved in! Only reason for 4 stars is they arrived 30 minutes late, but they communicated the delay.",
      helpful: 5,
    },
    {
      id: 4,
      author: "David K.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      rating: 5,
      date: "2 months ago",
      service: "Airbnb/Rental Turnover",
      comment: "Perfect for my Airbnb property. Quick turnaround, great attention to detail, and my guests always comment on how clean the place is. Worth every penny!",
      helpful: 15,
    },
  ],
};

const CleanerProfile = () => {
  const { id } = useParams();
  const cleaner = mockCleanerData; // In real app, fetch by id

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);

  const getDayOfWeek = (date: Date): keyof typeof cleaner.availability => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return days[date.getDay()] as keyof typeof cleaner.availability;
  };

  const availableSlots = selectedDate 
    ? cleaner.availability[getDayOfWeek(selectedDate)] 
    : [];

  const selectedServiceData = cleaner.services.find(s => s.name === selectedService);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Cover Image */}
      <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
        <img
          src={cleaner.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        {/* Back Button */}
        <Link
          to="/search"
          className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-card/80 backdrop-blur-sm rounded-lg text-sm font-medium hover:bg-card transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Search
        </Link>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <Card className="overflow-visible">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar */}
                  <div className="relative -mt-20 md:-mt-16">
                    <img
                      src={cleaner.image}
                      alt={cleaner.name}
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-card shadow-lg"
                    />
                    {cleaner.verified && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-secondary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                          {cleaner.name}
                        </h1>
                        <p className="text-muted-foreground">{cleaner.tagline}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {cleaner.address}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setIsFavorited(!isFavorited)}
                        >
                          <Heart
                            className={cn(
                              "h-4 w-4",
                              isFavorited && "fill-destructive text-destructive"
                            )}
                          />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-accent text-accent" />
                        <span className="font-semibold">{cleaner.rating}</span>
                        <span className="text-muted-foreground">({cleaner.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {cleaner.responseTime}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {cleaner.badges.map((badge) => (
                        <Badge key={badge.label} variant="secondary" className="gap-1">
                          <badge.icon className={cn("h-3 w-3", badge.color)} />
                          {badge.label}
                        </Badge>
                      ))}
                      {cleaner.instantBooking && (
                        <Badge variant="default" className="gap-1 bg-primary">
                          <CheckCircle className="h-3 w-3" />
                          Instant Booking
                        </Badge>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
                      <div className="text-center">
                        <div className="font-heading text-xl font-bold text-foreground">
                          {cleaner.completedJobs}
                        </div>
                        <div className="text-xs text-muted-foreground">Jobs Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="font-heading text-xl font-bold text-foreground">
                          {cleaner.repeatClients}
                        </div>
                        <div className="text-xs text-muted-foreground">Repeat Clients</div>
                      </div>
                      <div className="text-center">
                        <div className="font-heading text-xl font-bold text-foreground">
                          {cleaner.memberSince.split(" ")[1]}
                        </div>
                        <div className="text-xs text-muted-foreground">Member Since</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start bg-card border border-border h-auto p-1 flex-wrap">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services & Pricing</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({cleaner.reviewCount})</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {cleaner.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {cleaner.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Services</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cleaner.services.map((service) => (
                      <div
                        key={service.name}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {service.duration}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 md:mt-0">
                          <span className="font-heading text-xl font-bold text-primary">
                            ${service.price}
                          </span>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedService(service.name)}
                          >
                            Select
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Add-Ons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {cleaner.addOns.map((addon) => (
                        <div
                          key={addon.name}
                          className="flex items-center justify-between p-3 rounded-lg border border-border"
                        >
                          <span className="text-foreground">{addon.name}</span>
                          <span className="font-semibold text-primary">+${addon.price}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Gallery Tab */}
              <TabsContent value="gallery" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Work Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {cleaner.gallery.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full aspect-[4/3] object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6 space-y-6">
                {/* Rating Summary */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="text-center">
                        <div className="font-heading text-5xl font-bold text-foreground">
                          {cleaner.rating}
                        </div>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-5 w-5",
                                star <= Math.round(cleaner.rating)
                                  ? "fill-accent text-accent"
                                  : "text-muted"
                              )}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {cleaner.reviewCount} reviews
                        </div>
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const count = cleaner.reviewCount * (stars === 5 ? 0.7 : stars === 4 ? 0.2 : 0.1 / 3);
                          const percentage = (count / cleaner.reviewCount) * 100;
                          return (
                            <div key={stars} className="flex items-center gap-2">
                              <span className="text-sm w-3">{stars}</span>
                              <Star className="h-3 w-3 fill-accent text-accent" />
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-accent rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-12">
                                {Math.round(percentage)}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {cleaner.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <img
                            src={review.avatar}
                            alt={review.author}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <h4 className="font-semibold text-foreground">{review.author}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>{review.date}</span>
                                  <span>•</span>
                                  <Badge variant="outline" className="text-xs">
                                    {review.service}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={cn(
                                      "h-4 w-4",
                                      star <= review.rating
                                        ? "fill-accent text-accent"
                                        : "text-muted"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="mt-3 text-muted-foreground">{review.comment}</p>
                            <button className="flex items-center gap-1 mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                              <ThumbsUp className="h-4 w-4" />
                              Helpful ({review.helpful})
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <Button variant="outline">Load More Reviews</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Booking Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Book This Cleaner</span>
                    {cleaner.instantBooking && (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Instant
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Service Selection */}
                  <div className="space-y-2">
                    <Label>Select Service</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {cleaner.services.map((service) => (
                          <SelectItem key={service.name} value={service.name}>
                            {service.name} - ${service.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Picker */}
                  <div className="space-y-2">
                    <Label>Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setSelectedTime("");
                          }}
                          disabled={(date) => date < new Date() || date.getDay() === 0}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div className="space-y-2">
                      <Label>Select Time</Label>
                      {availableSlots.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {availableSlots.map((slot) => (
                            <Button
                              key={slot}
                              variant={selectedTime === slot ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedTime(slot)}
                              className="w-full"
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground py-2">
                          No availability on this day. Please select another date.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Address */}
                  <div className="space-y-2">
                    <Label>Your Address</Label>
                    <Input placeholder="Enter your address" />
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-2">
                    <Label>Special Instructions (Optional)</Label>
                    <Textarea
                      placeholder="Any specific areas to focus on or access instructions..."
                      rows={3}
                    />
                  </div>

                  {/* Price Summary */}
                  {selectedServiceData && (
                    <div className="pt-4 border-t border-border space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{selectedServiceData.name}</span>
                        <span>${selectedServiceData.price}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary">${selectedServiceData.price}</span>
                      </div>
                    </div>
                  )}

                  {/* Book Button */}
                  <Button
                    className="w-full"
                    size="lg"
                    variant="cta"
                    disabled={!selectedService || !selectedDate || !selectedTime}
                  >
                    {cleaner.instantBooking ? "Book Now" : "Request Booking"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Free cancellation up to 24 hours before the appointment
                  </p>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Phone className="h-4 w-4" />
                    Request Call
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CleanerProfile;
