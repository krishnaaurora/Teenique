import React from "react";
import styled from "styled-components";

type FormData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  house?: string;
  street?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pin?: string;
};

type OrderItem = {
  name: string;
  code?: string;
  size?: string;
  qty: number;
  price: number;
};

type Order = {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
};

const WhatsAppOrderButton: React.FC<{ formData: FormData; order: Order }> = ({ formData, order }) => {
  const handleWhatsAppOrder = () => {
    const phoneNumber = "919866685221"; // country code + number

    const message = `\n🛒 *New Order*\n\n*Contact Information*\nFirst Name: ${formData.firstName || ''}\nLast Name: ${formData.lastName || ''}\nEmail: ${formData.email || ''}\nPhone: ${formData.phone || ''}\n\n*Shipping Address*\nHouse No: ${formData.house || ''}\nStreet: ${formData.street || ''}\nLandmark: ${formData.landmark || ''}\nCity: ${formData.city || ''}\nState: ${formData.state || ''}\nPIN Code: ${formData.pin || ''}\nCountry: India\n\n*Order Summary*\n${order.items.map((item) => `• [${item.code || 'N/A'}] ${item.name} (Size: ${item.size || '-'}) x ${item.qty} – ₹${item.price}`).join("\n")}\n\nSubtotal: ₹${order.subtotal}\nShipping: Free\nTax (GST): ₹${order.tax}\n*Total: ₹${order.total}*\n\nThank you!\n`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <StyledWrapper>
      <button onClick={handleWhatsAppOrder}>Order via WhatsApp</button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    width: 260px;
    height: 60px;
    border: none;
    border-radius: 45px;
    cursor: pointer;
    background: #2563eb;
    color: white;
    font-size: 1.1em;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  button:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
  }
`;

export default WhatsAppOrderButton;
