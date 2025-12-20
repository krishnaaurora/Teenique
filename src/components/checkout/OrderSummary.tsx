import React, { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '@/contexts/CartContext';

const OrderSummary: React.FC = () => {
  const { cart, updateQuantity, cartTotal } = useCart();

  const subtotal = cartTotal;
  const tax = 130; // keep the fixed tax amount for parity with previous UI
  const total = subtotal + tax;

  return (
    <StyledWrapper>
      <div className="order-summary">
        <h2 className="title">Order Summary</h2>

        <div className="products">
          {cart.map((product) => (
            <div key={`${product.id}-${product.color || ''}-${product.size || ''}`} className="product-item">
              <img src={product.image} alt={product.name} className="product-img" />
              <div className="product-details">
                <p className="name">{product.name} <span className="code">#{product.code}</span></p>
                <p className="size">Size: {product.size}</p>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
                <div className="quantity">
                  <button onClick={() => updateQuantity(product.id, product.quantity - 1, product.color, product.size)}>-</button>
                  <span>{product.quantity}</span>
                  <button onClick={() => updateQuantity(product.id, product.quantity + 1, product.color, product.size)}>+</button>
                </div>
                <CopyCode code={product.code} />
              </div>
            </div>
          ))}
        </div>

        <div className="delivery">
          <strong>Estimated delivery:</strong> Sun, 21 Dec – Tue, 23 Dec
          <br />
          <span>Ships within 24 hours</span>
        </div>

        <div className="promo-section">
          <p className="promo-label">Promo code</p>
          <button className="view-offers">View available offers</button>
        </div>

        <div className="pricing">
          <div className="row">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="row">
            <span>Tax (GST included)</span>
            <span>₹{tax}</span>
          </div>
          <div className="total-row">
            <span>Total</span>
            <span className="total-amount">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  .order-summary {
    width: 360px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    padding-bottom: 16px;
    transition: transform 200ms ease, box-shadow 200ms ease;

    /* lift-over effect on hover/focus */
    &:hover,
    &:focus-within {
      transform: translateY(-8px);
      box-shadow: 0 18px 40px rgba(0,0,0,0.16);
    }
  }

  .title {
    padding: 16px 20px;
    font-size: 18px;
    font-weight: 600;
    background: #f9f9f9;
    border-bottom: 1px solid #eee;
    margin: 0;
  }

  .products {
    padding: 16px 12px;
    /* make the products list vertically scrollable with a larger viewport */
    max-height: 360px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 12px;
  }

  .product-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    width: 100%;
    background: transparent;
    border-bottom: 1px solid #eee;
  }

  .product-item:last-child {
    border-bottom: none;
  }

  /* vertical scrollbar styling */
  .products::-webkit-scrollbar {
    width: 8px;
  }
  .products::-webkit-scrollbar-track {
    background: transparent;
  }
  .products::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.12);
    border-radius: 999px;
  }

  .product-img {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    background: #eee;
  }

  .product-details .name {
    font-weight: 500;
    font-size: 14px;
    margin: 0 0 4px 0;
  }

  .product-details .size {
    font-size: 13px;
    color: #666;
    margin: 0;
  }

  .code {
    font-size: 12px;
    color: #6b7280;
    margin-left: 8px;
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 6px;
    font-weight: 500;
  }

  .copy-btn {
    background: none;
    border: 1px solid #ddd;
    padding: 4px 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
  }

  .quantity {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 16px;
    font-weight: 600;
  }

  .quantity button {
    width: 28px;
    height: 28px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 6px;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .delivery {
    background: #e6f7ee;
    padding: 12px 20px;
    margin: 16px 20px;
    border-radius: 12px;
    font-size: 14px;
    color: #155724;
    text-align: center;
  }

  .delivery span {
    font-size: 13px;
    color: #0f5132;
  }

  .promo-section {
    padding: 0 20px;
    margin-bottom: 16px;
  }

  .promo-label {
    font-size: 14px;
    color: #666;
    margin: 0 0 8px 0;
  }

  .view-offers {
    background: none;
    border: none;
    color: #007bff;
    font-size: 14px;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
  }

  .pricing {
    padding: 0 20px;
    font-size: 15px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    color: #333;
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    padding: 16px 0 8px;
    border-top: 1px solid #eee;
    font-size: 18px;
    font-weight: 600;
  }

  .total-amount {
    font-weight: 700;
    color: #000;
  }
`;

export default OrderSummary;

const CopyCode: React.FC<{ code?: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);
  if (!code) return null;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // fallback
      const el = document.createElement('textarea');
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  return (
    <button className="copy-btn" onClick={handleCopy}>{copied ? 'Copied' : 'Copy code'}</button>
  );
};
