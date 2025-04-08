import React, { useEffect, useState } from 'react'
import LastMileSidebar from './LastMileSidebar'

const RiderActivity = () => {

  const [riderData, setRiderData] = useState([])  
  // const [riderSummary, setRiderSummary] = useState([
  //   { riderName: 'John Doe', totalAssigned: 15, delivered: 10, pending: 5 },
  //   { riderName: 'Jane Smith', totalAssigned: 12, delivered: 8, pending: 4 },
  //   { riderName: 'Alex Brown', totalAssigned: 20, delivered: 18, pending: 2 },
  // ])

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const response = await fetch('http://localhost:8081/v1/Booking/all')
        const data = await response.json()
        setRiderData(data)
      } catch (error) {
        console.error('Error fetching riders:', error)
      }
    }

    fetchRiders()
  },[]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <LastMileSidebar />
      <main className="flex-1 flex flex-col items-center p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          📦 Rider Activity
        </h1>

        <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="py-3 px-4 text-left">SI No</th>
                <th className="py-3 px-4 text-left">Rider Name</th>
                <th className="py-3 px-4 text-center">Out for Delivery</th>
                <th className="py-3 px-4 text-center">Delivered</th>
                <th className="py-3 px-4 text-center">Pending</th>
              </tr>
            </thead>
            <tbody>
              {riderData.map((rider, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-semibold">{rider.riderName}</td>
                  <td className="py-3 px-4 text-center">
                    {rider.outOfDelivery}
                  </td>
                  <td className="py-3 px-4 text-center text-green-600 font-bold">
                    {rider.delivered}
                  </td>
                  <td className="py-3 px-4 text-center text-red-600 font-bold">
                    {rider.pending}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default RiderActivity
