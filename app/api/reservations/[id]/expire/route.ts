import { prisma } from "../../../../../lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params

    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id: Number(id)
        }
      })

    if (!reservation) {

      return NextResponse.json(
        {
          message: "Reservation not found"
        },
        {
          status: 404
        }
      )
    }

    // Already expired
    if (reservation.status === "expired") {

      return NextResponse.json({
        message: "Already expired"
      })
    }

    // Restore stock
    await prisma.inventory.updateMany({
      where: {
        productId: reservation.productId,
        warehouseId: reservation.warehouseId
      },
      data: {
        reservedStock: {
          decrement: reservation.quantity
        }
      }
    })

    // Update reservation status
    await prisma.reservation.update({
      where: {
        id: reservation.id
      },
      data: {
        status: "expired"
      }
    })

    return NextResponse.json({
      message: "Reservation expired"
    })

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