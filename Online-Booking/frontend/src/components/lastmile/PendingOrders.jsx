import React, { useEffect, useState } from 'react'
import Search from '../common/Search'
import axios from 'axios'



const PendingOrders = () => {
  const[orders,setOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredOrders, setFilteredOrders] = useState(orders)
  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8081/v1/Booking/all')
        const pendingOnly = response.data.filter(booking => booking.status === 'Pending')
        setOrders(pendingOnly)
        setFilteredOrders(pendingOnly)
      } catch (error) {
        console.log('Falied to fetch orders: ', error);
      }
    }

    fetchOrders()
  }, [])

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      setFilteredOrders(
        orders.filter((order) => order.lrNumber.includes(searchTerm))
      )
      setCurrentPage(1)
    } else {
      setFilteredOrders(orders)
    }
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  return (
    <div className="w-full flex flex-col items-center my-10 px-4">
      <Search onSearch={handleSearch} />

      <div className="w-full max-w-4xl overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-950 text-white">
            <tr>
              <th className="border p-3 text-left">LR Number</th>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Contact</th>
              <th className="border p-3 text-left">No. of Goods</th>
              <th className="border p-3 text-left">Amount Paid</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Rider Name</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border p-3">{order.lrNumber}</td>
                  <td className="border p-3">{order.name}</td>
                  <td className="border p-3">{order.phone}</td>
                  <td className="border p-3">{order.noOfGoods}</td>
                  <td className="border p-3">{order.amount}</td>
                  <td className="border p-3">{order.status}</td>
                  <td className="border p-3">{order.riderName || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="border p-3 text-center text-gray-500"
                >
                  No Pending orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex space-x-4 mt-5">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-800 text-white rounded disabled:bg-gray-500"
        >
          Previous
        </button>
        <span className="text-lg font-semibold">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-800 text-white rounded disabled:bg-gray-500"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default PendingOrders
