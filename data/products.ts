export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  images: string[];
  category: string;
  tags: string[];
  colors: {
    name: string;
    hex: string;
  }[];
  sizes?: string[];
  rating: number;
  reviews: number;
  stock: number;
  sku: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  relatedProducts?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productsCount: number;
}

export const categories: Category[] = [
  {
    id: '1',
    name: "Watches",
    slug: "watches",
    description: "Elegant timepieces for every occasion",
    image: "/images/category-watches.jpg",
    productsCount: 12
  },
  {
    id: '2',
    name: "Bags",
    slug: "bags",
    description: "Stylish bags for everyday use",
    image: "/images/category-bags.jpg",
    productsCount: 8
  },
  {
    id: '3',
    name: "Accessories",
    slug: "accessories",
    description: "Complete your look with our premium accessories",
    image: "/images/category-accessories.jpg",
    productsCount: 15
  },
  {
    id: '4',
    name: "Jewelry",
    slug: "jewelry",
    description: "Timeless pieces to cherish forever",
    image: "/images/category-jewelry.jpg",
    productsCount: 10
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: "Minimalist Watch",
    price: 149.99,
    originalPrice: 199.99,
    description: "A sleek minimalist watch with a clean dial and premium leather strap. Perfect for everyday wear and special occasions.",
    features: [
      "Swiss movement",
      "Sapphire crystal glass",
      "Genuine leather strap",
      "Water resistant to 50m",
      "2-year warranty"
    ],
    images: [
      "/images/product-1.jpg",
      "/images/product-1-2.jpg",
      "/images/product-1-3.jpg"
    ],
    category: "Watches",
    tags: ["watch", "minimalist", "leather", "premium"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Brown", hex: "#964B00" },
      { name: "Navy", hex: "#000080" }
    ],
    rating: 4.8,
    reviews: 124,
    stock: 15,
    sku: "MW-BL-001",
    isNew: true,
    isFeatured: true,
    relatedProducts: ['2', '5', '8']
  },
  {
    id: '2',
    name: "Designer Handbag",
    price: 299.99,
    description: "A luxurious designer handbag crafted from premium materials. Spacious interior with multiple compartments.",
    features: [
      "Premium Italian leather",
      "Gold-plated hardware",
      "Multiple interior compartments",
      "Adjustable shoulder strap",
      "Dust bag included"
    ],
    images: [
      "/images/product-2.jpg",
      "/images/product-2-2.jpg",
      "/images/product-2-3.jpg"
    ],
    category: "Bags",
    tags: ["bag", "designer", "leather", "luxury"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Tan", hex: "#D2B48C" },
      { name: "Red", hex: "#FF0000" }
    ],
    rating: 4.9,
    reviews: 86,
    stock: 8,
    sku: "DH-BL-002",
    isFeatured: true,
    relatedProducts: ['6', '9', '12']
  },
  {
    id: '3',
    name: "Premium Sunglasses",
    price: 129.99,
    originalPrice: 159.99,
    description: "High-quality sunglasses with polarized lenses and durable frames. Provides 100% UV protection.",
    features: [
      "Polarized lenses",
      "100% UV protection",
      "Lightweight frame",
      "Anti-scratch coating",
      "Includes protective case"
    ],
    images: [
      "/images/product-3.jpg",
      "/images/product-3-2.jpg",
      "/images/product-3-3.jpg"
    ],
    category: "Accessories",
    tags: ["sunglasses", "polarized", "summer", "UV protection"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Tortoise", hex: "#8B4513" }
    ],
    rating: 4.7,
    reviews: 52,
    stock: 20,
    sku: "PS-BL-003",
    isOnSale: true,
    relatedProducts: ['7', '10', '14']
  },
  {
    id: '4',
    name: "Leather Wallet",
    price: 89.99,
    description: "A slim leather wallet with RFID blocking technology. Features multiple card slots and a bill compartment.",
    features: [
      "Genuine leather",
      "RFID blocking technology",
      "Multiple card slots",
      "Bill compartment",
      "Slim profile"
    ],
    images: [
      "/images/product-4.jpg",
      "/images/product-4-2.jpg",
      "/images/product-4-3.jpg"
    ],
    category: "Accessories",
    tags: ["wallet", "leather", "RFID", "slim"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Brown", hex: "#964B00" }
    ],
    rating: 4.6,
    reviews: 78,
    stock: 25,
    sku: "LW-BL-004",
    isFeatured: true,
    relatedProducts: ['1', '5', '11']
  },
  {
    id: '5',
    name: "Chronograph Watch",
    price: 249.99,
    description: "A sophisticated chronograph watch with multiple subdials and a stainless steel bracelet.",
    features: [
      "Chronograph function",
      "Stainless steel case and bracelet",
      "Date display",
      "Luminous hands",
      "Water resistant to 100m"
    ],
    images: [
      "/images/product-5.jpg",
      "/images/product-5-2.jpg",
      "/images/product-5-3.jpg"
    ],
    category: "Watches",
    tags: ["watch", "chronograph", "stainless steel", "premium"],
    colors: [
      { name: "Silver", hex: "#C0C0C0" },
      { name: "Gold", hex: "#FFD700" },
      { name: "Rose Gold", hex: "#B76E79" }
    ],
    rating: 4.9,
    reviews: 42,
    stock: 10,
    sku: "CW-SS-005",
    isNew: true,
    relatedProducts: ['1', '8', '13']
  },
  {
    id: '6',
    name: "Crossbody Bag",
    price: 179.99,
    originalPrice: 219.99,
    description: "A versatile crossbody bag perfect for everyday use. Features adjustable strap and secure closure.",
    features: [
      "Premium vegan leather",
      "Adjustable strap",
      "Multiple compartments",
      "Secure zipper closure",
      "Interior pockets"
    ],
    images: [
      "/images/product-6.jpg",
      "/images/product-6-2.jpg",
      "/images/product-6-3.jpg"
    ],
    category: "Bags",
    tags: ["bag", "crossbody", "vegan", "everyday"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Beige", hex: "#F5F5DC" },
      { name: "Green", hex: "#008000" }
    ],
    rating: 4.7,
    reviews: 63,
    stock: 12,
    sku: "CB-BL-006",
    isOnSale: true,
    relatedProducts: ['2', '9', '12']
  },
  {
    id: '7',
    name: "Silver Bracelet",
    price: 79.99,
    description: "An elegant silver bracelet with a minimalist design. Perfect for everyday wear or special occasions.",
    features: [
      "925 Sterling silver",
      "Adjustable size",
      "Hypoallergenic",
      "Tarnish resistant",
      "Gift box included"
    ],
    images: [
      "/images/product-7.jpg",
      "/images/product-7-2.jpg",
      "/images/product-7-3.jpg"
    ],
    category: "Jewelry",
    tags: ["bracelet", "silver", "minimalist", "elegant"],
    colors: [
      { name: "Silver", hex: "#C0C0C0" }
    ],
    rating: 4.8,
    reviews: 37,
    stock: 18,
    sku: "SB-SL-007",
    isFeatured: true,
    relatedProducts: ['10', '14', '15']
  },
  {
    id: '8',
    name: "Smart Watch",
    price: 299.99,
    description: "A feature-packed smart watch with health monitoring, notifications, and customizable watch faces.",
    features: [
      "Health monitoring",
      "Notification alerts",
      "Customizable watch faces",
      "Water resistant",
      "5-day battery life"
    ],
    images: [
      "/images/product-8.jpg",
      "/images/product-8-2.jpg",
      "/images/product-8-3.jpg"
    ],
    category: "Watches",
    tags: ["watch", "smart", "tech", "fitness"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Blue", hex: "#0000FF" }
    ],
    rating: 4.6,
    reviews: 94,
    stock: 7,
    sku: "SW-BL-008",
    isNew: true,
    relatedProducts: ['1', '5', '13']
  }
];

export const collections = [
  {
    id: '1',
    name: "Summer Collection",
    image: "/images/collection-1.jpg",
    description: "Vibrant styles for the warmer days",
    productIds: ['3', '6', '8']
  },
  {
    id: '2',
    name: "Essentials",
    image: "/images/collection-2.jpg",
    description: "Timeless pieces for every wardrobe",
    productIds: ['1', '4', '7']
  },
  {
    id: '3',
    name: "Limited Edition",
    image: "/images/collection-3.jpg",
    description: "Exclusive designs in limited quantities",
    productIds: ['2', '5']
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getRelatedProducts(productId: string): Product[] {
  const product = getProductById(productId);
  if (!product || !product.relatedProducts) return [];
  
  return product.relatedProducts.map(id => getProductById(id)).filter(Boolean) as Product[];
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.isFeatured);
}

export function getNewProducts(): Product[] {
  return products.filter(product => product.isNew);
}

export function getOnSaleProducts(): Product[] {
  return products.filter(product => product.isOnSale);
}

export function searchProducts(query: string): Product[] {
  const searchTerm = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}
