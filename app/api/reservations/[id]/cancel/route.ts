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

    // Delete reservation
    await prisma.reservation.delete({
      where: {
        id: reservation.id
      }
    })

    return NextResponse.json({
      message: "Reservation cancelled successfully"
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