import { useState } from 'react';
import { STANDS, FOOD_CATEGORIES } from '../../data/mockMenu';
import { useApp } from '../../context/useApp';
import { getWaitLevel, getWaitBarWidth } from '../../data/mockCrowd';

function MenuModal({ stand, onClose, onAddToCart }) {
  const [addedIds, setAddedIds] = useState([]);

  const handleAdd = (item) => {
    onAddToCart(item);
    setAddedIds(prev => [...prev, item.id]);
    setTimeout(() => setAddedIds(prev => prev.filter(id => id !== item.id)), 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{stand.icon} {stand.name}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>📍 {stand.location}</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {stand.items.map(item => {
          const added = addedIds.includes(item.id);
          return (
            <div key={item.id} className="menu-item">
              <span className="menu-item-emoji">{item.emoji}</span>
              <div className="menu-item-info">
                <div className="menu-item-name">
                  {item.name}
                  {item.veg && (
                    <span style={{ marginLeft: '6px', display: 'inline-flex', alignItems: 'center', width: '14px', height: '14px', border: '1.5px solid #10B981', borderRadius: '2px', justifyContent: 'center' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'block' }} />
                    </span>
                  )}
                </div>
                <div className="menu-item-desc">{item.desc}</div>
              </div>
              <span className="menu-item-price">₹{item.price}</span>
              <button
                className="add-btn"
                onClick={() => handleAdd(item)}
                style={{ background: added ? 'var(--success)' : 'var(--primary)', transition: 'all 0.2s' }}
              >
                {added ? '✓' : '+'}
              </button>
            </div>
          );
        })}

        <div style={{ height: '20px' }} />
      </div>
    </div>
  );
}

function OrderTracker({ order }) {
  const steps = [
    { label: 'Received', icon: '📋' },
    { label: 'Preparing', icon: '👨‍🍳' },
    { label: 'Ready', icon: '✅' },
    { label: 'Delivered', icon: '🎉' },
  ];

  return (
    <div className="order-tracker" style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
          🛍️ Order {order.id}
        </span>
        <span style={{ fontSize: '0.8125rem', color: 'var(--success)', fontWeight: '700' }}>
          ₹{order.total}
        </span>
      </div>

      <div className="order-steps">
        {steps.map((step, i) => {
          const status = i < order.status ? 'done' : i === order.status ? 'active' : 'pending';
          return (
            <div key={step.label} className={`order-step ${status}`}>
              {i < steps.length - 1 && <div className={`order-step-line ${status === 'done' ? 'done' : ''}`} />}
              <div className="order-step-dot">
                {status === 'done' ? '✓' : step.icon}
              </div>
              <span className="order-step-label">{step.label}</span>
            </div>
          );
        })}
      </div>

      {order.status === 2 && (
        <div style={{ textAlign: 'center', marginTop: '8px', fontWeight: '700', color: 'var(--success)', fontSize: '0.875rem', animation: 'pulse-dot 1.5s ease-in-out infinite' }}>
          🎉 Your order is ready for pickup!
        </div>
      )}
      {order.status === 3 && (
        <div style={{ textAlign: 'center', marginTop: '8px', fontWeight: '700', color: 'var(--success)', fontSize: '0.875rem' }}>
          ✅ Delivered to your seat!
        </div>
      )}
    </div>
  );
}

export default function FoodStands() {
  const { state, dispatch } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedStand, setSelectedStand] = useState(null);
  const [showCart, setShowCart] = useState(false);

  const filteredStands = activeCategory === 'All'
    ? STANDS
    : STANDS.filter(s => s.category === activeCategory);

  const handleAddToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', item });
  };

  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{ paddingBottom: '16px' }}>
      {/* Active Order Tracker */}
      {state.activeOrder && (
        <div style={{ padding: '16px 16px 0' }}>
          <OrderTracker order={state.activeOrder} />
        </div>
      )}

      {/* Category filter */}
      <div style={{ padding: '16px 0 8px' }}>
        <div className="food-categories">
          {FOOD_CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`food-cat-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stands */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredStands.map(stand => {
          const wait = state.liveWaitTimes[stand.id] ?? stand.baseWait;
          const level = getWaitLevel(wait);
          const barW = getWaitBarWidth(wait);

          return (
            <div
              key={stand.id}
              className="stand-card"
              onClick={() => setSelectedStand(stand)}
            >
              <div className="stand-card-header">
                <div className="stand-icon" style={{
                  background: level === 'low' ? 'var(--success-light)' :
                    level === 'medium' ? 'var(--warning-light)' : 'var(--danger-light)',
                }}>
                  {stand.icon}
                </div>
                <div className="stand-info">
                  <div className="stand-name">{stand.name}</div>
                  <div className="stand-category">📍 {stand.location}</div>
                </div>
                <span className={`status-badge ${level === 'low' ? 'green' : level === 'medium' ? 'yellow' : 'red'}`}>
                  <span className="status-dot" />
                  {wait} min
                </span>
              </div>

              <div className="stand-wait-row">
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', minWidth: '60px' }}>Queue:</span>
                <div className="wait-bar-wrap">
                  <div className={`wait-bar ${level}`} style={{ width: `${barW}%` }} />
                </div>
                <span className={`wait-time-label ${level}`}>{wait} min wait</span>
              </div>

              <div className="stand-items-preview" style={{ marginTop: '10px' }}>
                {stand.items.slice(0, 3).map(item => (
                  <span key={item.id} className="stand-item-tag">{item.emoji} {item.name}</span>
                ))}
                <span className="stand-item-tag">+{stand.items.length - 3} more</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart FAB */}
      {cartCount > 0 && !showCart && (
        <button className="cart-fab" onClick={() => setShowCart(true)}>
          <span>🛒</span>
          <span>{cartCount} item{cartCount > 1 ? 's' : ''} · ₹{cartTotal}</span>
          <span className="cart-count">{cartCount}</span>
        </button>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="modal-overlay" onClick={() => setShowCart(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>🛒 Your Cart</div>
              <button className="modal-close-btn" onClick={() => setShowCart(false)}>✕</button>
            </div>

            <div style={{ padding: '0 20px' }}>
              {state.cart.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9375rem' }}>{item.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>₹{item.price} × {item.qty}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_FROM_CART', id: item.id })}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >−</button>
                    <span style={{ fontWeight: '700', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                    <button
                      onClick={() => dispatch({ type: 'ADD_TO_CART', item })}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >+</button>
                  </div>
                  <span style={{ fontWeight: '800', minWidth: '50px', textAlign: 'right' }}>₹{item.price * item.qty}</span>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 8px', fontWeight: '800', fontSize: '1.1rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>₹{cartTotal}</span>
              </div>

              <div style={{ padding: '4px 0 8px', fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🚀</span> Estimated delivery: 15–20 min to your seat
              </div>

              <button
                className="btn-primary"
                style={{ marginBottom: '16px' }}
                onClick={() => {
                  dispatch({ type: 'PLACE_ORDER' });
                  setShowCart(false);
                }}
              >
                Place Order · ₹{cartTotal}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Modal */}
      {selectedStand && (
        <MenuModal
          stand={selectedStand}
          onClose={() => setSelectedStand(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
