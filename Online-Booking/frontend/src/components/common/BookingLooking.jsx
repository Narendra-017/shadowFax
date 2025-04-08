import React, { useState } from 'react'
import axios from 'axios'
import Search from './Search'

const BookingLookup = () => {
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [showPopup, setShowPopup] = useState(false)

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

  return (
    <div className="p-5">
      <Search onSearch={handleSearch} />

      {error && (
        <p className="text-red-600 font-semibold">{error}</p>
      )}

      {showPopup && booking && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[350px] md:w-[500px] relative">
            <button
              className="absolute top-2 right-3 text-gray-700 hover:text-black text-xl font-bold"
              onClick={() => setShowPopup(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl mb-4 font-semibold">Booking Details</h2>
            <p><strong>LR Number:</strong> {booking.lrNumber}</p>
            <p><strong>Name:</strong> {booking.name}</p>
            <p><strong>Phone:</strong> {booking.phone}</p>
            <p><strong>No. of Goods:</strong> {booking.noOfGoods}</p>
            <p><strong>Amount:</strong> ₹{booking.amount}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <p><strong>Rider:</strong> {booking.riderName}</p>
            <div className="mt-2 text-sm">
              <p><strong>Delivered:</strong> {booking.delivered}</p>
              <p><strong>Pending:</strong> {booking.pending}</p>
              <p><strong>Out of Delivery:</strong> {booking.outOfDelivery}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingLookup
