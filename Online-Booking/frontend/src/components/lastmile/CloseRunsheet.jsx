import React, { useState, useEffect } from 'react'
import LastMileSidebar from './LastMileSidebar'
import { FaUser } from 'react-icons/fa'

const CloseRunsheet = () => {
  const [selectedRider, setSelectedRider] = useState('')
  const [lrNumber, setLrNumber] = useState('')
  const [pendingOrders, setPendingOrders] = useState(0)
  const [ setAmountCollected] = useState(0)

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/orders/pending')
        const data = await response.json()
        setPendingOrders(data.count)
      } catch (error) {
        console.error('Error fetching pending orders:', error)
      }
    }

    fetchPendingOrders()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedRider || !lrNumber.trim()) return
    setPendingOrders((prev) => Math.max(0, prev - 1))
    setAmountCollected((prev) => prev + 500)
    setLrNumber('')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <LastMileSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto  p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Close Runsheet
          </h1>
          <p className="text-gray-600 mb-6">
            Choose the rider to close the Runsheet
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <select
                className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedRider}
                onChange={(e) => setSelectedRider(e.target.value)}
              >
                <option value="" disabled>
                  Select Rider
                </option>
                <option value="sanju">Sanju</option>
                <option value="sai">Sai</option>
                <option value="babu">Babu</option>
                <option value="vishnu">Vishnu</option>
              </select>
            </div>

            <label className="block text-gray-700 font-medium">
              Enter the LR Number
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950"
              value={lrNumber}
              onChange={(e) => setLrNumber(e.target.value)}
              placeholder="Enter LR number"
            />

            <button
              type="submit"
              className="w-full bg-gray-950 text-white p-3 rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              Submit
            </button>
          </form>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse bg-gray-50 shadow-md rounded-lg">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Pending</th>
                  <th className="py-3 px-4 text-left">Amount Collected</th>
                  <th className="py-3 px-4 text-left">Close Runsheet</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-100 transition">
                  <td className="py-3 px-4">{pendingOrders}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Collected Money"
                      required
                    />
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => alert('Runsheet Closed!')}
                      className="w-full bg-gray-700 text-white p-2 rounded-lg font-semibold hover:bg-gray-950 transition"
                    >
                      Click Here
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CloseRunsheet
