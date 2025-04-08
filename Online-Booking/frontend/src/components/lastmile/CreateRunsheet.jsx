import React, { useState } from "react";
import { FaQrcode, FaUser } from "react-icons/fa";
import axios from "axios";

function CreateRunsheet() {
  const [lrNumber, setLrNumber] = useState("");
  const [selectedRider, setSelectedRider] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLrNumber(e.target.value);
  };

  const handleRiderChange = (value) => {
    setSelectedRider(value);
    setIsOpen(false);
  };

  const toggleScanner = () => {
    console.log("Scanner triggered");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lrNumber.trim()) {
      setError("Please enter a valid LR number.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8081/v1/Booking/${lrNumber}`,
        {
          responseType: "arraybuffer",
        }
      );

      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const imageSrc = `data:image/png;base64,${base64}`;
      setQrCodeUrl(imageSrc);
      setError("");
    } catch (err) {
      console.error("Failed to fetch QR code:", err);
      setError("❌ Failed to get QR code. Please check LR number.");
      setQrCodeUrl("");
    }
  };

  const handleAssignRider = async () => {
    if (!lrNumber.trim()) {
      setError("❌ Please enter LR Number before assigning.");
      return;
    }

    if (!selectedRider.trim()) {
      setError("❌ Please select a rider before assigning.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8081/v1/Booking/assign-rider/${lrNumber}?riderName=${selectedRider}`
      );

      console.log("✅ Rider assigned successfully", response.data);
      setError(""); // Clear any previous errors
      alert("✅ Rider assigned successfully!");
    } catch (err) {
      console.error("❌ Failed to assign rider:", err);
      setError("❌ Failed to assign rider. Please try again.");
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create Run-sheet
        </h1>

        <section className="w-full mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="lrnumber"
              value={lrNumber}
              onChange={handleChange}
              placeholder="LR Number"
              autoFocus
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <input
              type="submit"
              value="Submit"
              className="w-full bg-gray-900 text-white py-2 rounded-md cursor-pointer hover:bg-gray-800"
            />
          </form>

          {error && <p className="text-red-600 mt-2">{error}</p>}

          {qrCodeUrl && (
            <div className="flex justify-center my-4">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-48 h-48 border border-gray-400 rounded-md"
              />
            </div>
          )}
        </section>

        <div className="flex justify-center my-4">
          <FaQrcode
            size={48}
            onClick={toggleScanner}
            className="cursor-pointer text-gray-900 hover:text-gray-700 transition"
          />
        </div>

        <div className="relative w-full">
          <div
            className="flex items-center justify-between p-3 border border-gray-300 rounded-md cursor-pointer bg-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-2">
              <FaUser />
              {selectedRider || "Select Rider"}
            </div>
            <span className="text-gray-500">▼</span>
          </div>

          {isOpen && (
            <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {["Sai", "Babu", "Vishnu", "Sanju"].map((rider) => (
                <div
                  key={rider}
                  className="p-3 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleRiderChange(rider)}
                >
                  {rider}
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleAssignRider} className="w-full mt-4 bg-gray-900 text-white py-2 rounded-md cursor-pointer hover:bg-gray-800 text-xl">
          Select
        </button>
      </div>
    </main>
  );
}

export default CreateRunsheet;