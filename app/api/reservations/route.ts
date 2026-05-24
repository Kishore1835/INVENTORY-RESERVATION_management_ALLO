import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"

// GET ALL RESERVATIONS
export async function GET() {

  try {

    const reservations =
      await prisma.reservation.findMany({

        include: {
          product: true,
          warehouse: true
        },

        orderBy: {
          createdAt: "desc"
        }

      })

    return NextResponse.json(
      reservations
    )

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      {
        message: "Internal server error"
      },
      {
        status: 500
      }
    )
  }
}

// CREATE RESERVATION
export async function POST(
  req: Request
) {

  try {

    const body = await req.json()

    const {
      productId,
      warehouseId,
      quantity
    } = body

    // Find inventory
    const inventory =
      await prisma.inventory.findFirst({
        where: {
          productId,
          warehouseId
        }
      })

    if (!inventory) {

      return NextResponse.json(
        {
          message: "Inventory not found"
        },
        {
          status: 404
        }
      )
    }

    // Calculate available stock
    const available =
      inventory.totalStock -
      inventory.reservedStock

    // Not enough stock
    if (available < quantity) {

      return NextResponse.json(
        {
          message: "Not enough stock"
        },
        {
          status: 400
        }
      )
    }

    // Create reservation
    const reservation =
      await prisma.reservation.create({

        data: {

          productId,
          warehouseId,
          quantity,

          status: "pending",

          expiresAt:
            new Date(
              Date.now() + 3 * 60 * 1000
            )
        }

      })

    // Update reserved stock
    await prisma.inventory.update({
      where: {
        id: inventory.id
      },

      data: {
        reservedStock: {
          increment: quantity
        }
      }
    })

    return NextResponse.json(
      reservation,
      {
        status: 201
      }
    )

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      {
        message: "Internal server error"
      },
      {
        status: 500
      }
    )
  }
}