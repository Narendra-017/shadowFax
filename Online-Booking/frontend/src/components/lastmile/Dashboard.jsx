import React, {useState, useEffect}  from 'react'
import LastMileSidebar from './LastMileSidebar'
import Search from '../common/Search'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import axios from 'axios'

const Dashboard = () => {

  const [booking,setBooking] = useState(null)
  const [error, setError] = useState('')
  const [showPopup, setShowPopup] = useState(false)

  const [pendingOrders, setPendingOrders] = useState(0)

  const handleSearch = async (lrNumber) => {
    try {
      const response = await axios.get(`http://localhost:8081/v1/Booking/booking-details/${lrNumber}`)
      setBooking(response.data)
      setShowPopup(true)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Booking not found')
      setShowPopup(false)
    }
  }

  // pendingOrders Count 
  const fetchPendingOrders = async () => {
    try{
      const response = await axios.get(`http://localhost:8081/v1/Booking/all`)
      const allBookings = response.data

      const pendingOnly = allBookings.filter(booking => booking.status === 'Pending')
      setPendingOrders(pendingOnly.length)
    }catch(err){
      console.log('Falied to fetch pending orders: ',err)
      setPendingOrders(0)
    }
  }

  useEffect(() => {
    fetchPendingOrders()
  }, [])

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <LastMileSidebar />
      <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 space-y-10 md:space-y-20 w-full max-w-[85%]">
        <Search onSearch={handleSearch}/>

        {error && (
          <p className="text-red-600 font-semibold">{error}</p>
        )}

        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 border-2 rounded-lg p-6 md:p-10 w-full md:w-auto text-center">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-bold">
            Pending Orders
          </h1>
          <Link
            to="/pending-orders"
            className="text-xl md:text-3xl text-gray-100 bg-gray-950 rounded-md py-2 px-6 font-semibold w-full md:w-auto"
          >
            {pendingOrders}
          </Link>
        </div>

        <div>
          <Link
            to="/create-runsheet"
            className="flex items-center justify-center gap-3 text-lg md:text-2xl font-bold text-gray-100 bg-gray-950 py-3 px-6 rounded-xl w-full md:w-auto"
          >
            Create Runsheet
            <FaArrowRight />
          </Link>
        </div>
      </div>

      {showPopup && booking &&(
         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
         <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] md:w-[500px] relative">
           <button
             className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
             onClick={() => setShowPopup(false)}
           >
             &times;
           </button>
           <h2 className="text-xl font-bold mb-4">Booking Details</h2>
           <p><strong>LR Number:</strong> {booking.lrNumber}</p>
           <p><strong>Name:</strong> {booking.name}</p>
           <p><strong>Phone:</strong> {booking.phone}</p>
           <p><strong>No. of Goods:</strong> {booking.noOfGoods}</p>
           <p><strong>Amount:</strong> ₹{booking.amount}</p>
           <p><strong>Status:</strong> {booking.status}</p>
           <p><strong>Rider:</strong> {booking.riderName}</p>
         </div>
       </div>
      )}
    </div>
  )
}

export default Dashboard
