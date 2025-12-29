import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { MessageCircle, Minus } from 'lucide-react';
import FashionLayout from '@/components/FashionLayout';
import { products } from '@/data/products';
import './Checkout.css';

// Step 1: Get location (with permission)
function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => reject(),
      { enableHighAccuracy: true }
    );
  });
}

const Checkout = () => {
  const { cart, cartTotal, removeFromCart } = useCart();
  const [formData, setFormData] = useState({
    country: 'India',
    firstName: '',
    lastName: '',
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    email: '',
    newsletter: false
  });

  const subtotal = cartTotal;
  const shipping = 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlaceOrder = async () => {
    let message = `🛒 New Order\n\n`;
    message += `Name: ${formData.firstName} ${formData.lastName}\n`;
    message += `Email: ${formData.email}\n`;
    message += `Phone: ${formData.phone}\n\n`;

    message += `Address:\n`;
    message += `${formData.address}\n`;
    message += `${formData.city} - ${formData.postalCode}\n`;
    message += `${formData.country}\n\n`;

    message += `Order Items:\n`;
    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      const productCode = product?.code || 'N/A';
      message += `- ${item.name} (${item.color || 'N/A'}) - Code: ${productCode} × ${item.quantity} – ₹${(item.price * item.quantity).toLocaleString('en-IN')}\n`;
    });

    message += `\nSubtotal: ₹${subtotal.toLocaleString('en-IN')}\n`;
    message += `Shipping: ₹${shipping.toLocaleString('en-IN')}\n`;
    message += `Discount: ₹${discount.toLocaleString('en-IN')}\n`;
    message += `Total: ₹${total.toLocaleString('en-IN')}\n`;

    // Step 2: WhatsApp order handler (THIS IS THE KEY PART)
    let locationLine = "📍 Location: Not shared";

    try {
      const { lat, lng } = await getUserLocation();
      locationLine = `📍 Location: https://www.google.com/maps?q=${lat},${lng}`;
    } catch {
      // user denied location → continue without it
    }

    // 👇 MERGE EVERYTHING INTO ONE MESSAGE
    const finalMessage = `
🛒 New Order

${message}

${locationLine}
`;

    const url = `https://wa.me/+919866685221?text=${encodeURIComponent(finalMessage)}`;
    window.open(url, "_blank");
  };

  const isFormValid = formData.firstName && formData.lastName && formData.address &&
                     formData.postalCode && formData.city && formData.phone && formData.email;

  return (
    <FashionLayout>
      <div className="checkout-container">
        <div className="checkout-grid">
          <div className="checkout-left">
            <div className="contact-form">
              <h1 className="form-title">Contact Information</h1>

              <div className="form-group">
                <label className="form-label">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="India">India</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="John"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Street address, apartment, etc."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="400001"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Mumbai"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleInputChange}
                    className="checkbox-input"
                  />
                  <span className="checkmark"></span>
                  Email me with news and offers
                </label>
              </div>
            </div>
          </div>

          <div className="checkout-right">
            <div className="shopping-cart">
              <h2 className="cart-title">Shopping Cart</h2>
              <p className="cart-subtitle">You have {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart.</p>

              <div className="cart-items">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.color}-${item.size}`} className="cart-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-variant">
                        Code: {(() => {
                          const product = products.find(p => p.id === item.id);
                          return product?.code || 'N/A';
                        })()}
                        {item.color && ` • Color: ${item.color}`}
                        {item.size && ` • Size: ${item.size}`}
                      </p>
                      <p className="cart-item-quantity">x{item.quantity}</p>
                    </div>
                    <div className="cart-item-actions">
                      <button
                        onClick={() => removeFromCart(item.id, item.color, item.size)}
                        className="remove-item-btn"
                        title="Remove item"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="cart-item-price">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping Cost</span>
                  <span>₹{shipping.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={!isFormValid}
              >
                <MessageCircle className="w-5 h-5" />
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </FashionLayout>
  );
};

export default Checkout;

