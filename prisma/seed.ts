import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Boribuz3254.2025', 10);
  
  // Create admin user in the User table (for unified auth)
  await prisma.user.upsert({
    where: { email: 'admin@boribuz.ca' },
    update: {},
    create: {
      email: 'admin@boribuz.ca',
      password,
      name: 'Admin User',
      emailVerified: true,
    },
  });

  // Create admin user in AdminUser table (for admin login)
  await prisma.adminUser.upsert({
    where: { email: 'admin@boribuz.ca' },
    update: {},
    create: {
      email: 'admin@boribuz.ca',
      password,
    },
  });

  // Create test regular user
  await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password,
      name: 'Test User',
      emailVerified: true, // Pre-verified for testing
    },
  });

  // Seed menu items with detailed information
  const menuItems = [
    {
      itemId: "spicy-chicken-biriyani",
      name: "Spicy Chicken Biriyani",
      description: "Aromatic basmati rice layered with tender marinated chicken, cooked with traditional spices and saffron",
      price: 16.99,
      image: "https://images.unsplash.com/photo-1563379091339-03246963d4d6?w=400&h=300&fit=crop&auto=format",
      category: "Main Course",
      available: true,
      featured: true,
      ingredients: JSON.stringify(["Basmati Rice", "Chicken", "Onions", "Yogurt", "Garam Masala", "Saffron", "Mint", "Cilantro"]),
      allergens: JSON.stringify(["Dairy"]),
      calories: 650,
      protein: 35.0,
      carbs: 75.0,
      fat: 18.0,
      preparationTime: "25-30 minutes",
      spiceLevel: "Medium",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true
    },
    {
      itemId: "vegetable-korma",
      name: "Vegetable Korma",
      description: "Mixed vegetables cooked in a rich, creamy coconut and cashew sauce with aromatic spices",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&auto=format",
      category: "Main Course",
      available: true,
      featured: false,
      ingredients: JSON.stringify(["Mixed Vegetables", "Coconut Milk", "Cashews", "Onions", "Ginger", "Garlic", "Turmeric", "Coriander"]),
      allergens: JSON.stringify(["Tree Nuts"]),
      calories: 420,
      protein: 12.0,
      carbs: 35.0,
      fat: 28.0,
      preparationTime: "20-25 minutes",
      spiceLevel: "Mild",
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    },
    {
      itemId: "beef-rezala",
      name: "Beef Rezala",
      description: "Traditional Bengali dish with tender beef cooked in a rich, aromatic yogurt-based sauce",
      price: 18.99,
      image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop&auto=format",
      category: "Main Course",
      available: true,
      featured: false,
      ingredients: JSON.stringify(["Beef", "Yogurt", "Onions", "Ginger", "Garlic", "Cardamom", "Cinnamon", "Bay Leaves"]),
      allergens: JSON.stringify(["Dairy"]),
      calories: 720,
      protein: 45.0,
      carbs: 15.0,
      fat: 52.0,
      preparationTime: "35-40 minutes",
      spiceLevel: "Medium",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true
    },
    {
      itemId: "fish-curry",
      name: "Fish Curry",
      description: "Fresh fish cooked in a traditional Bengali mustard and coconut curry sauce",
      price: 17.99,
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&auto=format",
      category: "Main Course",
      available: true,
      featured: false,
      ingredients: JSON.stringify(["Fish", "Mustard Oil", "Turmeric", "Red Chili", "Coconut", "Curry Leaves", "Ginger"]),
      allergens: JSON.stringify(["Fish"]),
      calories: 380,
      protein: 32.0,
      carbs: 8.0,
      fat: 24.0,
      preparationTime: "20-25 minutes",
      spiceLevel: "Hot",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true
    },
    {
      itemId: "daal-tadka",
      name: "Daal Tadka",
      description: "Yellow lentils tempered with cumin, garlic, and aromatic spices",
      price: 10.99,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&auto=format",
      category: "Main Course",
      available: true,
      featured: false,
      ingredients: JSON.stringify(["Yellow Lentils", "Cumin", "Garlic", "Ginger", "Turmeric", "Cilantro", "Ghee"]),
      allergens: JSON.stringify(["Dairy"]),
      calories: 320,
      protein: 18.0,
      carbs: 45.0,
      fat: 8.0,
      preparationTime: "15-20 minutes",
      spiceLevel: "Mild",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    },
    {
      itemId: "naan-bread",
      name: "Naan Bread",
      description: "Fresh baked traditional Indian flatbread, soft and fluffy",
      price: 3.99,
      image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=400&h=300&fit=crop&auto=format",
      category: "Bread",
      available: true,
      featured: false,
      ingredients: JSON.stringify(["Flour", "Yogurt", "Milk", "Baking Powder", "Salt"]),
      allergens: JSON.stringify(["Gluten", "Dairy"]),
      calories: 280,
      protein: 8.0,
      carbs: 50.0,
      fat: 6.0,
      preparationTime: "5-10 minutes",
      spiceLevel: null,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false
    },
    {
      itemId: "mango-lassi",
      name: "Mango Lassi",
      description: "Refreshing yogurt-based drink blended with fresh mango and cardamom",
      price: 4.99,
      image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop&auto=format",
      category: "Beverages",
      available: true,
      featured: false,
      ingredients: JSON.stringify(["Mango", "Yogurt", "Milk", "Sugar", "Cardamom"]),
      allergens: JSON.stringify(["Dairy"]),
      calories: 220,
      protein: 6.0,
      carbs: 45.0,
      fat: 4.0,
      preparationTime: "2-3 minutes",
      spiceLevel: null,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    },
    {
      itemId: "samosa",
      name: "Samosa (2 pieces)",
      description: "Crispy triangular pastries filled with spiced potatoes and peas",
      price: 5.99,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&auto=format",
      category: "Appetizers",
      available: true,
      featured: false,
      ingredients: JSON.stringify(["Potatoes", "Peas", "Flour", "Cumin", "Coriander", "Turmeric", "Oil"]),
      allergens: JSON.stringify(["Gluten"]),
      calories: 180,
      protein: 4.0,
      carbs: 25.0,
      fat: 8.0,
      preparationTime: "8-10 minutes",
      spiceLevel: "Mild",
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: false
    }
  ];

  // Clear existing menu items and add new ones
  await prisma.menuItem.deleteMany();
  
  await prisma.menuItem.createMany({
    data: menuItems,
  });
  
  // Seed menu categories
  await prisma.menuCategory.deleteMany();
  
  const categories = [
    { categoryId: 'main-course', name: 'Main Course', description: 'Traditional Bengali main dishes', order: 1 },
    { categoryId: 'bread', name: 'Bread', description: 'Fresh baked breads and naan', order: 2 },
    { categoryId: 'beverages', name: 'Beverages', description: 'Refreshing drinks and lassi', order: 3 },
    { categoryId: 'appetizers', name: 'Appetizers', description: 'Start your meal right', order: 4 },
    { categoryId: 'desserts', name: 'Desserts', description: 'Sweet endings to your meal', order: 5 }
  ];

  await prisma.menuCategory.createMany({
    data: categories,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});