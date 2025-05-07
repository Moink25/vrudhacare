const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/productModel");

// Load environment variables
dotenv.config();

// Database connection string - use environment variable or default
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://yourusername:yourpassword@cluster0.mongodb.net/vrudhacare";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Helper function to transform image URLs to proper format
const prepareImageUrl = (url) => {
  return {
    public_id: url.split("/").pop().split("?")[0],
    url: url,
  };
};

// Product data
const products = [
  {
    name: "Hand-knitted Woolen Scarf",
    description:
      "Warm, soft scarf hand-knitted with love by our residents. Perfect for cold winter days and makes for a thoughtful gift.",
    price: 599,
    images: [
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1608369135302-928d47016b94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Clothing",
    stock: 25,
    maker: "Lakshmi Devi",
    story:
      "Lakshmi has been knitting for over 40 years. Each scarf takes her about a week to complete and she puts her heart into every stitch.",
    featured: true,
  },
  {
    name: "Handmade Ceramic Mug",
    description:
      "Beautiful, handcrafted ceramic mug perfect for your morning coffee or evening tea. Each piece is unique with its own character.",
    price: 399,
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1592811773541-8f1bfc8cbf1c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Home Decor",
    stock: 30,
    maker: "Raj Kumar",
    story:
      "Raj discovered his passion for pottery after retiring as a school teacher. Each mug is carefully shaped and glazed by his skillful hands.",
    featured: true,
  },
  {
    name: "Hand-painted Silk Scarf",
    description:
      "Elegant hand-painted silk scarf featuring beautiful floral motifs. Each scarf is a unique piece of wearable art.",
    price: 1299,
    images: [
      "https://images.unsplash.com/photo-1583846783214-7229a43e29a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Accessories",
    stock: 15,
    maker: "Meena Kumari",
    story:
      "Meena has been painting silks for decades, combining traditional Indian motifs with modern designs. Each scarf takes several days to complete.",
    featured: true,
  },
  {
    name: "Handwoven Cotton Table Runner",
    description:
      "Beautiful handwoven table runner made with natural cotton. Adds an elegant touch to any dining table or coffee table.",
    price: 799,
    images: [
      "https://images.unsplash.com/photo-1577968897966-3d4325b36b07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Home Decor",
    stock: 20,
    maker: "Suresh Patel",
    story:
      "Suresh comes from a family of weavers and continues the tradition at VrudhaCare, creating beautiful textiles using traditional techniques.",
  },
  {
    name: "Hand-embroidered Cushion Cover",
    description:
      "Intricately hand-embroidered cushion cover featuring traditional Indian designs. Made with 100% cotton fabric.",
    price: 699,
    images: [
      "https://images.unsplash.com/photo-1617325250152-a9a95267d29f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Home Decor",
    stock: 25,
    maker: "Anita Singh",
    story:
      "Anita learned embroidery from her grandmother and has been practicing this craft for over 50 years. Her detailed work showcases traditional Indian motifs.",
  },
  {
    name: "Handmade Paper Journal",
    description:
      "Beautiful journal with handmade paper pages and a hand-stitched binding. Perfect for journaling, sketching, or as a thoughtful gift.",
    price: 499,
    images: [
      "https://images.unsplash.com/photo-1589118949245-7d861fb0311e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Art & Craft",
    stock: 35,
    maker: "Mohan Das",
    story:
      "Mohan has been making handmade paper for over 30 years. Each journal is crafted with care and filled with paper that has unique textures and edges.",
    featured: true,
  },
  {
    name: "Hand-painted Wall Art",
    description:
      "Beautiful acrylic painting on canvas depicting Indian rural life. Each piece is signed by the artist.",
    price: 1999,
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Art & Craft",
    stock: 10,
    maker: "Ramesh Varma",
    story:
      "Ramesh discovered his passion for painting after retirement. His work reflects his childhood memories and the beauty of Indian village life.",
  },
  {
    name: "Handcrafted Wooden Pen Holder",
    description:
      "Elegantly designed wooden pen holder, hand-carved with intricate details. A perfect desk accessory or gift.",
    price: 699,
    images: [
      "https://images.unsplash.com/photo-1583330890066-fa4b3323b8df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Home Decor",
    stock: 15,
    maker: "Harish Sharma",
    story:
      "Harish was a carpenter for 40 years before coming to VrudhaCare. He continues to create beautiful wooden items that showcase his craftsmanship.",
  },
  {
    name: "Handmade Scented Candles (Set of 3)",
    description:
      "Set of three handmade soy wax candles in calming scents: lavender, sandalwood, and jasmine. Perfect for creating a relaxing atmosphere.",
    price: 849,
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Wellness",
    stock: 20,
    maker: "Geeta Mathur",
    story:
      "Geeta discovered candle making at VrudhaCare and enjoys experimenting with different scents and techniques.",
  },
  {
    name: "Hand-knitted Baby Booties",
    description:
      "Adorable hand-knitted baby booties made with soft, hypoallergenic yarn. Available in blue, pink, and yellow.",
    price: 349,
    images: [
      "https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Clothing",
    stock: 30,
    maker: "Kamla Devi",
    story:
      "Kamla loves knitting items for babies. As a grandmother of five, she puts her love and care into each pair of booties.",
  },
  {
    name: "Handcrafted Dreamcatcher",
    description:
      "Beautiful dreamcatcher handmade with natural materials, featuring colorful threads and feathers. Makes for a wonderful home decoration.",
    price: 599,
    images: [
      "https://images.unsplash.com/photo-1617711277880-fa603e524bab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Home Decor",
    stock: 15,
    maker: "Priya Mani",
    story:
      "Priya learned to make dreamcatchers from a Native American friend and combines this with Indian design elements in her creations.",
  },
  {
    name: "Handwoven Bamboo Basket",
    description:
      "Multi-purpose bamboo basket, handwoven using traditional techniques. Perfect for storage or as a decorative piece.",
    price: 699,
    images: [
      "https://images.unsplash.com/photo-1569091519615-1d608468fd8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Home Decor",
    stock: 20,
    maker: "Ramu Kaka",
    story:
      "Ramu has been weaving bamboo baskets since he was a teenager. His skillful hands create durable and beautiful baskets that last for years.",
  },
  {
    name: "Hand-carved Wooden Coasters (Set of 4)",
    description:
      "Set of four wooden coasters with intricate hand-carved designs. Each piece is unique and finished with natural wood oil.",
    price: 499,
    images: [
      "https://images.unsplash.com/photo-1605972954893-12b51a9f7409?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Home Decor",
    stock: 25,
    maker: "Krishna Murthy",
    story:
      "Krishna was a woodworker all his life and continues his craft at VrudhaCare. His attention to detail is evident in his beautifully carved creations.",
  },
  {
    name: "Hand-embroidered Handkerchief Set",
    description:
      "Set of three cotton handkerchiefs with delicate hand-embroidered flowers in one corner. Elegant and practical.",
    price: 349,
    images: [
      "https://images.unsplash.com/photo-1604707368449-a557bf10566d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Accessories",
    stock: 30,
    maker: "Sarla Ben",
    story:
      "Sarla has been embroidering since she was a young girl. Her fine needlework adds a touch of elegance to everyday items.",
  },
  {
    name: "Handmade Herbal Soap Set",
    description:
      "Set of three handmade natural soaps with herbs and essential oils: neem & tulsi, sandalwood, and rose. Gentle on skin and free from harsh chemicals.",
    price: 449,
    images: [
      "https://images.unsplash.com/photo-1607006344380-b6775a0824ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Wellness",
    stock: 35,
    maker: "Sunita Sharma",
    story:
      "Sunita learned traditional soap making from her mother and uses family recipes passed down through generations.",
  },
  {
    name: "Hand-painted Greeting Cards (Set of 5)",
    description:
      "Beautiful hand-painted greeting cards featuring floral designs. Blank inside for your personal message. Includes envelopes.",
    price: 299,
    images: [
      "https://images.unsplash.com/photo-1606722590334-820597227ca4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Art & Craft",
    stock: 40,
    maker: "Usha Rani",
    story:
      "Usha loves watercolor painting and creates these cards with care and attention to detail. Each card carries her positive energy and good wishes.",
  },
  {
    name: "Handwoven Jute Tote Bag",
    description:
      "Eco-friendly tote bag made from natural jute fiber. Durable, spacious, and perfect for shopping or everyday use.",
    price: 599,
    images: [
      "https://images.unsplash.com/photo-1544816185-2962419f2151?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Accessories",
    stock: 25,
    maker: "Govind Das",
    story:
      "Govind worked in a jute factory for 30 years. His expertise in working with jute is evident in the quality and durability of his bags.",
  },
  {
    name: "Hand-knitted Woolen Beanie",
    description:
      "Cozy, warm beanie hand-knitted with premium wool. Perfect for winter. Available in multiple colors.",
    price: 499,
    images: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Clothing",
    stock: 20,
    maker: "Kamala Devi",
    story:
      "Kamala has been knitting since childhood and can create a beanie in just one afternoon. Her work is known for its even stitches and comfort.",
  },
  {
    name: "Handmade Leather Journal",
    description:
      "Beautiful journal with handcrafted leather cover and handmade paper. Features a wrap-around tie closure. Perfect for writing, sketching, or as a gift.",
    price: 899,
    images: [
      "https://images.unsplash.com/photo-1562687641-1cf2bad1bec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Art & Craft",
    stock: 15,
    maker: "Ram Kishan",
    story:
      "Ram worked as a leather craftsman for over 40 years. His journals combine his leather work with handmade paper to create beautiful keepsakes.",
    featured: true,
  },
  {
    name: "Hand-painted Terracotta Planter",
    description:
      "Beautiful terracotta planter hand-painted with traditional designs. Perfect for small indoor plants.",
    price: 499,
    images: [
      "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    ].map(prepareImageUrl),
    category: "Home Decor",
    stock: 20,
    maker: "Savitri Devi",
    story:
      "Savitri combines her love for pottery and painting in these planters. Each piece reflects her artistic vision and careful craftsmanship.",
  },
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // First delete all existing products
    await Product.deleteMany({});
    console.log("Deleted all existing products");

    // Insert new products
    const createdProducts = await Product.insertMany(products);
    console.log(`Successfully seeded ${createdProducts.length} products`);

    // Exit process
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
