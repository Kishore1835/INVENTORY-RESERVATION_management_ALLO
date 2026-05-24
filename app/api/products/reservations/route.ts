import { prisma } from "C:/Users/Kishore/allo-inventory/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {

  try {

    const body = await req.json()

    const {
      productId,
      warehouseId,
      quantity
    } = body

    const reservation = await prisma.$transaction(
      async (tx) => {

        // Find inventory
        const inventory = await tx.inventory.findFirst({
          where: {
            productId,
            warehouseId
          }
        })

        // Inventory not found
        if (!inventory) {
          throw new Error("INVENTORY_NOT_FOUND")
        }

        // Calculate available stock
        const availableStock =
          inventory.totalStock -
          inventory.reservedStock

        // Not enough stock
        if (availableStock < quantity) {
          throw new Error("OUT_OF_STOCK")
        }

        // Increase reserved stock
        await tx.inventory.update({
          where: {
            id: inventory.id
          },
          data: {
            reservedStock: {
              increment: quantity
            }
          }
        })

        // Create reservation
        const newReservation =
          await tx.reservation.create({
            data: {
              productId,
              warehouseId,
              quantity,
              status: "pending",
              expiresAt: new Date(
                Date.now() + 10 * 60 * 1000
              )
            }
          })

        return newReservation
      }
    )

    return NextResponse.json(
      reservation,
      { status: 201 }
    )

  } catch (error) {

    if (
      error instanceof Error &&
      error.message === "OUT_OF_STOCK"
    ) {
      return NextResponse.json(
        {
          message: "Not enough stock available"
        },
        { status: 409 }
      )
    }

    if (
      error instanceof Error &&
      error.message === "INVENTORY_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          message: "Inventory not found"
        },
        { status: 404 }
      )
    }

    console.error(error)

    return NextResponse.json(
      {
        message: "Internal server error"
      },
      { status: 500 }
    )
  }
}