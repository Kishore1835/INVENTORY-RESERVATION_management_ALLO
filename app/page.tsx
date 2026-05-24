"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import StatusBadge from "../components/StatusBadge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

type ProductData = {
  id: number
  totalStock: number
  reservedStock: number

  product: {
    id: number
    name: string
    price: number
  }

  warehouse: {
    id: number
    name: string
    location: string
  }
}
type ReservationData = {
  id: number
  quantity: number
  status: string
  createdAt: string

  product: {
    name: string
  }

  warehouse: {
    name: string
  }
}

const COLORS = [
  "#06b6d4",
  "#22c55e"
]

export default function Home() {

  const router = useRouter()

  const [products, setProducts] =
    useState<ProductData[]>([])

  const[reservations, setReservations] =
    useState<ReservationData[]>([])
  
    const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    async function fetchProducts() {

      try {

        const res = await fetch(
          "/api/products"
        )

        const data = await res.json()

        setProducts(data)
        const reservationRes = await fetch(
            "/api/reservations"
          )

          const reservationData =
            await reservationRes.json()

          setReservations(reservationData)

      } catch (error) {

        console.error(error)

      } finally {

        setLoading(false)
      }
    }

    fetchProducts()

  }, [])

  async function reserveProduct(
    productId: number,
    warehouseId: number
  ) {

    try {

      const res = await fetch(
        "/api/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            productId,
            warehouseId,
            quantity: 1
          })
        }
      )

      const data = await res.json()

      if (!res.ok) {
        alert(data.message)
        return
      }

      router.push(
        `/reservation/${data.id}`
      )

    } catch (error) {

      console.error(error)

      alert("Something went wrong")
    }
  }

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-black text-white text-3xl">

        Loading Inventory Platform...

      </div>
    )
  }

  // Analytics
  const totalProducts =
    products.length

  const totalReserved =
    products.reduce(
      (acc, item) =>
        acc + item.reservedStock,
      0
    )

  const totalAvailable =
    products.reduce(
      (acc, item) =>
        acc +
        (
          item.totalStock -
          item.reservedStock
        ),
      0
    )

  const inventoryChartData =
    products.map((item) => ({
      warehouse:
        item.warehouse.name,
      stock:
        item.totalStock -
        item.reservedStock
    }))

  const pieData = [
    {
      name: "Reserved",
      value: totalReserved
    },
    {
      name: "Available",
      value: totalAvailable
    }
  ]

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-black text-white">

      {/* Navbar */}
      <div className="flex items-center justify-between px-10 py-6 border-b border-white/10 backdrop-blur-lg sticky top-0 z-50 bg-black/30">

        <div>

          <h1 className="text-4xl font-extrabold text-cyan-400">
            Allo Health
          </h1>

          <p className="text-gray-400 mt-1">
            Smart Reservation Inventory Platform
          </p>

        </div>

        <div className="bg-cyan-500/20 border border-cyan-500/20 px-5 py-2 rounded-full text-cyan-300">
          Live Analytics Active
        </div>

      </div>

      {/* Hero */}
      <div className="px-10 py-16">

        <h1 className="text-6xl font-extrabold leading-tight max-w-5xl">

          Multi-Warehouse
          <span className="text-cyan-400">
            {" "}Inventory Reservation{" "}
          </span>
          Engine

        </h1>

        <p className="text-gray-400 text-xl mt-8 max-w-3xl leading-relaxed">

          Prevent overselling using a reservation-first
          inventory system with real-time stock locking,
          automatic reservation handling and scalable
          warehouse management.

        </p>

      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-10">

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl">

          <h2 className="text-gray-400 text-lg">
            Total Products
          </h2>

          <p className="text-5xl font-bold text-cyan-400 mt-4">
            {totalProducts}
          </p>

        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl">

          <h2 className="text-gray-400 text-lg">
            Reserved Stock
          </h2>

          <p className="text-5xl font-bold text-red-400 mt-4">
            {totalReserved}
          </p>

        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl">

          <h2 className="text-gray-400 text-lg">
            Available Stock
          </h2>

          <p className="text-5xl font-bold text-green-400 mt-4">
            {totalAvailable}
          </p>

        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl">

          <h2 className="text-gray-400 text-lg">
            Warehouses
          </h2>

          <p className="text-5xl font-bold text-yellow-400 mt-4">
            {products.length}
          </p>

        </div>

      </div>

      
      {/* Product Section */}
      <div className="px-10 pb-20">

        <div className="flex items-center justify-between mb-10">

          <div>

            <h2 className="text-5xl font-bold text-cyan-400">
              Product Reservations
            </h2>

            <p className="text-gray-400 mt-3 text-lg">
              Reserve inventory in real-time across warehouses
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {products.map((item) => {

            const availableStock =
              item.totalStock -
              item.reservedStock

            return (

              <div
                key={item.id}
                className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:scale-[1.03] transition duration-300"
              >

                <div className="flex items-center justify-between">

                  <h2 className="text-3xl font-bold">
                    {item.product.name}
                  </h2>

                  <div className="bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-sm">
                    Live
                  </div>

                </div>

                <div className="mt-8 space-y-4 text-lg">

                  <p>
                    💰 Price:
                    <span className="ml-2 font-bold text-cyan-400">
                      ₹ {item.product.price}
                    </span>
                  </p>

                  <p>
                    🏬 Warehouse:
                    <span className="ml-2">
                      {item.warehouse.name}
                    </span>
                  </p>

                  <p>
                    📍 Location:
                    <span className="ml-2">
                      {item.warehouse.location}
                    </span>
                  </p>

                  <p>
                    📦 Available:
                    <span className="ml-2 text-green-400 font-bold">
                      {availableStock}
                    </span>
                  </p>

                </div>

                <button
                  disabled={availableStock <= 0}
                  onClick={() =>
                    reserveProduct(
                      item.product.id,
                      item.warehouse.id
                    )
                  }
                  className={`w-full mt-10 font-bold py-4 rounded-2xl text-lg transition duration-300 ${
                    availableStock <= 0
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-cyan-400 hover:bg-cyan-500 text-black"
                  }`}
                >

                  {availableStock <= 0
                    ? "Out Of Stock"
                    : "Reserve Inventory"}

                </button>

              </div>
            )
          })}

        </div>

      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 px-10 py-14">

        {/* Bar Chart */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl">

          <h2 className="text-3xl font-bold mb-8 text-cyan-400">
            Warehouse Inventory
          </h2>

          <div className="h-[400px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={inventoryChartData}>

                <XAxis dataKey="warehouse" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="stock"
                  fill="#06b6d4"
                  radius={[10, 10, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Pie Chart */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl">

          <h2 className="text-3xl font-bold mb-8 text-green-400">
            Inventory Health
          </h2>

          <div className="h-[400px]">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={140}
                  label
                >

                  {pieData.map(
                    (_, index) => (

                      <Cell
                        key={index}
                        fill={COLORS[index]}
                      />
                    )
                  )}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    {/* Recent Reservations */}

<div className="px-10 pb-20">

  <h2 className="text-5xl font-bold text-cyan-400 mb-10">

    Recent Reservations

  </h2>

  <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-3xl backdrop-blur-lg shadow-2xl">

    <table className="w-full">

      <thead className="bg-white/10 text-left">

        <tr>

          <th className="p-6 text-lg">
            Product
          </th>

          <th className="p-6 text-lg">
            Warehouse
          </th>

          <th className="p-6 text-lg">
            Quantity
          </th>

          <th className="p-6 text-lg">
            Status
          </th>

          <th className="p-6 text-lg">
            Time
          </th>

        </tr>

      </thead>

      <tbody>

        {reservations.map((item) => (

          <tr
            key={item.id}
            className="border-t border-white/10 hover:bg-white/5 transition duration-300"
          >

            <td className="p-6">
              {item.product.name}
            </td>

            <td className="p-6">
              {item.warehouse.name}
            </td>

            <td className="p-6">
              {item.quantity}
            </td>

            <td className="p-6">

              <StatusBadge status={item.status} />

            </td>

            <td className="p-6 text-gray-400">

              {new Date(
                item.createdAt
              ).toLocaleString()}

            </td>

          </tr>
        ))}

      </tbody>

    </table>

  </div>

</div>
    </div>
  )
}