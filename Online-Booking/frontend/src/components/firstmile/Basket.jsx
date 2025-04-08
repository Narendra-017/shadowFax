import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Basket = () => {
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [error, setError] = useState('')
  const [showOverlay, setShowOverlay] = useState(false)

  const [totalBasket, setTotalBasket] = useState(0);
    const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const submitVehicleNumber = async (
    vehicleNumber,
    setMessage,
    setError,
    setShowOverlay,
    setIsLoading
  )=>{
    try{
      setIsLoading(true)
      setError('')
      console.log("Calling API with vehicle:", vehicleNumber);
      const response = await axios.post(`http://localhost:8081/v1/shipping/save?vehicleNumber=${vehicleNumber}`)
      console.log('API response:', response.data)

      setMessage('✅ Vehicle number verified!')
      setShowOverlay(true)
    }catch(err){
      setError('Failed to save vehicle. Please try again.')
      console.log('API error :', err);
      console.error('API error:', err.response || err.message || err)
    }finally{
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const vehicleRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/

    if (!vehicleRegex.test(vehicleNumber)) {
      setError('Invalid vehicle number format. Use TS09CX1234.')
      setMessage('')
      return
    }

    await submitVehicleNumber(
      vehicleNumber,
      setMessage,
      setError,
      setShowOverlay,
      setIsLoading
    )

    setShowOverlay(true)
    setTimeout(() => {
      setShowOverlay(false)
    }, 3000)

  }

  //totalBasket Count
  const handleBasketCount = async () => {
    try{
      const response = await axios.get('http://localhost:8081/v1/Booking/all')
      const allBasket = response.data

      setTotalBasket(allBasket.length)
    }catch(err){
      console.log('Falied to fetch TotalBasket: ',err)
      
      setTotalBasket(0)
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleBasketCount();
  }, []);
  


  const handleChange = (e) => {
    let input = e.target.value.toUpperCase()
    if (input.length <= 10) {
      setVehicleNumber(input)
      setError('')
    }
  }


  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        <div className="lg:w-[85%] w-full flex flex-col items-center text-center px-6">
          <h1 className="text-3xl font-bold">Welcome User,</h1>
          <p className="text-xl text-gray-700 font-semibold">
            These are your Exports information
          </p>
          <p className="text-lg text-gray-600 font-medium">
            All your booking information will be shown here.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4 border-2 p-10 rounded-lg border-gray-400">
          <h1 className="text-gray-950 text-4xl font-bold">Total Booked</h1>
          <Link
            to="/basket"
            className="text-center text-3xl font-semibold bg-gray-950 rounded-lg text-gray-100 px-2 py-1"
          >
            {totalBasket}
          </Link>
        </div>

        <section className="w-full max-w-md flex flex-col items-center border-2 p-10 rounded-lg border-gray-400">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col space-y-4 items-center"
          >
            <h1 className="text-xl font-medium tracking-wide">Enter Vehicle Number to start a Trip!</h1>
            <input
              type="text"
              value={vehicleNumber}
              onChange={handleChange}
              placeholder="TS09CX1234"
              className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-lg"
              required
            />
            {error && <p className="text-red-500 font-medium">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-3 rounded-lg bg-gray-950 text-white text-xl font-semibold cursor-pointer hover:bg-gray-800 transition"
            >
              Start Trip
            </button>
          </form>
        </section>
      </div>

      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center shadow-lg">
            <div className="text-green-600 text-6xl mb-4">✔</div>
            <h2 className="text-2xl font-semibold">Trip Started!</h2>
            <p className="text-lg text-gray-700 mt-2">
              Vehicle {vehicleNumber} is confirmed.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}


export default Basket
