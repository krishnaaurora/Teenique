import React, { useState, useMemo, useEffect } from 'react';
import './Checkout.css';
import FashionLayout from "@/components/FashionLayout";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { useCart } from "@/contexts/CartContext";
import { Home, Briefcase, MapPin, Package, Phone, Bell, BellOff, Shield } from 'lucide-react';
import OrderSummary from '@/components/checkout/OrderSummary';
import WhatsAppOrderButton from '@/components/checkout/WhatsAppOrderButton';

const Checkout = () => {
  const { cart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    flat: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'Home',
    deliveryInstructions: [],
    // removed saveAddress and setDefault per UI change
  });

  const [focusedFields, setFocusedFields] = useState({});

  const handleChange = (e: React.ChangeEvent<any>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, type } = target as HTMLInputElement;
    let value: any = (target as HTMLInputElement).value;
    if (type === 'checkbox') value = (target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFocus = (field: string) => {
    setFocusedFields(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setFocusedFields(prev => ({ ...prev, [field]: false }));
  };

  // Form validation (for section completion indicators)
  const isContactInfoComplete = formData.firstName && formData.lastName && formData.email && formData.phone;
  const isShippingAddressComplete = formData.flat && formData.street && formData.city && formData.state && formData.pincode;

  const whatsappMessage = useMemo(() => {
    let message = "New Order:\n\n";

    // Contact Info
    message += `Contact Information:\n`;
    message += `Name: ${formData.firstName} ${formData.lastName}\n`;
    message += `Email: ${formData.email}\n`;
    message += `Phone: ${formData.phone}\n\n`;

    // Shipping Address
    message += `Shipping Address:\n`;
    message += `Flat/House: ${formData.flat}\n`;
    message += `Street/Area: ${formData.street}\n`;
    if (formData.landmark) message += `Landmark: ${formData.landmark}\n`;
    message += `City: ${formData.city}\n`;
    message += `State: ${formData.state}\n`;
    message += `PIN Code: ${formData.pincode}\n`;
    message += `Country: India\n`;
    message += `Address Type: ${formData.addressType}\n`;
    if (formData.deliveryInstructions.length > 0) {
      message += `Delivery Instructions: ${formData.deliveryInstructions.join(', ')}\n`;
    }
    // saveAddress and setDefault removed from payload

    // Order Summary
    message += `Order Summary:\n`;
    cart.forEach(item => {
      message += `${item.name} - Size: ${item.size} - Qty: ${item.quantity} - ₹${item.price}\n`;
    });
    message += `\nTotal Items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}\n`;

    return encodeURIComponent(message);
  }, [formData, cart]);

  const order = {
    items: cart.map((item) => ({ name: item.name, code: item.code, size: item.size, qty: item.quantity, price: item.price })),
    subtotal: cart.reduce((sum, it) => sum + it.price * it.quantity, 0),
    tax: 130,
    total: cart.reduce((sum, it) => sum + it.price * it.quantity, 0) + 130,
  };

  return (
    <FashionLayout>
      <div className="checkout">
        <div className="checkout-grid">

          {/* Left Side: Contact Information and Shipping Address (now using CheckoutForm) */}
          <div className="checkout-left">
            <CheckoutForm formData={formData} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
          </div>

          {/* Right Side: Order Summary (component) */}
          <div className="checkout-right">
            <OrderSummary />
            <div className="card">
              <WhatsAppOrderButton formData={formData} order={order} />
            </div>
          </div>
        </div>
      </div>
    </FashionLayout>
  );
};

export default Checkout;

