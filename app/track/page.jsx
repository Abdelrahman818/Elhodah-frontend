"use client";

import { useState } from "react";
import { PackageCheck, Truck, Clock, MapPin } from "lucide-react";
import { fetchDemoOrder, isDemoMode } from "@/lib/demoMode";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!orderId) return;

    if (isDemoMode) {
      const demoOrder = await fetchDemoOrder(orderId);
      setOrder(demoOrder);
      setError(demoOrder ? "" : "Order not found. Try 4012, 4013, or 4014.");
    }

    setShowResult(true);
  };

  const activeStep = order?.orderStatus === "completed"
    ? 4
    : order?.orderStatus === "in delivery"
      ? 3
      : 2;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-3">Track Your Order</h1>
        <p className="text-gray-300">
          Enter an order number to see its current status.
        </p>
      </section>

      <section className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <label className="block mb-2 text-gray-700 font-medium">
            Order Number
          </label>
          <input
            type="text"
            placeholder={isDemoMode ? "Try 4012, 4013, or 4014" : "Enter order number"}
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />

          <button
            onClick={handleTrack}
            className="w-full bg-emerald-700 text-white py-2 rounded-lg hover:bg-emerald-800 transition cursor-pointer"
          >
            Track Order
          </button>
        </div>
      </section>

      {showResult && (
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-8 text-center">
              {order ? `Order #${order.orderId}` : "Order Status"}
            </h2>

            {error && (
              <p className="text-center text-red-500 mb-6">{error}</p>
            )}

            {order && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm text-gray-600">
                  <p><strong>Name:</strong> {order.name}</p>
                  <p><strong>Total:</strong> {order.totalPrice} جنيه</p>
                  <p><strong>Status:</strong> {order.orderStatus}</p>
                </div>

                <div className="mb-8 border rounded-lg divide-y">
                  {order.products?.map((item) => (
                    <div key={`${item.product?._id}-${item.size}-${item.color}`} className="p-3 flex justify-between gap-4">
                      <span>{item.product?.title || "Product"}</span>
                      <span className="text-gray-500">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <StatusItem
                icon={<Clock />}
                title="Processing"
                active={activeStep >= 1}
              />
              <StatusItem
                icon={<PackageCheck />}
                title="Packed"
                active={activeStep >= 2}
              />
              <StatusItem
                icon={<Truck />}
                title="In Delivery"
                active={activeStep >= 3}
              />
              <StatusItem
                icon={<MapPin />}
                title="Delivered"
                active={activeStep >= 4}
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function StatusItem({ icon, title, active }) {
  return (
    <div
      className={`flex flex-col items-center p-4 rounded-lg border
      ${active ? "border-emerald-700 bg-emerald-50" : "border-gray-200"}`}
    >
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full mb-3
        ${active ? "bg-emerald-700 text-white" : "bg-gray-200 text-gray-500"}`}
      >
        {icon}
      </div>
      <span
        className={`font-medium
        ${active ? "text-emerald-700" : "text-gray-500"}`}
      >
        {title}
      </span>
    </div>
  );
}
