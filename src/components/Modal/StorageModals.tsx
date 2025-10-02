import { useState } from 'react';
import './Modal.css';
import { config } from '@/lib/config';

type SellModalProps = {
    itemName: string;
    shouldShowDuration?: boolean;
    floorPrice?: number;

    type?: 'channel' | 'gift';
    defaultPrice?: number;

    changePrice?: boolean;


    onClose: () => void;
    onSubmit: (amount: number, duration?: number) => void;
}

export const SellModal = ({ itemName, defaultPrice, shouldShowDuration = true, changePrice = false, floorPrice = 891, onClose, onSubmit, type='channel' }: SellModalProps) => {
    const [price, setPrice] = useState<string>(defaultPrice ? defaultPrice.toString() : '');
    const [duration, setDuration] = useState<1 | 3 | 5 | 8>(1);
    const [isLoading, setIsLoading] = useState(false);

    const priceNum = Number(price);
    const serviceFee = config.commissionRate;
    const youWillReceive = priceNum > 0 ? priceNum * (1 - serviceFee) : 0;

    const isValid = priceNum > 0 && priceNum >= floorPrice;

    const handleSubmit = async () => {
        if (!isValid || isLoading) return;
        
        setIsLoading(true);
        try {
            await onSubmit(priceNum, shouldShowDuration ? duration : undefined);
            onClose();
        } catch (error) {
            console.error('Failed to create sell offer:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="offer-modal">
            <div className="offer-modal__header">
                <div className="offer-modal__title">{changePrice ? 'Change Price' : `Sell ${type === 'channel' ? 'Channel' : 'Gift'}`} {itemName}</div>
                <button className="offer-modal__close" type="button" onClick={onClose}>✕</button>
            </div>

            <div className="offer-modal__block">
                <div className="offer-modal__label">PRICE IN TON</div>
                <input 
                    className="offer-modal__input" 
                    type="number"
                    placeholder="Enter price" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
                    <div className="offer-modal__balance">
                        You will receive: <span style={{color:'#2F82C7'}}>{youWillReceive.toFixed(2)} TON</span>
                    </div>
                    <div className="offer-modal__balance">
                        Floor price: <span style={{color:'#7F94AE'}}>{floorPrice} TON</span>
                    </div>
                </div>
            </div>

            {shouldShowDuration && (
                <div className="offer-modal__block">
                    <div className="offer-modal__label">DURATION</div>
                    <div className="sell-modal__duration-slider">
                        <input
                            type="range"
                            min="0"
                            max="3"
                            step="1"
                            value={[1, 3, 5, 8].indexOf(duration)}
                            onChange={(e) => {
                                const values = [1, 3, 5, 8];
                                setDuration(values[Number(e.target.value)] as 1 | 3 | 5 | 8);
                            }}
                            className="sell-modal__slider-input"
                        />
                        <div className="sell-modal__slider-marks">
                            <span className={duration === 1 ? 'is-active' : ''}>1h</span>
                            <span className={duration === 3 ? 'is-active' : ''}>3h</span>
                            <span className={duration === 5 ? 'is-active' : ''}>5h</span>
                            <span className={duration === 8 ? 'is-active' : ''}>8h</span>
                        </div>
                    </div>
                    <div className="offer-modal__balance" style={{ marginTop: '8px' }}>
                        You can choose how much time you want to spend on the channel.
                    </div>
                </div>
            )}

            <button 
                className="offer-modal__submit" 
                type="button" 
                onClick={handleSubmit}
                disabled={isLoading || !isValid}
            >
                {isLoading ? 'Processing...' : changePrice ? 'Change Price' : `Sell ${type === 'channel' ? 'Channel' : 'Gift'}`}
            </button>
        </div>
    );
};

