import React, { useState } from 'react'
import axios from 'axios'

const CreateBookingForm = () => {
  const initialFormState = {
    name: '',
    contactNumber: '',
    noOfGoods: '',
    amount: '',
  }

  const [formData, setFormData] = useState(initialFormState)
  // const [barcodeData, setBarcodeData] = useState(null)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        'http://localhost:8081/v1/Booking/booking-create',
        {
          ...formData,
          noOfGoods: Number(formData.noOfGoods),
          amount: Number(formData.amount),

        }
        // setBarcodeData(response.data)
        // setFormData(initialFormState)
      )

      if(response.status === 200 || response.status === 201){
        alert('Booking successfully created!');
        setFormData(initialFormState);
      }else{
        alert('Booking falied, please try again!');
      }
    } catch (error) {
      console.error('Booking error ;', error)
      alert('Error occurred while creating the booking.')
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:mt-10">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h1 className="text-3xl my-5 font-bold">Create a Booking</h1>

        {['name', 'phone', 'noOfGoods', 'amount'].map((field) => (
          <div key={field} className="flex flex-col my-4">
            <label htmlFor={field} className="text-lg font-semibold">
              {field.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type={field === 'amount' ? 'number' : 'text'}
              name={field}
              placeholder={`Enter ${field}`}
              onChange={handleInputChange}
              value={formData[field]}
              className="w-full p-3 border rounded-lg mt-2 text-lg"
            />
          </div>
        ))}

        <input
          type="submit"
          value="Submit"
          className="w-full p-3 border rounded-lg mt-4 text-xl bg-gray-950 font-semibold text-gray-100 cursor-pointer"
        />
      </form>

      {/* {barcodeData && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Generated LR Number</h2>
          <p className="text-lg">{barcodeData.code}</p>
          <img
            src={barcodeData.imagePath}
            alt="Barcode"
            className="mt-4 w-48 h-auto"
          />
        </div>
      )} */}
    </div>
  )
}

export default CreateBookingForm
