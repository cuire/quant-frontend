import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import '@/components/MarketHeader/MarketHeader.css';
import deleteIcon from '@/icons/fluent_delete-16-filled.svg';

type CartItem = {
  id: string;
  name: string;
  number: string;
  image: string;
  priceTon: number;
};

export const Route = createFileRoute('/market/cart')({
  component: CartPage,
});

function CartPage() {
  const [items, setItems] = useState<(CartItem & { selected: boolean })[]>([
    {
      id: 'pepe-415',
      name: 'Plush Pepe',
      number: '#415',
      image: 'https://FlowersRestricted.github.io/gifts/5357544985415627799/default.png',
      priceTon: 420,
      selected: true,
    },
    {
      id: 'locket-415',
      name: 'Heart Locket',
      number: '#415',
      image: 'https://FlowersRestricted.github.io/gifts/5170145012310081615/default.png',
      priceTon: 40,
      selected: true,
    },
  ]);

  const total = useMemo(
    () => items.filter(i => i.selected).reduce((sum, i) => sum + i.priceTon, 0),
    [items]
  );

  const toggle = (id: string) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, selected: !i.selected } : i)));
  };

  const removeSelected = () => {
    setItems(prev => prev.filter(i => !i.selected));
  };

  const clearAll = () => setItems([]);

  return (
    <div className="cart-page">
      <div className="cart-header">
        <span className="cart-title">Cart</span>
        <span className="cart-dot" />
        <span className="cart-count">{items.length}</span>
      </div>

      <div className="cart-list">
        {items.map(item => (
          <div key={item.id} className="cart-card">
            <div className="cart-thumb">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="cart-info">
              <div className="cart-name">{item.name}</div>
              <div className="cart-sub">{item.number}</div>
              <div className="cart-price">
                <span className="cart-price-badge">
                  <svg className="market-header__diamond-icon" width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.915 2.31099L6.62167 10.7402C6.5571 10.8426 6.46755 10.9269 6.36145 10.9852C6.25534 11.0435 6.13616 11.0738 6.0151 11.0734C5.89403 11.073 5.77506 11.0418 5.66936 10.9828C5.56366 10.9238 5.4747 10.8388 5.41083 10.736L0.221667 2.30765C0.0765355 2.07125 -0.000196165 1.79922 3.76621e-07 1.52182C0.0065815 1.11219 0.175416 0.721902 0.469449 0.436618C0.763481 0.151334 1.15869 -0.00563721 1.56833 0.000154777H10.5825C11.4433 0.000154777 12.1433 0.679321 12.1433 1.51849C12.1428 1.7988 12.0637 2.07335 11.915 2.31099ZM1.49667 2.02932L5.3575 7.98265V1.42932H1.9C1.5 1.42932 1.32167 1.69349 1.49667 2.02932ZM6.78583 7.98265L10.6467 2.02932C10.825 1.69349 10.6433 1.42932 10.2433 1.42932H6.78583V7.98265Z" fill="white"/>
                  </svg>
                  <span>{item.priceTon} TON</span>
                </span>
              </div>
            </div>
            <div className="cart-actions">
              <button
                className={`cart-check ${item.selected ? 'is-active' : ''}`}
                onClick={() => toggle(item.id)}
                aria-label={item.selected ? 'Deselect' : 'Select'}
              >
                {item.selected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7L9 18L4 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <button className="cart-trash" onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))} aria-label="Remove">
                <img src={deleteIcon} width={16} height={16} alt="" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <button className="cart-primary" disabled={total === 0}>To be paid {total} TON</button>
        <div className="cart-footer-row">
          <button className="cart-clear" onClick={clearAll} disabled={items.length === 0}>Clear Cart</button>
          <button className="cart-remove" onClick={removeSelected} disabled={items.every(i => !i.selected)}>Remove selection</button>
        </div>
      </div>
    </div>
  );
}

