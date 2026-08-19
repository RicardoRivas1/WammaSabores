import React, { useState, useEffect } from "react";

// 📍 UBICACIÓN DE TU LOCAL
const RESTAURANT_LOCATION = {
  lat: 10.4965,
  lon: -66.8983,
};

// OPCIONES DE CONTORNOS DISPONIBLES
const OPCIONES_CONTORNOS = [
  "ARROZ",
  "PLUMITA EN SALSA 4 QUESOS",
  "PAPAS FRITAS",
  "TOSTONES CON MOJITO VERDE",
  "CROQUETAS DE PLÁTANO",
  "YUCA CON MOJITO",
  "PURÉ DE PAPAS",
  "ENSALADA CÉSAR (SIN POLLO)",
  "ENSALADA CAPRESA",
  "VEGETALES A LA PARRILLA",
  "ENSALADA KANI",
  "ENSALADA MIXTA CON AGUACATE",
  "ENSALADA RALLADA",
  "ENSALADA DE AGUACATE Y TOMATE CHERRY",
  "ENSALADA GALLINA",
  "PLÁTANO DULCE AL HORNO",
];

// TABLA DE PRECIOS POR KILÓMETROS
const calculateDeliveryFee = (km) => {
  if (km <= 1.0) return 1.0;
  if (km <= 2.9) return 2.0;
  if (km <= 8.9) return 3.0;
  if (km <= 14.9) return 4.0;
  if (km <= 16.91) return 5.0;
  if (km <= 18.0) return 6.0;
  return 7.0; // 18.01 km en adelante
};

export default function CartDrawer({
  isOpen,
  onClose,
  cart = [],
  onUpdateQuantity,
  onUpdateContornos,
  orderNotes,
  setOrderNotes,
  deliveryOption,
  setDeliveryOption,
  address,
  setAddress,
  onSendWhatsApp,
  tasaBcv,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [deliveryDistance, setDeliveryDistance] = useState(0);
  const [deliveryCostUSD, setDeliveryCostUSD] = useState(0);

  // Requerimiento 1: Estado con los datos del cliente
  const [customerData, setCustomerData] = useState({
    nombre: "",
    direccion: address || "",
    referencia: "",
    telefono1: "",
    telefono2: "",
    pago: "",
  });

  // Sincronizar dirección prop con customerData.direccion
  useEffect(() => {
    setCustomerData((prev) => ({ ...prev, direccion: address }));
  }, [address]);

  // Manejar cambios en el formulario del cliente
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
    if (name === "direccion") {
      setAddress(value);
    }
  };

  // Manejar selección de contornos por producto
  const handleContornoSelect = (itemId, index, value) => {
    if (onUpdateContornos) {
      onUpdateContornos(itemId, index, value);
    }
  };

  // Cálculo de distancia (Haversine)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return parseFloat(distance.toFixed(2));
  };

  // Buscador de dirección
  useEffect(() => {
    if (!address || address.length < 3 || deliveryOption !== "delivery") {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingAddress(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address,
          )}&countrycodes=ve&limit=5`,
        );
        const data = await response.json();
        setSuggestions(data || []);
      } catch (error) {
        console.error("Error al buscar dirección:", error);
      } finally {
        setIsLoadingAddress(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [address, deliveryOption]);

  if (!isOpen) return null;

  const handleSelectAddress = (item) => {
    setAddress(item.display_name);
    setCustomerData((prev) => ({ ...prev, direccion: item.display_name }));
    setSuggestions([]);

    const clientLat = parseFloat(item.lat);
    const clientLon = parseFloat(item.lon);

    if (clientLat && clientLon) {
      const km = calculateDistance(
        RESTAURANT_LOCATION.lat,
        RESTAURANT_LOCATION.lon,
        clientLat,
        clientLon,
      );
      setDeliveryDistance(km);
      const fee = calculateDeliveryFee(km);
      setDeliveryCostUSD(fee);
    }
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      onUpdateQuantity(item.id, 0);
    }
  };

  // Totales
  const subtotalUSD = cart.reduce((sum, item) => {
    const price = Number(String(item.price).replace(/[^0-9.-]+/g, "")) || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const currentDeliveryFee =
    deliveryOption === "delivery" ? deliveryCostUSD : 0;
  const totalUSD = subtotalUSD + currentDeliveryFee;
  const totalVES = tasaBcv ? totalUSD * tasaBcv : 0;

  // Validación de datos y contornos antes de enviar
  const isFormValid = () => {
    const contornosValidos = cart.every(
      (item) =>
        !item.hasContornos ||
        (item.selectedContornos &&
          item.selectedContornos[0] &&
          item.selectedContornos[1]),
    );

    const camposObligatorios =
      customerData.nombre.trim() !== "" &&
      customerData.telefono1.trim() !== "" &&
      customerData.pago !== "" &&
      (deliveryOption === "pickup" ||
        (customerData.direccion.trim() !== "" &&
          customerData.referencia.trim() !== ""));

    return contornosValidos && camposObligatorios;
  };

  const handleSendOrder = () => {
    if (!isFormValid()) {
      alert(
        "Por favor completa todos los campos obligatorios (*) y la selección de contornos en los platos que aplique.",
      );
      return;
    }

    if (onSendWhatsApp) {
      onSendWhatsApp({
        customerData,
        deliveryDistance,
        deliveryCostUSD: currentDeliveryFee,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 h-full flex flex-col justify-between p-5 border-l border-zinc-800 text-white shadow-2xl relative overflow-y-auto">
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold flex items-center gap-2">
            Tu Pedido
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Productos en Carrito */}
        <div className="flex-1 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <p className="text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-2">
                    <h4 className="text-sm font-semibold text-white">
                      {item.name}
                    </h4>
                    <p className="text-xs text-amber-400 font-bold">
                      $
                      {(
                        Number(String(item.price).replace(/[^0-9.-]+/g, "")) *
                        (item.quantity || 1)
                      ).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-zinc-800 px-2 py-1 rounded-md border border-zinc-700">
                    <button
                      onClick={() => handleDecrement(item)}
                      className="text-zinc-300 hover:text-white font-bold text-base px-2 py-0.5 rounded active:scale-95 transition-transform"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-white min-w-[20px] text-center select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="text-zinc-300 hover:text-white font-bold text-base px-2 py-0.5 rounded active:scale-95 transition-transform"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Requerimiento 2: Seleccionar 2 contornos si el producto lo requiere */}
                {item.hasContornos && (
                  <div className="bg-zinc-950 p-2.5 rounded-lg border border-amber-500/30 text-xs space-y-2">
                    <p className="font-semibold text-amber-400 flex items-center gap-1">
                      Elige tus 2 contornos :
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      <select
                        value={item.selectedContornos?.[0] || ""}
                        onChange={(e) =>
                          handleContornoSelect(item.id, 0, e.target.value)
                        }
                        className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="">-- Contorno 1 * --</option>
                        {OPCIONES_CONTORNOS.map((op) => (
                          <option key={`c1-${op}`} value={op}>
                            {op}
                          </option>
                        ))}
                      </select>

                      <select
                        value={item.selectedContornos?.[1] || ""}
                        onChange={(e) =>
                          handleContornoSelect(item.id, 1, e.target.value)
                        }
                        className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="">-- Contorno 2 * --</option>
                        {OPCIONES_CONTORNOS.map((op) => (
                          <option
                            key={`c2-${op}`}
                            value={op}
                            disabled={op === item.selectedContornos?.[0]}
                          >
                            {op}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Sección Delivery / Dirección */}
        {cart.length > 0 && (
          <div className="space-y-4 border-t border-zinc-800 pt-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Opciones de Entrega:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryOption("delivery")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                    deliveryOption === "delivery"
                      ? "bg-amber-500 text-black border-amber-500"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  Delivery
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryOption("pickup");
                    setDeliveryDistance(0);
                    setDeliveryCostUSD(0);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                    deliveryOption === "pickup"
                      ? "bg-amber-500 text-black border-amber-500"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  Retiro en Local
                </button>
              </div>
            </div>

            {deliveryOption === "delivery" && (
              <div className="space-y-2 relative">
                <label className="block text-xs font-semibold text-zinc-300">
                  📍 Buscar dirección (GPS / Búsqueda):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) =>
                      handleCustomerChange({
                        target: { name: "direccion", value: e.target.value },
                      })
                    }
                    placeholder="Escribe tu zona, edf, calle o av..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 pr-8 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                  {address && (
                    <button
                      type="button"
                      onClick={() => {
                        setAddress("");
                        setCustomerData((prev) => ({ ...prev, direccion: "" }));
                        setSuggestions([]);
                        setDeliveryDistance(0);
                        setDeliveryCostUSD(0);
                      }}
                      className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-white text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {isLoadingAddress && (
                  <p className="text-[10px] text-amber-400 animate-pulse">
                    Buscando dirección...
                  </p>
                )}

                {suggestions.length > 0 && (
                  <ul className="absolute z-50 left-0 right-0 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl mt-1 max-h-48 overflow-y-auto divide-y divide-zinc-800">
                    {suggestions.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectAddress(item)}
                        className="p-2.5 text-xs text-zinc-200 hover:bg-amber-500 hover:text-black cursor-pointer transition-colors"
                      >
                        📍 {item.display_name}
                      </li>
                    ))}
                  </ul>
                )}

                {deliveryDistance > 0 && (
                  <div className="bg-zinc-900 border border-amber-500/40 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex justify-between text-zinc-300">
                      <span>📏 Distancia estimada:</span>
                      <span className="font-bold text-white">
                        {deliveryDistance} km
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>🛵 Tarifa de delivery:</span>
                      <span className="font-bold text-amber-400">
                        ${deliveryCostUSD.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Requerimiento 1: Formulario con Datos del Cliente */}
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg space-y-2.5">
              <p className="text-xs font-bold text-amber-400 text-center">
                Complete los siguientes datos
              </p>

              <input
                type="text"
                name="nombre"
                placeholder="Nombre y Apellido"
                value={customerData.nombre}
                onChange={handleCustomerChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />

              {/* Solo se muestra si el usuario elige Delivery */}
              {deliveryOption === "delivery" && (
                <input
                  type="text"
                  name="referencia"
                  placeholder="Punto de referencia"
                  value={customerData.referencia}
                  onChange={handleCustomerChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              )}

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  name="telefono1"
                  placeholder="Teléfono 1"
                  value={customerData.telefono1}
                  onChange={handleCustomerChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="tel"
                  name="telefono2"
                  placeholder="Teléfono 2"
                  value={customerData.telefono2}
                  onChange={handleCustomerChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                name="pago"
                value={customerData.pago}
                onChange={handleCustomerChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">Forma de pago *</option>
                <option value="Pago Móvil">Pago Móvil</option>
                <option value="Efectivo (Bs)">Efectivo (Bs)</option>
                <option value="Zelle">Zelle</option>
                <option value="Efectivo ($)">Efectivo ($)</option>
                <option value="Paypal">Paypal</option>
                <option value="Mercantil Panamá">Mercantil Panamá</option>
                <option value="Facebank">FaceBank</option>
              </select>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                📝 Observaciones (Quitar ingredientes, etc.):
              </label>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Ej: Sin cebolla..."
                rows="2"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* Desglose Final y Botón */}
        <div className="border-t border-zinc-800 pt-4 mt-4 space-y-2">
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span>Subtotal Productos:</span>
            <span>${subtotalUSD.toFixed(2)}</span>
          </div>

          {deliveryOption === "delivery" && (
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>Envío ({deliveryDistance} km):</span>
              <span className="text-amber-400 font-semibold">
                ${deliveryCostUSD.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm pt-2 border-t border-zinc-800/50">
            <span className="text-zinc-200 font-bold">Total USD:</span>
            <span className="text-amber-400 font-extrabold text-lg">
              ${totalUSD.toFixed(2)}
            </span>
          </div>

          {totalVES > 0 && (
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>Total Estimado (VES):</span>
              <span>Bs. {totalVES.toFixed(2)}</span>
            </div>
          )}

          <button
            disabled={cart.length === 0}
            onClick={handleSendOrder}
            className="w-full py-3.5 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
          >
            <span>💬</span> Pedir o Consultar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
