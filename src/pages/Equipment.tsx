import { useState, useEffect, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Truck, 
  Tractor, 
  Wrench,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  Star,
  ShoppingCart,
  RefreshCw,
  Leaf,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import AddEquipmentForm from "@/components/AddEquipmentForm";
import CarbonFootprintCalculator from "@/components/CarbonFootprintCalculator";
import { localEquipment } from "@/lib/local-equipment";

// Equipment data is now fetched from Supabase

export default function Equipment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [showCarbonCalculator, setShowCarbonCalculator] = useState(false);
  const [selectedEquipmentForCarbon, setSelectedEquipmentForCarbon] = useState<any>(null);
  const [userAddedEquipment, setUserAddedEquipment] = useState<any[]>([]);
  const [equipmentState, setEquipmentState] = useState<any[]>(localEquipment);
  const { addToCart, getCartItemCount, getCartTotal } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load user-added equipment from localStorage on component mount
  useEffect(() => {
    const savedEquipment = localStorage.getItem('userAddedEquipment');
    if (savedEquipment) {
      try {
        setUserAddedEquipment(JSON.parse(savedEquipment));
      } catch (error) {
        console.error('Error parsing saved equipment:', error);
      }
    }
  }, []);

  // Save user-added equipment to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userAddedEquipment', JSON.stringify(userAddedEquipment));
  }, [userAddedEquipment]);

  // Combine backend equipment with user-added equipment
  const allEquipment = [...equipmentState, ...userAddedEquipment];
  
  // Apply simple search on local data
  const equipmentData = allEquipment.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.type?.toLowerCase().includes(term) ||
      item.location?.toLowerCase().includes(term)
    );
  });

  const filteredEquipment = equipmentData.filter(item => {
    const matchesFilter = filter === "all" || 
                         (filter === "available" && item.availability === "Available") ||
                         (filter === "booked" && item.availability === "Booked");
    
    return matchesFilter;
  });

  const handleBooking = (equipmentId: number, equipmentName: string) => {
    // Local‑only booking: just update UI state
    setEquipmentState(prev =>
      prev.map(item =>
        item.id === equipmentId ? { ...item, availability: "Booked" } : item
      )
    );
    toast({
      title: "Booking Confirmed",
      description: `${equipmentName} has been marked as booked (local only).`,
    });
  };

  // Add equipment to cart
  const handleAddToCart = (equipment: any) => {
    // Convert price string to number (remove ₹ and commas)
    const priceString = equipment.price || '₹0';
    const priceNumber = parseInt(priceString.replace(/[₹,]/g, '')) || 0;
    
    addToCart({
      id: equipment.id,
      name: equipment.name,
      equipmentType: equipment.type,
      pricePerDay: priceNumber,
      quantity: 1,
      category: 'equipment',
      type: 'equipment'
    });
    
    toast({
      title: "Added to Cart",
      description: `${equipment.name} added to cart`,
    });
  };

  // Refresh equipment data
  const handleRefresh = async () => {
    // Reset to initial local equipment list and reload any user‑added items
    setEquipmentState(localEquipment);
    const savedEquipment = localStorage.getItem("userAddedEquipment");
    if (savedEquipment) {
      try {
        setUserAddedEquipment(JSON.parse(savedEquipment));
      } catch {
        setUserAddedEquipment([]);
      }
    }
    toast({
      title: "Data Refreshed",
      description: "Showing local equipment list.",
    });
  };

  // Handle add equipment success
  const handleAddEquipmentSuccess = (newEquipment: any) => {
    // Generate a unique ID for the new equipment
    const equipmentWithId = {
      ...newEquipment,
      id: Date.now() + Math.random(), // Simple unique ID
    };
    
    // Add to local state instead of backend
    setUserAddedEquipment(prev => [...prev, equipmentWithId]);
    
    toast({
      title: "Equipment Added",
      description: "Your equipment has been added successfully",
    });
  };

  // Handle carbon calculator button click
  const handleCarbonCalculator = (equipment: any) => {
    setSelectedEquipmentForCarbon(equipment);
    setShowCarbonCalculator(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 mobile-scroll">
      {/* Header */}
      <div className="bg-gradient-primary rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-glow mobile-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Equipment Sharing</h1>
            <p className="text-sm sm:text-base lg:text-lg opacity-90">
              Access tractors, harvesters, and farming tools from your community
            </p>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm mobile-touch-feedback flex-1 sm:flex-none"
              onClick={() => setShowAddEquipment(true)}
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="text-sm sm:text-base">Add Equipment</span>
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm mobile-touch-feedback flex-1 sm:flex-none"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="text-sm sm:text-base">Refresh</span>
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm mobile-touch-feedback flex-1 sm:flex-none"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="text-sm sm:text-base">Cart</span>
              {getCartItemCount() > 0 && (
                <Badge className="ml-2 bg-orange-500 text-white text-xs">
                  {getCartItemCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-card mobile-card">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search equipment, location, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 mobile-touch-feedback"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filter === "available" ? "default" : "outline"}
                onClick={() => setFilter("available")}
                size="sm"
              >
                Available
              </Button>
              <Button
                variant={filter === "booked" ? "default" : "outline"}
                onClick={() => setFilter("booked")}
                size="sm"
              >
                Booked
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredEquipment.map((item, index) => (
          <Card 
            key={item.id} 
            className="hover:shadow-lg transition-all duration-300 group cursor-pointer border-0 shadow-md mobile-card mobile-touch-feedback"
            style={{ animationDelay: `${index * 100}ms` } as CSSProperties}
          >
            {/* Product Image */}
            <div className="relative">
              <img 
                src={item.image_url || '/placeholder.svg'} 
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {item.sponsored && (
                <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                  Sponsored
                </div>
              )}
              {userAddedEquipment.some(userItem => userItem.id === item.id) && (
                <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                  Your Equipment
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge 
                  variant={item.availability === "Available" ? "default" : "secondary"}
                  className={`text-xs ${
                    item.availability === "Available" 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {item.availability}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              {/* Product Name */}
              <div>
                <h3 className="font-medium text-sm text-gray-900 line-clamp-2 leading-tight">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{item.owner}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium text-gray-700">
                  {item.rating}★ ({item.reviews.toLocaleString()})
                </span>
                {item.offer === "Assured" && (
                  <Badge variant="outline" className="text-xs px-1 py-0 ml-2 border-blue-500 text-blue-600">
                    Assured
                  </Badge>
                )}
              </div>

              {/* Pricing */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {item.price?.startsWith('₹') ? item.price : `₹${item.price}`}
                  </span>
                  {item.original_price && (
                    <span className="text-sm text-gray-500 line-through">
                      {item.original_price?.startsWith('₹') ? item.original_price : `₹${item.original_price}`}
                    </span>
                  )}
                  {item.discount && (
                  <span className="text-xs font-medium text-green-600">{item.discount}</span>
                  )}
                </div>
              </div>

              {/* Offer Tag */}
              <div className="flex justify-between items-center">
                <Badge 
                  variant="outline" 
                  className={`text-xs px-2 py-1 ${
                    item.offer === "Big Billion Days Price" 
                      ? "border-purple-500 text-purple-600 bg-purple-50"
                      : item.offer === "Bestseller"
                      ? "border-green-500 text-green-600 bg-green-50"
                      : "border-blue-500 text-blue-600 bg-blue-50"
                  }`}
                >
                  {item.offer}
                </Badge>
              </div>

              {/* Location and Availability */}
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {item.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Next available: {item.next_available}
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-1">
                {item.features.slice(0, 2).map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs px-2 py-1">
                    {feature}
                  </Badge>
                ))}
                {item.features.length > 2 && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    +{item.features.length - 2} more
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <Button 
                  onClick={() => handleBooking(item.id, item.name)}
                  disabled={
                    item.availability === "Booked" ||
                    userAddedEquipment.some(userItem => userItem.id === item.id)
                  }
                  className={`w-full text-sm py-2 ${
                    userAddedEquipment.some(userItem => userItem.id === item.id)
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : item.availability === "Available" 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {userAddedEquipment.some(userItem => userItem.id === item.id) ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Your Equipment
                    </>
                  ) : item.availability === "Available" ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Book Now
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Booked
                    </>
                  )}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    variant="outline"
                    className="text-xs py-2 border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Cart
                  </Button>
                  <Button
                    onClick={() => handleCarbonCalculator(item)}
                    variant="outline"
                    className="text-xs py-2 border-blue-600 text-blue-600 hover:bg-blue-50 mobile-touch-feedback"
                  >
                    <Leaf className="h-3 w-3 mr-1" />
                    Carbon
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No equipment found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add Equipment Modal */}
      {showAddEquipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <AddEquipmentForm 
              onClose={() => setShowAddEquipment(false)}
              onSuccess={(equipment) => handleAddEquipmentSuccess(equipment)}
            />
          </div>
        </div>
      )}

      {showCarbonCalculator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CarbonFootprintCalculator 
              equipment={selectedEquipmentForCarbon}
              onClose={() => setShowCarbonCalculator(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}