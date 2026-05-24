"use client"

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

const inventoryData = [
  {
    warehouse: "Warehouse A",
    stock: 5
  },
  {
    warehouse: "Warehouse B",
    stock: 8
  },
  {
    warehouse: "Warehouse C",
    stock: 3
  }
]

const reservationData = [
  {
    name: "Reserved",
    value: 4
  },
  {
    name: "Available",
    value: 6
  }
]

const COLORS = [
  "#06b6d4",
  "#22c55e"
]

export default function DashboardPage() {

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0f172a] to-black text-white p-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-12">

        <div>

          <h1 className="text-5xl font-extrabold text-cyan-400">
            Inventory Dashboard
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Real-Time Reservation Analytics
          </p>

        </div>

        <div className="bg-cyan-500/20 border border-cyan-500/20 px-5 py-3 rounded-2xl text-cyan-300">
          Live Monitoring Enabled
        </div>

      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl">

          <h2 className="text-gray-400 text-lg">
            Total Products
          </h2>

          <p className="text-5xl font-bold text-cyan-400 mt-4">
            12
          </p>

        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl">

          <h2 className="text-gray-400 text-lg">
            Active Reservations
          </h2>

          <p className="text-5xl font-bold text-green-400 mt-4">
            4
          </p>

        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl">

          <h2 className="text-gray-400 text-lg">
            Expired Reservations
          </h2>

          <p className="text-5xl font-bold text-red-400 mt-4">
            2
          </p>

        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl">

          <h2 className="text-gray-400 text-lg">
            Available Inventory
          </h2>

          <p className="text-5xl font-bold text-yellow-400 mt-4">
            16
          </p>

        </div>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

        {/* Bar Chart */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl">

          <h2 className="text-3xl font-bold mb-8 text-cyan-400">
            Warehouse Inventory
          </h2>

          <div className="h-[400px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={inventoryData}>

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
                  data={reservationData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={140}
                  label
                >

                  {reservationData.map(
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

    </div>
  )
}