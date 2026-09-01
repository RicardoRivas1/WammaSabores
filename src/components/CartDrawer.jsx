import React, { useState } from "react";

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
  "OTROS",
];

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
  onSendWhatsApp,
  tasaBcv,
}) {
  const [customInputs, setCustomInputs] = useState({});

  // Estado con los datos del cliente
  const [customerData, setCustomerData] = useState({
    nombre: "",
    referencia: "",
    telefono1: "",
    telefono2: "",
    pago: "",
  });

  // Manejar cambios en el formulario del cliente
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContornoSelect = (cartItemId, index, value) => {
    if (onUpdateContornos) {
      if (value === "OTROS") {
        const customText = customInputs[cartItemId]?.[index] || "";
        onUpdateContornos(cartItemId, index, value, customText);
      } else {
        onUpdateContornos(cartItemId, index, value);
      }
    }
  };

  const handleCustomTextChange = (cartItemId, index, text) => {
    setCustomInputs((prev) => ({
      ...prev,
      [cartItemId]: {
        ...(prev[cartItemId] || {}),
        [index]: text,
      },
    }));
    if (onUpdateContornos) {
      onUpdateContornos(cartItemId, index, "OTROS", text);
    }
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.cartItemId, item.quantity - 1);
    } else {
      onUpdateQuantity(item.cartItemId, 0);
    }
  };

  if (!isOpen) return null;

  // Totales
  const subtotalUSD = cart.reduce((sum, item) => {
    const price = Number(String(item.price).replace(/[^0-9.-]+/g, "")) || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const totalUSD = subtotalUSD;
  const totalVES = tasaBcv ? totalUSD * tasaBcv : 0;

  // Validación de datos y contornos
  const isFormValid = () => {
    const contornosValidos = cart.every((item) => {
      if (!item.hasContornos) return true;
      if (!item.selectedContornos) return false;
      return item.selectedContornos.every((c, i) => {
        if (!c) return false;
        if (c === "OTROS") {
          return customInputs[item.cartItemId]?.[i]?.trim() !== "";
        }
        return true;
      });
    });

    const camposObligatorios =
      customerData.nombre.trim() !== "" &&
      customerData.telefono1.trim() !== "" &&
      customerData.pago !== "" &&
      (deliveryOption === "pickup" || customerData.referencia.trim() !== "");

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
                key={item.cartItemId}
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
                        onUpdateQuantity(item.cartItemId, item.quantity + 1)
                      }
                      className="text-zinc-300 hover:text-white font-bold text-base px-2 py-0.5 rounded active:scale-95 transition-transform"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Seleccionar 2 contornos */}
                {item.hasContornos && (
                  <div className="bg-zinc-950 p-2.5 rounded-lg border border-amber-500/30 text-xs space-y-2">
                    <p className="font-semibold text-amber-400 flex items-center gap-1">
                      Elige tus 2 contornos :
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <select
                          value={item.selectedContornos?.[0] || ""}
                          onChange={(e) =>
                            handleContornoSelect(
                              item.cartItemId,
                              0,
                              e.target.value,
                            )
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
                        {item.selectedContornos?.[0] === "OTROS" && (
                          <input
                            type="text"
                            value={customInputs[item.cartItemId]?.[0] || ""}
                            onChange={(e) =>
                              handleCustomTextChange(
                                item.cartItemId,
                                0,
                                e.target.value,
                              )
                            }
                            placeholder="Escribe tus contornos personalizados..."
                            className="w-full mt-1 bg-zinc-900 border border-amber-500/50 rounded p-2 text-white text-xs focus:outline-none focus:border-amber-500 placeholder-zinc-500"
                          />
                        )}
                      </div>

                      <div>
                        <select
                          value={item.selectedContornos?.[1] || ""}
                          onChange={(e) =>
                            handleContornoSelect(
                              item.cartItemId,
                              1,
                              e.target.value,
                            )
                          }
                          className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white text-xs focus:outline-none focus:border-amber-500"
                        >
                          <option value="">-- Contorno 2 * --</option>
                          {OPCIONES_CONTORNOS.map((op) => (
                            <option
                              key={`c2-${op}`}
                              value={op}
                              disabled={
                                op === item.selectedContornos?.[0] &&
                                op !== "OTROS"
                              }
                            >
                              {op}
                            </option>
                          ))}
                        </select>
                        {item.selectedContornos?.[1] === "OTROS" && (
                          <input
                            type="text"
                            value={customInputs[item.cartItemId]?.[1] || ""}
                            onChange={(e) =>
                              handleCustomTextChange(
                                item.cartItemId,
                                1,
                                e.target.value,
                              )
                            }
                            placeholder="Escribe tus contornos personalizados..."
                            className="w-full mt-1 bg-zinc-900 border border-amber-500/50 rounded p-2 text-white text-xs focus:outline-none focus:border-amber-500 placeholder-zinc-500"
                          />
                        )}
                      </div>
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
                  onClick={() => setDeliveryOption("pickup")}
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

            {/* NOTA INFORMATIVA DE DELIVERY */}
            {deliveryOption === "delivery" && (
              <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl flex items-start gap-2 text-xs text-amber-200/90 mt-2">
                <span className="text-amber-400 text-base leading-none">
                  ⚠️
                </span>
                <p>
                  <strong className="text-amber-400 font-bold">Nota:</strong> El
                  costo del delivery es estimado. Si la dirección se encuentra
                  en una parte alta o zona de difícil acceso, la tarifa final
                  puede variar al confirmar por WhatsApp.
                </p>
              </div>
            )}

            {/* Formulario con Datos del Cliente */}
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg space-y-2.5">
              <p className="text-xs font-bold text-amber-400 text-center">
                Complete los siguientes datos
              </p>

              <input
                type="text"
                name="nombre"
                placeholder="Nombre y Apellido *"
                value={customerData.nombre}
                onChange={handleCustomerChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />

              {deliveryOption === "delivery" && (
                <input
                  type="text"
                  name="referencia"
                  placeholder="Dirección / Punto de referencia *"
                  value={customerData.referencia}
                  onChange={handleCustomerChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              )}

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  name="telefono1"
                  placeholder="Teléfono 1 *"
                  value={customerData.telefono1}
                  onChange={handleCustomerChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="tel"
                  name="telefono2"
                  placeholder="Teléfono 2 (Opcional)"
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
                <option value="Transferencia">Transferencia</option>
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
            className="w-full py-3.5 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            <span>💬</span> Pedir o Consultar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
