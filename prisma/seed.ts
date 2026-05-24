import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {

  // Create Product
  const product = await prisma.product.create({
    data: {
      name: "iPhone 15",
      price: 80000
    }
  })

  // Create Warehouse
  const warehouse = await prisma.warehouse.create({
    data: {
      name: "Warehouse A",
      location: "Chennai"
    }
  })

  // Create Inventory
  await prisma.inventory.create({
    data: {
      productId: product.id,
      warehouseId: warehouse.id,
      totalStock: 5
    }
  })

  console.log("Seed data inserted successfully")
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })