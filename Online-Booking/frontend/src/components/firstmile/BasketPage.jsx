import React, { useEffect, useState } from 'react'
import Search from '../common/Search'
import axios from 'axios'



const BasketPage = () => {
  const[basket, setBasket] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredOrders, setFilteredOrders] = useState([])
  const itemsPerPage = 5

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)


  useEffect(() => {
    const fetchBasket = async () => {
      try{
        const response = await axios.get('http://localhost:8081/v1/Booking/all')
        setBasket(response.data)
        setFilteredOrders(response.data)
        } catch (error) {
          console.error('Falied to fetch baskets : ',error)
      }
    }

    fetchBasket()
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
        basket.filter((order) => order.lrNumber.includes(searchTerm))
      )
      setCurrentPage(1)
    } else {
      setFilteredOrders(basket)
    }
  }

  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="w-full max-w-full overflow-x-auto flex flex-col items-center my-10">
      <Search onSearch={handleSearch} />
      <table className="w-full max-w-[80%] border">
        <thead className="bg-gray-950 text-white">
          <tr>
            <th className="border p-3 text-left">LR Number</th>
            <th className="border p-3 text-left">Name</th>
            <th className="border p-3 text-left">Contact</th>
            <th className="border p-3 text-left">No. of Goods</th>
            <th className="border p-3 text-left">Amount Paid</th>
            <th className="border p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order, index) => (
            <tr key={index}>
              <td className="border p-3">{order.lrNumber}</td>
              <td className="border p-3">{order.name}</td>
              <td className="border p-3">{order.phone}</td>
              <td className="border p-3">{order.noOfGoods}</td>
              <td className="border p-3">{order.amount}</td>
              <td className="border p-3">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default BasketPage
