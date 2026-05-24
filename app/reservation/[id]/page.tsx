"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import StatusBadge from "../../../components/StatusBadge"
type Reservation = {
  id: number
  quantity: number
  status: string
  expiresAt: string

  product: {
    name: string
    price: number
  }

  warehouse: {
    name: string
    location: string
  }
}

export default function ReservationPage() {

  const params = useParams()
  const router = useRouter()

  const id = params.id

  const [reservation, setReservation] =
    useState<Reservation | null>(null)

  const [timeLeft, setTimeLeft] =
    useState<string>("")

  // Fetch reservation
  useEffect(() => {

    async function fetchReservation() {

      const res = await fetch(
        `http://localhost:3000/api/reservations/${id}`
      )

      const data = await res.json()

      setReservation(data)
    }

    fetchReservation()

  }, [id])

  // Timer Logic
  useEffect(() => {

    if (!reservation) return

    // Stop timer if confirmed
    if (reservation.status === "confirmed") {


      return
    }

    const interval = setInterval(() => {

      const now = new Date().getTime()

      const expiry =
        new Date(reservation.expiresAt).getTime()

      const distance = expiry - now

      // Auto Expire
      if (distance <= 0) {

        setTimeLeft("Expired")

        clearInterval(interval)

        fetch(
          `http://localhost:3000/api/reservations/${id}/expire`,
          {
            method: "POST"
          }
        )

        return
      }

      const minutes =
        Math.floor(distance / 1000 / 60)

      const seconds =
        Math.floor((distance / 1000) % 60)

      setTimeLeft(
        `${minutes}m ${seconds}s`
      )

    }, 1000)

    return () => clearInterval(interval)

  }, [reservation, id])

  // Cancel Reservation
  async function cancelReservation() {

    try {

      const res = await fetch(
        `http://localhost:3000/api/reservations/${id}/cancel`,
        {
          method: "POST"
        }
      )

      const data = await res.json()

      alert(data.message)

      router.push("/")

    } catch (error) {

      console.error(error)

      alert("Something went wrong")
    }
  }

  // Confirm Reservation
  async function confirmReservation() {

    try {

      const res = await fetch(
        `http://localhost:3000/api/reservations/${id}/confirm`,
        {
          method: "POST"
        }
      )

      const data = await res.json()

      alert(data.message)

      router.push("/")

    } catch (error) {

      console.error(error)

      alert("Something went wrong")
    }
  }

  // Loading
  if (!reservation) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-black text-white text-3xl">

        Loading Reservation...

      </div>
    )
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0f172a] to-black text-white flex items-center justify-center p-10">

      <div className="w-full max-w-3xl bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-extrabold text-cyan-400">
              Reservation Checkout
            </h1>

            <p className="text-gray-400 mt-3 text-lg">
              Secure Inventory Hold Session
            </p>

          </div>

          {/* Status Badge */}
          <StatusBadge status={reservation.status} />

        </div>

        {/* Reservation Details */}
        <div className="mt-10 space-y-6 text-xl">

          <div className="flex justify-between border-b border-gray-800 pb-4">
            <span className="text-gray-400">
              Product
            </span>

            <span>
              {reservation.product.name}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-800 pb-4">
            <span className="text-gray-400">
              Price
            </span>

            <span>
              ₹ {reservation.product.price}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-800 pb-4">
            <span className="text-gray-400">
              Warehouse
            </span>

            <span>
              {reservation.warehouse.name}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-800 pb-4">
            <span className="text-gray-400">
              Location
            </span>

            <span>
              {reservation.warehouse.location}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-800 pb-4">
            <span className="text-gray-400">
              Quantity
            </span>

            <span>
              {reservation.quantity}
            </span>
          </div>

        </div>

        {/* Timer */}
        <div className="mt-12 bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center">

          <p className="text-red-400 text-xl mb-4">
            Reservation Status
          </p>

          <h2 className="text-6xl font-extrabold">

            {reservation.status === "confirmed"
              ? "Confirmed"
              : timeLeft}

          </h2>

        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-6 mt-12">

          {/* Confirm */}
          <button
            disabled={timeLeft === "Expired"}
            onClick={confirmReservation}
            className={`font-bold py-5 rounded-2xl text-xl transition duration-300 ${
              timeLeft === "Expired"
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-black"
            }`}
          >

            Confirm Purchase

          </button>

          {/* Cancel */}
          <button
            disabled={timeLeft === "Expired"}
            onClick={cancelReservation}
            className={`font-bold py-5 rounded-2xl text-xl transition duration-300 ${
              timeLeft === "Expired"
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >

            Cancel Reservation

          </button>

        </div>

      </div>

    </div>
  )
}