import { createFileRoute } from '@tanstack/react-router';
import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { useUserActivityInfinite, useGifts } from '@/lib/api-hooks';
import { createPortal } from 'react-dom';
import { ActivityGroup } from '@/components/ActivityGroup';
import { Activity } from '@/lib/api';
import './activity.css';
import { Link } from '@/components/Link/Link';

export const Route = createFileRoute('/storage/activity')({
  component: ActivityPage,
  validateSearch: (search: Record<string, unknown>) => ({
    page: (search.page as number) || 1,
    limit: (search.limit as number) || 20,
    gift_id: (search.gift_id as string[]) || [],
    type: (search.type as 'fast' | 'waiting') || undefined,
    sort_by: (search.sort_by as 'date_new_to_old' | 'date_old_to_new' | 'price_low_to_high' | 'price_high_to_low' | 'price_per_unit' | 'quantity_low_to_high' | 'quantity_high_to_low') || 'date_new_to_old',
    min_price: (search.min_price as string) || undefined,
    max_price: (search.max_price as string) || undefined,
    min_qty: (search.min_qty as string) || undefined,
    max_qty: (search.max_qty as string) || undefined,
  }),
});

function ActivityPage() {
  const { data: giftsData } = useGifts();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useUserActivityInfinite(20);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  
  const [selected, setSelected] = useState<null | {
    title: string;
    giftNumber: string;
    price: number;
    items: { id: string; name: string; icon: string; quantity: number }[];
    holdTime?: string;
  }>(null);

  // Add shimmer animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% {
          left: -100%;
        }
        100% {
          left: 100%;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Intersection Observer for infinite scroll
  useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px',
    });
    
    if (node && observerRef.current) {
      observerRef.current.observe(node);
    }
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Extract activities from all pages
  const activities = data?.pages.flatMap(page => page.activities) || [];
  
  // Filter and group activities
  const filteredAndGroupedActivities = useMemo(() => {
    const grouped = activities.reduce((groups: Record<string, Activity[]>, activity: Activity) => {
      const date = new Date(activity.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
      return groups;
    }, {} as Record<string, Activity[]>);
    
    return Object.entries(grouped).map(([date, activities]) => ({
      date,
      activities: (activities as Activity[]).sort((a: Activity, b: Activity) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }));
  }, [activities, giftsData]);


  // Helper function to get gift name by ID
  const getGiftNameById = (giftId: string) => {
    const gift = giftsData?.find(g => g.id === giftId);
    return gift ? (gift.full_name || gift.short_name) : 'Unknown Gift';
  };

  // Helper function to get gift icon by ID
  const getGiftIconById = (giftId: string) => {
    return `https://FlowersRestricted.github.io/gifts/${giftId}/default.png`;
  };

  // Handle activity item click
  const handleActivityClick = (activity: Activity) => {
    // Create items array from gifts_data
    let items: { id: string; name: string; icon: string; quantity: number }[] = [];
    if (activity.gifts_data) {
      items = Object.entries(activity.gifts_data).map(([giftId, quantity]) => ({
        id: giftId,
        name: getGiftNameById(giftId),
        icon: getGiftIconById(giftId),
        quantity: quantity as number,
      }));
    }
     
    if (items.length > 0) {
      setSelected({ 
        title: getGiftNameById(String(activity.gift_id)), 
        giftNumber: `#${activity.channel_id}`, 
        price: activity.amount, 
        items: items
      });
    }
  };

  if (error) {
    return (
      <>
        <div className="px-4 py-6">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold mb-2">Error loading activity</h3>
            <p className="text-gray-400">{error?.message || 'Something went wrong'}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="storage-tabs">
        <div className="storage-segment">
          <Link to="/storage/channels" className="storage-tab-link">
            Channels
          </Link>
          <Link to="/storage/offers/received" className="storage-tab-link">
            Offers
          </Link>
          <Link to="/storage/activity" className="storage-tab-link is-active">
            Activity
          </Link>
        </div>
      </div>

      {/* Activity Content */}
      <div className="activity-content">
        {/* Loading state */}
        {isLoading && activities.length === 0 ? (
          <div className="activity-list">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="activity-item" style={{ opacity: 0.7 }}>
                <div className="activity-icon" style={{ backgroundColor: '#2A3541', borderRadius: '8px', width: '40px', height: '40px' }}></div>
                <div className="activity-main">
                  <div className="activity-title-row">
                    <div className="activity-title" style={{ backgroundColor: '#2A3541', height: '16px', width: '120px', borderRadius: '4px' }}></div>
                  </div>
                  <div className="activity-sub" style={{ backgroundColor: '#2A3541', height: '12px', width: '80px', borderRadius: '4px', marginTop: '4px' }}></div>
                </div>
                <div className="activity-center">
                  <span className="activity-badge activity-badge--purchase" style={{ backgroundColor: '#2A3541', color: 'transparent' }}>Loading</span>
                </div>
                <div className="activity-right">
                  <div className="activity-price" style={{ backgroundColor: '#2A3541', height: '16px', width: '60px', borderRadius: '4px' }}></div>
                  <div className="activity-time" style={{ backgroundColor: '#2A3541', height: '12px', width: '80px', borderRadius: '4px', marginTop: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Activity List */}
            {filteredAndGroupedActivities.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-semibold mb-2">No activity found</h3>
                <p className="text-gray-400">Your activity history will appear here</p>
              </div>
            ) : (
              <>
                {filteredAndGroupedActivities.map((group) => (
                  <ActivityGroup
                    key={group.date}
                    date={group.date}
                    activities={group.activities}
                    giftNameById={getGiftNameById}
                    giftIconById={getGiftIconById}
                    onActivityClick={handleActivityClick}
                  />
                ))}

                {/* Loading indicator for next page */}
                {isFetchingNextPage && (
                  <div className="activity-list">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={`loading-${index}`} className="activity-item" style={{ opacity: 0.7 }}>
                        <div className="activity-icon" style={{ backgroundColor: '#2A3541', borderRadius: '8px', width: '40px', height: '40px' }}></div>
                        <div className="activity-main">
                          <div className="activity-title-row">
                            <div className="activity-title" style={{ backgroundColor: '#2A3541', height: '16px', width: '120px', borderRadius: '4px' }}></div>
                          </div>
                          <div className="activity-sub" style={{ backgroundColor: '#2A3541', height: '12px', width: '80px', borderRadius: '4px', marginTop: '4px' }}></div>
                        </div>
                        <div className="activity-center">
                          <span className="activity-badge activity-badge--purchase" style={{ backgroundColor: '#2A3541', color: 'transparent' }}>Loading</span>
                        </div>
                        <div className="activity-right">
                          <div className="activity-price" style={{ backgroundColor: '#2A3541', height: '16px', width: '60px', borderRadius: '4px' }}></div>
                          <div className="activity-time" style={{ backgroundColor: '#2A3541', height: '12px', width: '80px', borderRadius: '4px', marginTop: '4px' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {selected && createPortal(
        <div className="market-header__sheet-overlay" onClick={() => setSelected(null)}>
          <div className="market-header__sheet" onClick={(e) => e.stopPropagation()}>
            <div className="product-sheet__header">
              <div className="product-sheet__gallery">
                {(() => {
                  const count = selected.items.length;
                  const gridClass = count === 1 ? 'single' : count === 2 ? 'double' : count === 3 ? 'triple' : 'multiple';
                  const visible = gridClass === 'multiple' ? selected.items.slice(0, 4) : selected.items.slice(0, count);
                  return (
                    <div className={`product-sheet__grid product-sheet__grid--${gridClass}`}>
                      {visible.map((it) => (
                        <div className="product-sheet__cell" key={it.id}>
                          <img src={it.icon} alt={it.name} />
                          <span className="product-sheet__q">x{it.quantity}</span>
                        </div>
                      ))}
                      {count > 4 && (
                        <div className="product-sheet__more-badge">+{count - 4} more</div>
                      )}
                    </div>
                  );
                })()}
              </div>
              <button className="product-sheet__close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="product-sheet__title">
              <div className="product-sheet__name">{selected.title}</div>
              <div className="product-sheet__num">{selected.giftNumber}</div>
            </div>
              
              {selected.holdTime && (
                <div className="product-sheet__title-hold-time">
                  <span className="product-sheet__hold-time-label">Time to unhold:</span>
                  <span className="product-sheet__hold-time-value">{selected.holdTime}<div className="product-sheet__hold-time-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div></span>
                </div>
              )}
              
            
            
            <div className="product-sheet__list">
              {selected.items.map((it) => (
                <div key={it.id} className="product-sheet__row">
                  <div className="product-sheet__row-icon"><img src={it.icon} alt={it.name} /></div>
                  <div className="product-sheet__row-main">
                    <div className="product-sheet__row-title">{it.name}</div>
                    <div className="product-sheet__row-note">Quantity: {it.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="product-sheet__actions">
              <button className="product-sheet__btn" type="button">Share Channel</button>
              <button className="product-sheet__btn product-sheet__btn--primary" type="button">Open Channel</button>
            </div>
          </div>
        </div>, document.body)}
    </>
  );
}