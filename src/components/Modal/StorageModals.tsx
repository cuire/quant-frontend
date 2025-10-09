import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Modal.css';
import { config } from '@/lib/config';
import { useTransferGift, useReceiveGift } from '@/lib/api-hooks';
import { useToast } from '@/hooks/useToast';

type SellModalProps = {
    itemId: string;
    itemName: string;
    shouldShowDuration?: boolean;
    floorPrice?: number;

    type?: 'channel' | 'gift';
    defaultPrice?: number;

    changePrice?: boolean;


    onClose: () => void;
    onSubmit: (id: string, amount: number, duration?: number) => void;
}

export const SellModal = ({ itemId, itemName, defaultPrice, shouldShowDuration = true, changePrice = false, floorPrice = 891, onClose, onSubmit, type='channel' }: SellModalProps) => {
    const { t } = useTranslation();
    const [price, setPrice] = useState<string>(defaultPrice ? defaultPrice.toString() : '');
    const [duration, setDuration] = useState<1 | 3 | 5 | 8>(1);
    const [isLoading, setIsLoading] = useState(false);

    const priceNum = Number(price);
    const serviceFee = config.commissionRate;
    const youWillReceive = priceNum > 0 ? priceNum * (1 - serviceFee) : 0;

    const isValid = priceNum > 0;

    const handleSubmit = async () => {
        if (!isValid || isLoading) return;
        
        setIsLoading(true);
        try {
            await onSubmit(itemId, priceNum, shouldShowDuration ? duration : undefined);
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
                <div className="offer-modal__title">
                    {changePrice 
                        ? t('modalsStorage.changePrice') 
                        : (type === 'channel' ? t('modalsStorage.sellChannel') : t('modalsStorage.sellGift'))
                    } {itemName}
                </div>
                <button className="offer-modal__close" type="button" onClick={onClose}>✕</button>
            </div>

            <div className="offer-modal__block">
                <div className="offer-modal__label">{t('modalsStorage.priceInTon')}</div>
                <input 
                    className="offer-modal__input" 
                    type="number"
                    placeholder={t('modalsStorage.enterPrice')}
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
                    <div className="offer-modal__balance">
                        {t('modalsStorage.youWillReceive')} <span style={{color:'#2F82C7'}}>{youWillReceive.toFixed(2)} TON</span>
                    </div>
                    <div className="offer-modal__balance">
                        {t('modalsStorage.floorPrice')} <span style={{color:'#7F94AE'}}>{floorPrice} TON</span>
                    </div>
                </div>
            </div>

            {shouldShowDuration && (
                <div className="offer-modal__block">
                    <div className="offer-modal__label">{t('modalsStorage.duration')}</div>
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
                        {t('modalsStorage.durationNote')}
                    </div>
                </div>
            )}

            <button 
                className="offer-modal__submit" 
                type="button" 
                onClick={handleSubmit}
                disabled={isLoading || !isValid}
            >
                {isLoading 
                    ? t('modalsStorage.sending') 
                    : changePrice 
                        ? t('modalsStorage.changePrice') 
                        : (type === 'channel' ? t('modalsStorage.sellChannel') : t('modalsStorage.sellGift'))
                }
            </button>
        </div>
    );
};

type SendGiftModalProps = {
    giftId: string;
    giftName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const SendGiftModal = ({ giftId, giftName, onClose, onSuccess }: SendGiftModalProps) => {
    const { t } = useTranslation();
    const [username, setUsername] = useState<string>('');
    const transferGiftMutation = useTransferGift();
    const { success: showSuccessToast, warning: showErrorToast } = useToast();

    const isValid = username.trim().length > 0;

    const handleSubmit = async () => {
        if (!isValid || transferGiftMutation.isPending) return;
        
        try {
            await transferGiftMutation.mutateAsync({
                giftId,
                userIdOrUsername: username.trim()
            });
            showSuccessToast({ message: t('modalsStorage.giftSentSuccess') });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to send gift:', error);
            const errorMessage = (error as any)?.message || t('modalsStorage.giftSentFailed');
            showErrorToast({ message: errorMessage });
        }
    };

    return (
        <div className="offer-modal">
            <div className="offer-modal__header">
                <div className="offer-modal__title">{t('modalsStorage.sendGift')} {giftName}</div>
                <button className="offer-modal__close" type="button" onClick={onClose}>✕</button>
            </div>

            <div className="offer-modal__block">
                <div className="offer-modal__label">{t('modalsStorage.enterUsernameOrId')}</div>
                <div style={{ position: 'relative' }}>
                    <span style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#7F94AE',
                        fontSize: '16px',
                        pointerEvents: 'none'
                    }}>@</span>
                    <input 
                        className="offer-modal__input" 
                        type="text"
                        placeholder={t('modalsStorage.usernamePlaceholder')}
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ paddingLeft: '24px' }}
                    />
                </div>
                <div className="offer-modal__balance" style={{ marginTop: '8px' }}>
                    {t('modalsStorage.botWillRedirect')}
                </div>
            </div>

            <button 
                className="offer-modal__submit" 
                type="button" 
                onClick={handleSubmit}
                disabled={transferGiftMutation.isPending || !isValid}
            >
                {transferGiftMutation.isPending ? t('modalsStorage.sending') : t('modalsStorage.sendOneGift')}
            </button>
        </div>
    );
};

type ReceiveGiftModalProps = {
    giftId: string;
    giftName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const ReceiveGiftModal = ({ giftId, giftName, onClose, onSuccess }: ReceiveGiftModalProps) => {
    const { t } = useTranslation();
    const receiveGiftMutation = useReceiveGift();
    const { success: showSuccessToast, warning: showErrorToast } = useToast();

    const handleReceive = async () => {
        if (receiveGiftMutation.isPending) return;
        
        try {
            console.log(`Receiving gift ${giftName} (ID: ${giftId})`);
            
            await receiveGiftMutation.mutateAsync(giftId);
            
            showSuccessToast({ message: t('modalsStorage.giftReceivedSuccess') });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to receive gift:', error);
            const errorMessage = (error as any)?.message || t('modalsStorage.giftReceivedFailed');
            showErrorToast({ message: errorMessage });
        }
    };

    return (
        <div className="offer-modal">
            <div className="offer-modal__header">
                <div className="offer-modal__title">{t('modalsStorage.receiveGift')}</div>
                <button className="offer-modal__close" type="button" onClick={onClose}>✕</button>
            </div>

            <div className="offer-modal__block">
                <div className="offer-modal__balance" style={{ marginBottom: '16px' }}>
                    {t('modalsStorage.receiveConfirm')} <span style={{color:'#2F82C7'}}>0.1 TON</span>)
                </div>
                
                <div className="offer-modal__label">{t('modalsStorage.withdrawalFee')}</div>
                <div style={{
                    backgroundColor: '#344150',
                    border: '1px solid #4A5568',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '500'
                }}>
                    0.01 TON
                </div>
            </div>

            <div className="product-sheet__actions" style={{ padding: '12px 0 0 0px', borderTop: 0 }}>
                <button 
                    className="product-sheet__btn" 
                    type="button" 
                    onClick={onClose}
                    disabled={receiveGiftMutation.isPending}
                >
                    {t('modalsStorage.xClose')}
                </button>
                <button 
                    className="product-sheet__btn product-sheet__btn--primary" 
                    type="button" 
                    onClick={handleReceive}
                    disabled={receiveGiftMutation.isPending}
                >
                    {receiveGiftMutation.isPending ? t('modalsStorage.receiving') : t('modalsStorage.receive')}
                </button>
            </div>
        </div>
    );
};

