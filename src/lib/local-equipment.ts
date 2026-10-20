export type LocalEquipment = {
  id: number;
  name: string;
  type: string;
  owner: string;
  location: string;
  availability: "Available" | "Booked";
  next_available: string;
  price: string;
  original_price?: string;
  discount?: string;
  offer: string;
  rating: number;
  reviews: number;
  sponsored?: boolean;
  features: string[];
  image_url: string;
};

// Static equipment list rendered directly in the UI (no Supabase / backend required)
export const localEquipment: LocalEquipment[] = [
  {
    id: 1,
    name: "Mahindra 575 DI Tractor",
    type: "Tractor",
    owner: "Senthil Kumar",
    location: "Thanjavur, Tamil Nadu",
    availability: "Available",
    next_available: "Today",
    price: "₹2,500",
    original_price: "₹3,200",
    discount: "22% off",
    offer: "Big Billion Days Price",
    rating: 4.7,
    reviews: 248,
    sponsored: true,
    features: ["55 HP, 2100 RPM", "Power steering", "Suitable for ploughing & hauling"],
    image_url: "/img/tractor.jpg",
  },
  {
    id: 2,
    name: "John Deere 530 Harvester",
    type: "Harvester",
    owner: "Ravi Agricultural Services",
    location: "Erode, Tamil Nadu",
    availability: "Available",
    next_available: "Tomorrow",
    price: "₹5,800",
    original_price: "₹6,500",
    discount: "11% off",
    offer: "Bestseller",
    rating: 4.8,
    reviews: 180,
    sponsored: false,
    features: ["Multi‑crop harvester", "Low fuel consumption"],
    image_url: "/img/harvester.jpg",
  },
  {
    id: 3,
    name: "9‑Tine Heavy Duty Cultivator",
    type: "Cultivator",
    owner: "Velu Farm Tools",
    location: "Salem, Tamil Nadu",
    availability: "Available",
    next_available: "This Week",
    price: "₹900",
    original_price: "₹1,200",
    discount: "25% off",
    offer: "Limited Time Offer",
    rating: 4.5,
    reviews: 95,
    sponsored: false,
    features: ["9 tines heavy duty", "Ideal for seedbed preparation"],
    image_url: "/img/cultivator.jpg",
  },
  {
    id: 4,
    name: "Power Sprayer 16L",
    type: "Sprayer",
    owner: "Green Fields Co‑op",
    location: "Coimbatore, Tamil Nadu",
    availability: "Available",
    next_available: "Today",
    price: "₹350",
    original_price: "₹450",
    discount: "18% off",
    offer: "Farmer Favourite",
    rating: 4.4,
    reviews: 60,
    sponsored: false,
    features: ["16L tank", "Suitable for pesticides & nutrients"],
    image_url: "/img/sprayer.jpg",
  },
];


