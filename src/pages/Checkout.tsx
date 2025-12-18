import React, { useState, useMemo, useEffect } from 'react';
import './Checkout.css';
import FashionLayout from "@/components/FashionLayout";
import { useCart } from "@/contexts/CartContext";
import { Home, Briefcase, MapPin, Package, Phone, Bell, BellOff, Shield } from 'lucide-react';

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
    saveAddress: false,
    setDefault: false
  });

  const [focusedFields, setFocusedFields] = useState({});

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
    message += `Save Address: ${formData.saveAddress ? 'Yes' : 'No'}\n`;
    message += `Set as Default: ${formData.setDefault ? 'Yes' : 'No'}\n\n`;

    // Order Summary
    message += `Order Summary:\n`;
    cart.forEach(item => {
      message += `${item.name} - Size: ${item.size} - Qty: ${item.quantity} - ₹${item.price}\n`;
    });
    message += `\nTotal Items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}\n`;

    return encodeURIComponent(message);
  }, [formData, cart]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'deliveryInstructions') {
        setFormData(prev => ({
          ...prev,
          deliveryInstructions: checked
            ? [...prev.deliveryInstructions, value]
            : prev.deliveryInstructions.filter(item => item !== value)
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName) => {
    setFocusedFields(prev => ({ ...prev, [fieldName]: false }));
  };

  const isFieldFilled = (fieldName) => {
    return formData[fieldName] && formData[fieldName].toString().trim() !== '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission handled via WhatsApp
  };

  return (
    <FashionLayout>
      <div className="checkout">
        <div className="checkout-grid">
          {/* Left Side: Contact Information and Shipping Address */}
          <div className="checkout-left">
            {/* Contact Information */}
            <div className="card">
              <div className={`section-title ${isContactInfoComplete ? 'completed' : ''}`}>
                <div className="section-step">1</div>
                <h3>Contact Information</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className={`floating-label ${isFieldFilled('firstName') || focusedFields.firstName ? 'floated' : ''}`}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      onFocus={() => handleFocus('firstName')}
                      onBlur={() => handleBlur('firstName')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className={`floating-label ${isFieldFilled('lastName') || focusedFields.lastName ? 'floated' : ''}`}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      onFocus={() => handleFocus('lastName')}
                      onBlur={() => handleBlur('lastName')}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className={`floating-label ${isFieldFilled('email') || focusedFields.email ? 'floated' : ''}`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                    required
                  />
                  <div className="helper-text">We'll send order updates to this email</div>
                </div>
                <div className="form-group">
                  <label className={`floating-label ${isFieldFilled('phone') || focusedFields.phone ? 'floated' : ''}`}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => handleFocus('phone')}
                    onBlur={() => handleBlur('phone')}
                    required
                  />
                  <div className="helper-text">For delivery updates and order confirmation</div>
                </div>
              </form>
            </div>

            {/* Shipping Address */}
            <div className="card">
              <div className={`section-title ${isShippingAddressComplete ? 'completed' : ''}`}>
                <div className="section-step">2</div>
                <h3>Shipping Address</h3>
              </div>
              <div className="form-group">
                <label className={`floating-label ${isFieldFilled('flat') || focusedFields.flat ? 'floated' : ''}`}>
                  Flat / House No *
                </label>
                <input
                  type="text"
                  name="flat"
                  value={formData.flat}
                  onChange={handleChange}
                  onFocus={() => handleFocus('flat')}
                  onBlur={() => handleBlur('flat')}
                  required
                />
              </div>
              <div className="form-group">
                <label className={`floating-label ${isFieldFilled('street') || focusedFields.street ? 'floated' : ''}`}>
                  Street / Area *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  onFocus={() => handleFocus('street')}
                  onBlur={() => handleBlur('street')}
                  required
                />
              </div>
              <div className="form-group">
                <label className={`floating-label ${isFieldFilled('landmark') || focusedFields.landmark ? 'floated' : ''}`}>
                  Landmark (optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  onFocus={() => handleFocus('landmark')}
                  onBlur={() => handleBlur('landmark')}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className={`floating-label ${isFieldFilled('city') || focusedFields.city ? 'floated' : ''}`}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onFocus={() => handleFocus('city')}
                    onBlur={() => handleBlur('city')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className={`floating-label ${isFieldFilled('state') || focusedFields.state ? 'floated' : ''}`}>
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    onFocus={() => handleFocus('state')}
                    onBlur={() => handleBlur('state')}
                    required
                  >
                    <option value="">Select State</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    {/* Add more states */}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className={`floating-label ${isFieldFilled('pincode') || focusedFields.pincode ? 'floated' : ''}`}>
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    onFocus={() => handleFocus('pincode')}
                    onBlur={() => handleBlur('pincode')}
                    required
                  />
                  <div className="helper-text">For accurate delivery</div>
                </div>
                <div className="form-group">
                  <label className="floating-label floated">Country</label>
                  <input
                    type="text"
                    value="India"
                    disabled
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Address Type</label>
                <div className="pill-group">
                  <button
                    type="button"
                    className={`pill ${formData.addressType === 'Home' ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, addressType: 'Home' }))}
                  >
                    <Home size={16} />
                    Home
                  </button>
                  <button
                    type="button"
                    className={`pill ${formData.addressType === 'Work' ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, addressType: 'Work' }))}
                  >
                    <Briefcase size={16} />
                    Work
                  </button>
                  <button
                    type="button"
                    className={`pill ${formData.addressType === 'Other' ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, addressType: 'Other' }))}
                  >
                    <MapPin size={16} />
                    Other
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Delivery Instructions</label>
                <div className="checkbox-group">
                  <div
                    className={`checkbox-item ${formData.deliveryInstructions.includes('Leave at door') ? 'active' : ''}`}
                    onClick={() => {
                      const value = 'Leave at door';
                      const checked = !formData.deliveryInstructions.includes(value);
                      handleChange({
                        target: { name: 'deliveryInstructions', value, type: 'checkbox', checked }
                      });
                    }}
                  >
                    <input
                      type="checkbox"
                      name="deliveryInstructions"
                      value="Leave at door"
                      checked={formData.deliveryInstructions.includes('Leave at door')}
                      onChange={handleChange}
                    />
                    <div className="checkbox-icon">
                      {formData.deliveryInstructions.includes('Leave at door') && '✓'}
                    </div>
                    <Package size={16} />
                    <span className="checkbox-label">Leave at door</span>
                  </div>
                  <div
                    className={`checkbox-item ${formData.deliveryInstructions.includes('Call before delivery') ? 'active' : ''}`}
                    onClick={() => {
                      const value = 'Call before delivery';
                      const checked = !formData.deliveryInstructions.includes(value);
                      handleChange({
                        target: { name: 'deliveryInstructions', value, type: 'checkbox', checked }
                      });
                    }}
                  >
                    <input
                      type="checkbox"
                      name="deliveryInstructions"
                      value="Call before delivery"
                      checked={formData.deliveryInstructions.includes('Call before delivery')}
                      onChange={handleChange}
                    />
                    <div className="checkbox-icon">
                      {formData.deliveryInstructions.includes('Call before delivery') && '✓'}
                    </div>
                    <Phone size={16} />
                    <span className="checkbox-label">Call before delivery</span>
                  </div>
                  <div
                    className={`checkbox-item ${formData.deliveryInstructions.includes("Don't ring bell") ? 'active' : ''}`}
                    onClick={() => {
                      const value = "Don't ring bell";
                      const checked = !formData.deliveryInstructions.includes(value);
                      handleChange({
                        target: { name: 'deliveryInstructions', value, type: 'checkbox', checked }
                      });
                    }}
                  >
                    <input
                      type="checkbox"
                      name="deliveryInstructions"
                      value="Don't ring bell"
                      checked={formData.deliveryInstructions.includes("Don't ring bell")}
                      onChange={handleChange}
                    />
                    <div className="checkbox-icon">
                      {formData.deliveryInstructions.includes("Don't ring bell") && '✓'}
                    </div>
                    <BellOff size={16} />
                    <span className="checkbox-label">Don't ring bell</span>
                  </div>
                  <div
                    className={`checkbox-item ${formData.deliveryInstructions.includes('Security gate instructions') ? 'active' : ''}`}
                    onClick={() => {
                      const value = 'Security gate instructions';
                      const checked = !formData.deliveryInstructions.includes(value);
                      handleChange({
                        target: { name: 'deliveryInstructions', value, type: 'checkbox', checked }
                      });
                    }}
                  >
                    <input
                      type="checkbox"
                      name="deliveryInstructions"
                      value="Security gate instructions"
                      checked={formData.deliveryInstructions.includes('Security gate instructions')}
                      onChange={handleChange}
                    />
                    <div className="checkbox-icon">
                      {formData.deliveryInstructions.includes('Security gate instructions') && '✓'}
                    </div>
                    <Shield size={16} />
                    <span className="checkbox-label">Security gate instructions</span>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="saveAddress"
                    checked={formData.saveAddress}
                    onChange={handleChange}
                  />
                  Save this address
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="setDefault"
                    checked={formData.setDefault}
                    onChange={handleChange}
                  />
                  Set as default address
                </label>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="checkout-right">
            {/* Order Summary */}
            <div className="card">
              <h3>Order Summary</h3>
              {cart.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="order-details">
                    <h4>{item.name}</h4>
                    <span>Size: {item.size}</span>
                    <span>₹{item.price}</span>
                  </div>
                  <div className="qty">
                    <button>-</button>
                    <span>{item.quantity}</span>
                    <button>+</button>
                  </div>
                </div>
              ))}
              <div className="delivery-box">
                <strong>Estimated delivery: Sun, 21 Dec – Tue, 23 Dec</strong><br />
                Ships within 24 hours
              </div>
            </div>

            {/* Pricing Details */}
            <div className="card">
              <div className="promo">
                <input type="text" placeholder="Promo code" />
                <button>Apply</button>
              </div>
              <a href="#" style={{ fontSize: '12px', color: 'var(--primary)' }}>View available offers</a>
              <div className="price-row">
                <span>Subtotal</span>
                <span>₹1,299</span>
              </div>
              <div className="price-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="price-row">
                <span>Tax (GST included)</span>
                <span>₹130</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>₹1,429</span>
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <a href={`https://wa.me/919866685221?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                Send Order on WhatsApp
              </a>
              <div className="trust">
                <span>🔒 Secure Checkout</span>
                <span>💰 Cash on Delivery</span>
                <span>↩️ Easy Returns</span>
                <span>⭐ 4.8+ Customer Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FashionLayout>
  );
};

export default Checkout;

