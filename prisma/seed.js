const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  console.log("Cleaning database...")
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.user.deleteMany({})

  console.log("Creating default Admin user...")
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@luxe.com",
      name: "Luxe Admin",
      password: "adminpassword123", // In production we would hash this
      role: "ADMIN",
    }
  })
  console.log(`Created admin user: ${adminUser.email}`)

  console.log("Creating product categories...")
  const menCategory = await prisma.category.create({
    data: { name: "Men", slug: "men", description: "Modern, premium menswear designed for elegance." }
  })
  const womenCategory = await prisma.category.create({
    data: { name: "Women", slug: "women", description: "Elegant, high-quality styles for the modern woman." }
  })
  const accessoriesCategory = await prisma.category.create({
    data: { name: "Accessories", slug: "accessories", description: "Minimalist and durable everyday accents." }
  })

  console.log("Seeding initial products...")

  const initialProducts = [
    {
      name: "Premium White T-Shirt",
      price: 49.99,
      originalPrice: 69.99,
      categoryId: menCategory.id,
      images: JSON.stringify(["/placeholder-1.webp"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      colors: JSON.stringify([
        { name: "White", hex: "#ffffff" },
        { name: "Black", hex: "#000000" }
      ]),
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      isNew: true,
      description: "Elegant white t-shirt made from 100% organic cotton. Features a perfect modern fit and breathable texture.",
    },
    {
      name: "Black Slim Fit Jeans",
      price: 89.99,
      categoryId: menCategory.id,
      images: JSON.stringify(["/placeholder-2.webp"]),
      sizes: JSON.stringify(["30", "32", "34", "36"]),
      colors: JSON.stringify([
        { name: "Black", hex: "#000000" }
      ]),
      rating: 4.8,
      reviewCount: 256,
      inStock: true,
      isNew: false,
      description: "Classic black jeans with a modern slim fit, tailored from raw stretch denim for long-lasting comfort.",
    },
    {
      name: "Minimalist Sweater",
      price: 79.99,
      originalPrice: 99.99,
      categoryId: womenCategory.id,
      images: JSON.stringify(["/placeholder-3.webp"]),
      sizes: JSON.stringify(["XS", "S", "M", "L"]),
      colors: JSON.stringify([
        { name: "Beige", hex: "#f5f5dc" },
        { name: "Grey", hex: "#808080" }
      ]),
      rating: 4.6,
      reviewCount: 189,
      inStock: true,
      isNew: true,
      description: "Soft wool blend sweater in neutral tones, featuring a dropped shoulder design and delicate ribbing.",
    },
    {
      name: "Casual White Sneakers",
      price: 119.99,
      categoryId: accessoriesCategory.id,
      images: JSON.stringify(["/placeholder-4.webp"]),
      sizes: JSON.stringify(["8", "9", "10", "11"]),
      colors: JSON.stringify([
        { name: "White", hex: "#ffffff" }
      ]),
      rating: 4.7,
      reviewCount: 342,
      inStock: true,
      isNew: false,
      description: "Comfortable and stylish white leather sneakers with high cushioning and durable, clean stitching.",
    },
    {
      name: "Wool Blend Coat",
      price: 199.99,
      originalPrice: 249.99,
      categoryId: womenCategory.id,
      images: JSON.stringify(["/placeholder-5.webp"]),
      sizes: JSON.stringify(["S", "M", "L"]),
      colors: JSON.stringify([
        { name: "Camel", hex: "#c19a6b" },
        { name: "Black", hex: "#000000" }
      ]),
      rating: 4.9,
      reviewCount: 95,
      inStock: true,
      isNew: true,
      description: "Elegant wool blend coat perfect for any season, styled with classic notch lapels and deep double pockets.",
    },
    {
      name: "Oxford Dress Shirt",
      price: 74.99,
      categoryId: menCategory.id,
      images: JSON.stringify(["/placeholder-1.webp"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      colors: JSON.stringify([
        { name: "Light Blue", hex: "#add8e6" },
        { name: "White", hex: "#ffffff" }
      ]),
      rating: 4.4,
      reviewCount: 167,
      inStock: true,
      isNew: false,
      description: "Classic oxford cloth dress shirt for formal occasions, tailored to a sharp, modern silhouette.",
    },
    {
      name: "Canvas Backpack",
      price: 89.99,
      originalPrice: 109.99,
      categoryId: accessoriesCategory.id,
      images: JSON.stringify(["/placeholder-2.webp"]),
      sizes: JSON.stringify(["One Size"]),
      colors: JSON.stringify([
        { name: "Olive", hex: "#808000" },
        { name: "Navy", hex: "#000080" }
      ]),
      rating: 4.6,
      reviewCount: 203,
      inStock: true,
      isNew: false,
      description: "Durable canvas backpack with leather accents, featuring padded straps and a secure 15-inch laptop slot.",
    },
    {
      name: "Summer Linen Dress",
      price: 99.99,
      categoryId: womenCategory.id,
      images: JSON.stringify(["/placeholder-3.webp"]),
      sizes: JSON.stringify(["XS", "S", "M", "L"]),
      colors: JSON.stringify([
        { name: "White", hex: "#ffffff" },
        { name: "Sage", hex: "#9caf88" }
      ]),
      rating: 4.5,
      reviewCount: 134,
      inStock: true,
      isNew: true,
      description: "Breathable, featherlight linen dress perfect for warm weather, featuring a elegant tiered design and adjustable tie back.",
    }
  ]

  for (const prod of initialProducts) {
    const createdProduct = await prisma.product.create({
      data: prod
    })
    console.log(`Created product: ${createdProduct.name}`)
  }

  console.log("Seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
