import React, { useState } from 'react'
import VehicleReachedOverlay from './VehicleReachedOverlay'
import LastMileSidebar from './LastMileSidebar'
import axios from 'axios'

const Receive = () => {
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [message, setMessage] = useState('')
  const [showOverlay, setShowOverlay] = useState(false)
  const [error, setError] = useState('')
  const [isLoading , setIsLoading] = useState(false)
  console.log("Receive component mounted");

  const verifyVehicle = async () => {
    try{
      setIsLoading(true)
      setError('')
      console.log("Calling API with vehicle:", vehicleNumber);

      const trimmed = vehicleNumber.trim().toUpperCase();

      console.log("verify VehicleNumber :", trimmed);

      const response = await axios.post(`http://localhost:8081/v1/shipping/verfiy?vehicleNumber=${trimmed}`)
      console.log('API response:', response.data)

      if (response.data === true) {
        setMessage('✅ Vehicle number verified!');
        setShowOverlay(true);
      } else {
        setError('❌ Vehicle not found!');
      }

    }catch(err){
      console.error('Verification error:', err);
      setError('Something went wrong. Please try again.');
    }finally{
      setIsLoading(false)

    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const vehicleRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/

    const trimmed = vehicleNumber.trim().toUpperCase();

    if (!vehicleRegex.test(trimmed)) {
      setError('Invalid vehicle number format. Use TS09CX1234.')
      setMessage('')
      return
    }

    await verifyVehicle();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <LastMileSidebar />
      <main className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Receive Vehicle
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="TS09CX1234"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Verifying...' : 'Verify Vehicle'}
            </button>
          </form>

          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
          {message && <p className="text-green-600 text-sm mt-4">{message}</p>}
        </div>

        {showOverlay && (
          <VehicleReachedOverlay onClose={() => setShowOverlay(false)} />
        )}
      </main>
    </div>
  )
}

export default Receive
