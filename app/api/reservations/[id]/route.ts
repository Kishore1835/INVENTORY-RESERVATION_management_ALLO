import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params

  const reservation =
    await prisma.reservation.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        product: true,
        warehouse: true
      }
    })

  if (!reservation) {
    return NextResponse.json(
      { message: "Reservation not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(reservation)
}