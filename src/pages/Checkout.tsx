import React, { useState, useEffect } from 'react';
import qrImage from '@/assets/SCANNERjpeg.jpeg';
import { useCart } from '@/contexts/CartContext';
import { MessageCircle, Minus, Plus } from 'lucide-react';
import FashionLayout from '@/components/FashionLayout';
import { products } from '@/data/products';
import './Checkout.css';

// Step 1: Get location (with permission) - Enhanced for better accuracy
function getUserLocation() {
  return new Promise((resolve, reject) => {
    // First attempt with high accuracy
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
      },
      (error) => {
        // If high accuracy fails, try with lower accuracy as fallback
        console.log('High accuracy location failed:', error.message);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy
            });
          },
          () => reject(),
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 60000
          }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  });
}

const Checkout = () => {

  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();
  const [formData, setFormData] = useState({
    country: 'India',
    firstName: '',
    lastName: '',
    address: '',
    postalCode: '',
    city: '',
    phone: '',
    email: '',
    newsletter: false,
    paymentOption: '',
    utr: '',
  });
  const [cartLocked, setCartLocked] = useState(false);
  const [lockedCart, setLockedCart] = useState([]);
  const [lockedTotal, setLockedTotal] = useState(0);
  const [orderId, setOrderId] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  // Get user location when component mounts for better accuracy
  useEffect(() => {
    getUserLocation()
      .then((location) => {
        setUserLocation(location);
      })
      .catch(() => {
        // Silently fail - location will be attempted again on order placement
      });
  }, []);

  const subtotal = cartLocked ? lockedTotal : cartTotal;
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

  // Generate unique order ID
  const generateOrderId = () => {
    return 'ODR' + Date.now().toString(36).toUpperCase().slice(-8);
  };

  // Lock cart and amount
  const handleCheckout = () => {
    setCartLocked(true);
    setLockedCart([...cart]);
    setLockedTotal(cartTotal);
    setOrderId(generateOrderId());
  };


  const handlePlaceOrder = () => {
    // Only allow if cart is locked and payment is selected
    if (!cartLocked || !formData.paymentOption) return;
    if (formData.paymentOption === 'qr' && !formData.utr) {
      alert('Please enter UTR / Transaction ID for UPI payment.');
      return;
    }

    // Build message synchronously first
    let message = `🛒 New Order\n\n`;
    message += `Order ID: ${orderId}\n`;
    message += `Name: ${formData.firstName} ${formData.lastName}\n`;
    message += `Email: ${formData.email}\n`;
    message += `Phone: ${formData.phone}\n\n`;

    message += `Address:\n`;
    message += `${formData.address}\n`;
    message += `${formData.city} - ${formData.postalCode}\n`;
    message += `${formData.country}\n\n`;

    message += `Order Items:\n`;
    lockedCart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      const productCode = product?.code || 'N/A';
      message += `- ${item.name} (${item.color || 'N/A'}) - Code: ${productCode} × ${item.quantity} – ₹${(item.price * item.quantity).toLocaleString('en-IN')}\n`;
    });

    message += `\nSubtotal: ₹${lockedTotal.toLocaleString('en-IN')}\n`;
    message += `Total: ₹${lockedTotal.toLocaleString('en-IN')}\n`;
    message += `Payment Method: ${formData.paymentOption === 'qr' ? 'UPI QR' : 'Cash on Delivery'}\n`;
    if (formData.paymentOption === 'qr') {
      message += `UTR/Transaction ID: ${formData.utr}\n`;
    }

    // Try to get location (use stored location or fetch fresh one)
    const getLocationForOrder = async () => {
      // If we have a stored location, use it, otherwise get fresh location
      if (userLocation) {
        return userLocation;
      } else {
        return await getUserLocation();
      }
    };

    getLocationForOrder().then(({ lat, lng, accuracy }) => {
      const locationLine = `📍 Location: https://www.google.com/maps?q=${lat},${lng} (Accuracy: ~${Math.round(accuracy)}m)`;
      const finalMessage = `\n🛒 New Order\n\n${message}\n${locationLine}\n`;
      const url = `https://wa.me/+919866685221?text=${encodeURIComponent(finalMessage)}`;
      window.open(url, "_blank");
    }).catch(() => {
      // If location fails, send without location
      const finalMessage = `\n🛒 New Order\n\n${message}\n📍 Location: Not shared\n`;
      const url = `https://wa.me/+919866685221?text=${encodeURIComponent(finalMessage)}`;
      window.open(url, "_blank");
    });
  };

  const isFormValid = formData.firstName && formData.lastName && formData.address &&
                     formData.postalCode && formData.city && formData.phone && formData.email &&
                     cartLocked && formData.paymentOption &&
                     (formData.paymentOption === 'cod' || (formData.paymentOption === 'qr' && formData.utr));

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
              {/* Payment Option Tab */}
              <div className="form-group payment-tab" style={{ marginTop: 32 }}>
                <h2 className="form-title">Payment Options</h2>
                <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="radio"
                      name="paymentOption"
                      value="qr"
                      checked={formData.paymentOption === 'qr'}
                      onChange={handleInputChange}
                      disabled={!cartLocked}
                    />
                    UPI QR Payment
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="radio"
                      name="paymentOption"
                      value="cod"
                      checked={formData.paymentOption === 'cod'}
                      onChange={handleInputChange}
                      disabled={!cartLocked}
                    />
                    Cash on Delivery
                  </label>
                </div>
                {!cartLocked && (
                  <button className="place-order-btn" style={{ marginTop: 16 }} onClick={handleCheckout} disabled={cartLocked}>
                    Lock Cart & Continue to Payment
                  </button>
                )}
                {cartLocked && formData.paymentOption === 'qr' && (
                  <div style={{ marginTop: 16 }}>
                    <img src={qrImage} alt="QR Code" style={{ width: 180, height: 180, border: '1px solid #eee', borderRadius: 8 }} />
                    <div style={{ fontSize: 14, color: '#888', marginTop: 8 }}>Scan to pay</div>
                    <a
                      href={`upi://pay?pa=YOUR_UPI_ID@upi&pn=Teenique&am=${lockedTotal}&cu=INR`}
                      style={{ display: 'block', marginTop: 8, color: '#007bff', textDecoration: 'underline', fontSize: 15 }}
                    >
                      Pay using UPI App
                    </a>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2, marginBottom: 8 }}>( you can open payment app only from mobile )</div>
                    <div style={{ marginTop: 12 }}>
                      <label style={{ fontWeight: 500 }}>Enter UTR / Transaction ID:</label>
                      <input
                        type="text"
                        name="utr"
                        value={formData.utr || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter UTR / Transaction ID"
                        style={{ marginTop: 4, width: 220 }}
                      />
                      <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>( enter the id after payment to place order )</div>
                    </div>
                  </div>
                )}
                {cartLocked && formData.paymentOption === 'cod' && (
                  <div style={{ marginTop: 16, color: '#444', fontSize: 15 }}>
                    You have selected <b>Cash on Delivery</b>. No advance payment required.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="checkout-right">
            <div className="shopping-cart">
              <h2 className="cart-title">Shopping Cart</h2>
              <div className="cart-items">
                {(cartLocked ? lockedCart : cart).map((item) => (
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
                      <div className="cart-item-quantity-controls">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.id, item.quantity - 1, item.color, item.size);
                            } else {
                              removeFromCart(item.id, item.color, item.size);
                            }
                          }}
                          className="quantity-btn"
                          title="Decrease quantity"
                          disabled={cartLocked}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.color, item.size)}
                          className="quantity-btn"
                          title="Increase quantity"
                          disabled={cartLocked}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-actions">
                      <div className="cart-item-price">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={!isFormValid}
                style={{ marginTop: 16 }}
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

