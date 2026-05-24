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

    // Prevent confirming expired reservation
    if (reservation.status === "expired") {

      return NextResponse.json(
        {
          message: "Reservation already expired"
        },
        {
          status: 400
        }
      )
    }

    // Prevent duplicate confirm
    if (reservation.status === "confirmed") {

      return NextResponse.json(
        {
          message: "Already confirmed"
        },
        {
          status: 400
        }
      )
    }

    // Update reservation
    const updatedReservation =
      await prisma.reservation.update({
        where: {
          id: reservation.id
        },
        data: {
          status: "confirmed"
        }
      })

    return NextResponse.json({
      message: "Purchase confirmed successfully",
      reservation: updatedReservation
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