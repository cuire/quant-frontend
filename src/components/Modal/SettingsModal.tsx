import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { copyTextToClipboard, initData } from "@telegram-apps/sdk-react";
import { useUser, useUpdateLanguage, useUpdateTheme, useUpdateSetting } from '@/lib/api-hooks';
import zh from '@/assets/flags/zh.png';
import ru from '@/assets/flags/ru.png';
import en from '@/assets/flags/en.png';
import './SettingsModal.css';
import { config } from '@/lib/config';

export interface SettingsModalProps {
  onClose: () => void;
}

const getLanguage = (language: string) => {
  switch (language) {
    case 'en':
      return 'EN';
    case 'ru':
      return 'RU';
    case 'zh':
      return 'ZH';
    default:
      return 'EN';
  }
}

const getThemeFromBackend = (theme: string) => {
  switch (theme) {
    case 'light':
      return 'WHITE';
    case 'dark':
      return 'DARK';
    case 'system':
      return 'SYSTEM';
    default:
      return 'DARK';
  }
}

const getThemeForBackend = (theme: string) => {
  switch (theme) {
    case 'WHITE':
      return 'light';
    case 'DARK':
      return 'dark';
    case 'SYSTEM':
      return 'system';
    default:
      return 'dark';
  }
}

const getLanguageForBackend = (language: string) => {
  switch (language) {
    case 'EN':
      return 'en';
    case 'RU':
      return 'ru';
    case 'ZH':
      return 'zh';
    default:
      return 'en';
  }
}

export const SettingsModal: FC<SettingsModalProps> = ({ onClose }) => {
  const user = useUser();
  const updateLanguageMutation = useUpdateLanguage();
  const updateThemeMutation = useUpdateTheme();
  const updateSettingMutation = useUpdateSetting();

  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'RU' | 'ZH'>('EN');
  const [selectedTheme, setSelectedTheme] = useState<'WHITE' | 'SYSTEM' | 'DARK'>('DARK');
  const [notificationsEnabled, setNotificationsEnabled] = useState(!!user.data?.offers_notifications);

  // Initialize state from user data when available
  useEffect(() => {
    if (user?.data) {
      setSelectedLanguage(getLanguage(user.data.lang || 'en'));
      setSelectedTheme(getThemeFromBackend(user.data.theme || 'dark'));
      if (typeof user.data.offers_notifications === 'boolean') {
        setNotificationsEnabled(user.data.offers_notifications);
      }
    }
  }, [user?.data]);

  const handleLanguageChange = (language: 'EN' | 'RU' | 'ZH') => {
    setSelectedLanguage(language);
    updateLanguageMutation.mutate(getLanguageForBackend(language));
  };

  const handleThemeChange = (theme: 'WHITE' | 'SYSTEM' | 'DARK') => {
    setSelectedTheme(theme);
    updateThemeMutation.mutate(getThemeForBackend(theme));
  };

  return (
    <div className="market-header__sheet">

      <div className="market-header__sheet-header">
        <div>
          <div className="market-header__sheet-title"          
           onClick={() => copyTextToClipboard(initData.restore() == undefined ? initData.raw?.() || '' : '')}
          >Settings privacy</div>
        </div>
        <button 
          className="market-header__sheet-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="market-header__sheet-content">
        {/* Language Section */}
        <div className="market-header__panel">
          <div className="market-header__row">
            <div className="market-header__row-main">
              <div className="settings-modal__section-title">LANGUAGE</div>
            </div>
          </div>
            <div className="settings-modal__button-group">
              <button 
                className={`settings-modal__option-button ${selectedLanguage === 'EN' ? 'settings-modal__option-button--active' : ''}`}
                onClick={() => handleLanguageChange('EN')}
              >
                <div className="settings-modal__flag-container">
                  <img src={en} alt="US Flag" className="settings-modal__flag" />
                </div>
                <span>EN</span>
              </button>
              <button 
                className={`settings-modal__option-button ${selectedLanguage === 'RU' ? 'settings-modal__option-button--active' : ''}`}
                onClick={() => handleLanguageChange('RU')}
              >
                <div className="settings-modal__flag-container">
                  <img src={ru} alt="Russian Flag" className="settings-modal__flag" />
                </div>
                <span>RU</span>
              </button>
              <button 
                className={`settings-modal__option-button ${selectedLanguage === 'ZH' ? 'settings-modal__option-button--active' : ''}`}
                onClick={() => handleLanguageChange('ZH')}
              >
                <div className="settings-modal__flag-container">
                  <img src={zh} alt="Chinese Flag" className="settings-modal__flag" />
                </div>
                <span>ZH</span>
              </button>
            </div>
          </div>

          {/* Theme Section */}
          <div className="market-header__panel">
            <div className="market-header__row">
              <div className="market-header__row-main">
                <div className="settings-modal__section-title">THEME</div>
              </div>
            </div>
                <div className="settings-modal__button-group">
                  <button
                    className={`settings-modal__option-button ${selectedTheme === 'WHITE' ? 'settings-modal__option-button--active' : ''}`}
                    onClick={() => handleThemeChange('WHITE')}
                  >
                    <div className="settings-modal__icon-container">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9.5C6.12246 9.50002 6.24066 9.54498 6.33218 9.62636C6.4237 9.70774 6.48217 9.81987 6.4965 9.9415L6.5 10V10.5C6.49985 10.6274 6.45106 10.75 6.36357 10.8427C6.27609 10.9354 6.15652 10.9911 6.0293 10.9986C5.90208 11.0061 5.77681 10.9647 5.67908 10.8829C5.58135 10.8011 5.51855 10.685 5.5035 10.5585L5.5 10.5V10C5.5 9.86739 5.55267 9.74021 5.64644 9.64645C5.74021 9.55268 5.86739 9.5 6 9.5ZM9.1565 8.455L9.2035 8.4965L9.5535 8.8465C9.64317 8.93648 9.69523 9.05722 9.69911 9.18419C9.70299 9.31117 9.65839 9.43486 9.57437 9.53014C9.49035 9.62542 9.37322 9.68515 9.24676 9.6972C9.1203 9.70925 8.99399 9.67271 8.8935 9.595L8.8465 9.5535L8.4965 9.2035C8.41021 9.11737 8.35837 9.00268 8.35073 8.881C8.34308 8.75933 8.38015 8.63905 8.45497 8.54279C8.52979 8.44653 8.6372 8.38093 8.757 8.35831C8.8768 8.3357 9.00074 8.35764 9.1055 8.42L9.1565 8.455ZM3.5035 8.4965C3.58958 8.5826 3.6413 8.69715 3.64894 8.81866C3.65658 8.94017 3.61962 9.0603 3.545 9.1565L3.5035 9.2035L3.1535 9.5535C3.06352 9.64317 2.94278 9.69524 2.8158 9.69911C2.68883 9.70299 2.56514 9.65839 2.46986 9.57438C2.37457 9.49036 2.31484 9.37322 2.3028 9.24676C2.29075 9.1203 2.32729 8.994 2.405 8.8935L2.4465 8.8465L2.7965 8.4965C2.89026 8.40276 3.01741 8.35011 3.15 8.35011C3.28258 8.35011 3.40973 8.40276 3.5035 8.4965ZM2 5.5C2.12744 5.50014 2.25001 5.54894 2.34268 5.63642C2.43535 5.72391 2.49111 5.84348 2.49858 5.9707C2.50605 6.09792 2.46466 6.22319 2.38286 6.32092C2.30107 6.41864 2.18504 6.48145 2.0585 6.4965L2 6.5H1.5C1.37256 6.49986 1.24998 6.45106 1.15731 6.36358C1.06464 6.27609 1.00888 6.15652 1.00141 6.0293C0.993941 5.90208 1.03533 5.77681 1.11713 5.67908C1.19892 5.58136 1.31495 5.51855 1.4415 5.5035L1.5 5.5H2ZM10.5 5.5C10.6274 5.50014 10.75 5.54894 10.8427 5.63642C10.9353 5.72391 10.9911 5.84348 10.9986 5.9707C11.006 6.09792 10.9647 6.22319 10.8829 6.32092C10.8011 6.41864 10.685 6.48145 10.5585 6.4965L10.5 6.5H10C9.87256 6.49986 9.74998 6.45106 9.65731 6.36358C9.56464 6.27609 9.50888 6.15652 9.50141 6.0293C9.49394 5.90208 9.53533 5.77681 9.61713 5.67908C9.69892 5.58136 9.81495 5.51855 9.94149 5.5035L10 5.5H10.5ZM3.1065 2.405L3.1535 2.4465L3.5035 2.7965C3.59317 2.88648 3.64523 3.00722 3.64911 3.13419C3.65299 3.26117 3.60839 3.38486 3.52437 3.48014C3.44035 3.57542 3.32322 3.63515 3.19676 3.6472C3.0703 3.65925 2.94399 3.62271 2.8435 3.545L2.7965 3.5035L2.4465 3.1535C2.36054 3.06734 2.30896 2.95279 2.30143 2.83132C2.2939 2.70985 2.33093 2.5898 2.40558 2.49368C2.48023 2.39756 2.58737 2.33196 2.70693 2.3092C2.82648 2.28643 2.95024 2.30805 3.055 2.37L3.1065 2.405ZM9.5535 2.4465C9.63958 2.5326 9.6913 2.64715 9.69894 2.76866C9.70658 2.89017 9.66962 3.0103 9.595 3.1065L9.5535 3.1535L9.2035 3.5035C9.11352 3.59317 8.99278 3.64524 8.8658 3.64911C8.73883 3.65299 8.61514 3.60839 8.51986 3.52438C8.42457 3.44036 8.36484 3.32322 8.3528 3.19676C8.34075 3.0703 8.37729 2.944 8.455 2.8435L8.4965 2.7965L8.8465 2.4465C8.94026 2.35276 9.06741 2.30011 9.2 2.30011C9.33258 2.30011 9.45973 2.35276 9.5535 2.4465ZM6 1C6.12246 1.00002 6.24066 1.04498 6.33218 1.12636C6.4237 1.20774 6.48217 1.31987 6.4965 1.4415L6.5 1.5V2C6.49985 2.12744 6.45106 2.25002 6.36357 2.34268C6.27609 2.43535 6.15652 2.49112 6.0293 2.49859C5.90208 2.50605 5.77681 2.46466 5.67908 2.38287C5.58135 2.30107 5.51855 2.18505 5.5035 2.0585L5.5 2V1.5C5.5 1.36739 5.55267 1.24021 5.64644 1.14645C5.74021 1.05268 5.86739 1 6 1ZM6 3.5C6.48983 3.49997 6.96889 3.64384 7.37766 3.91375C7.78643 4.18365 8.1069 4.5677 8.29928 5.01818C8.49165 5.46866 8.54745 5.96573 8.45973 6.44766C8.37202 6.92958 8.14467 7.37511 7.80591 7.72893C7.46715 8.08274 7.03192 8.32924 6.55426 8.43782C6.07661 8.54639 5.57758 8.51225 5.11916 8.33963C4.66075 8.16702 4.26314 7.86354 3.97572 7.46688C3.68831 7.07023 3.52375 6.59788 3.5025 6.1085L3.5 6L3.5025 5.8915C3.53046 5.24788 3.8058 4.63989 4.27111 4.19433C4.73641 3.74877 5.35576 3.50004 6 3.5Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span>WHITE</span>
                  </button>
                  <button
                    className={`settings-modal__option-button ${selectedTheme === 'SYSTEM' ? 'settings-modal__option-button--active' : ''}`}
                    onClick={() => handleThemeChange('SYSTEM')}
                  >
                    <div className="settings-modal__icon-container">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.41249 11C5.18749 11 4.99382 10.925 4.83149 10.775C4.66916 10.625 4.57116 10.4417 4.53749 10.225L4.42499 9.4C4.31666 9.35833 4.21466 9.30833 4.11899 9.25C4.02332 9.19167 3.92949 9.12917 3.83749 9.0625L3.06249 9.3875C2.85416 9.47917 2.64582 9.4875 2.43749 9.4125C2.22916 9.3375 2.06666 9.20417 1.94999 9.0125L1.36249 7.9875C1.24582 7.79583 1.21249 7.59167 1.26249 7.375C1.31249 7.15833 1.42499 6.97917 1.59999 6.8375L2.26249 6.3375C2.25416 6.27917 2.24999 6.22283 2.24999 6.1685V5.831C2.24999 5.777 2.25416 5.72083 2.26249 5.6625L1.59999 5.1625C1.42499 5.02083 1.31249 4.84167 1.26249 4.625C1.21249 4.40833 1.24582 4.20417 1.36249 4.0125L1.94999 2.9875C2.06666 2.79583 2.22916 2.6625 2.43749 2.5875C2.64582 2.5125 2.85416 2.52083 3.06249 2.6125L3.83749 2.9375C3.92916 2.87083 4.02499 2.80833 4.12499 2.75C4.22499 2.69167 4.32499 2.64167 4.42499 2.6L4.53749 1.775C4.57082 1.55833 4.66882 1.375 4.83149 1.225C4.99416 1.075 5.18782 1 5.41249 1H6.58749C6.81249 1 7.00632 1.075 7.16899 1.225C7.33166 1.375 7.42949 1.55833 7.46249 1.775L7.57499 2.6C7.68332 2.64167 7.78549 2.69167 7.88149 2.75C7.97749 2.80833 8.07116 2.87083 8.16249 2.9375L8.93749 2.6125C9.14582 2.52083 9.35416 2.5125 9.56249 2.5875C9.77082 2.6625 9.93332 2.79583 10.05 2.9875L10.6375 4.0125C10.7542 4.20417 10.7875 4.40833 10.7375 4.625C10.6875 4.84167 10.575 5.02083 10.4 5.1625L9.73749 5.6625C9.74582 5.72083 9.74999 5.77717 9.74999 5.8315V6.1685C9.74999 6.22283 9.74166 6.27917 9.72499 6.3375L10.3875 6.8375C10.5625 6.97917 10.675 7.15833 10.725 7.375C10.775 7.59167 10.7417 7.79583 10.625 7.9875L10.025 9.0125C9.90832 9.20417 9.74582 9.3375 9.53749 9.4125C9.32916 9.4875 9.12082 9.47917 8.91249 9.3875L8.16249 9.0625C8.07082 9.12917 7.97499 9.19167 7.87499 9.25C7.77499 9.30833 7.67499 9.35833 7.57499 9.4L7.46249 10.225C7.42916 10.4417 7.33132 10.625 7.16899 10.775C7.00666 10.925 6.81282 11 6.58749 11H5.41249ZM6.02499 7.75C6.50832 7.75 6.92082 7.57917 7.26249 7.2375C7.60416 6.89583 7.77499 6.48333 7.77499 6C7.77499 5.51667 7.60416 5.10417 7.26249 4.7625C6.92082 4.42083 6.50832 4.25 6.02499 4.25C5.53332 4.25 5.11866 4.42083 4.78099 4.7625C4.44332 5.10417 4.27466 5.51667 4.27499 6C4.27532 6.48333 4.44416 6.89583 4.78149 7.2375C5.11882 7.57917 5.53332 7.75 6.02499 7.75Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span>SYSTEM</span>
                  </button>
                  <button
                    className={`settings-modal__option-button ${selectedTheme === 'DARK' ? 'settings-modal__option-button--active' : ''}`}
                    onClick={() => handleThemeChange('DARK')}
                  >
                    <div className="settings-modal__icon-container">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 11C8.7615 11 11 8.7615 11 6C11 5.7685 10.653 5.73 10.5335 5.9285C10.2786 6.35067 9.93102 6.7093 9.51701 6.97723C9.103 7.24516 8.63345 7.41537 8.14392 7.47495C7.65439 7.53453 7.15772 7.48194 6.69152 7.32114C6.22533 7.16034 5.80185 6.89556 5.45314 6.54686C5.10444 6.19815 4.83966 5.77467 4.67886 5.30848C4.51806 4.84228 4.46546 4.34561 4.52505 3.85608C4.58463 3.36655 4.75483 2.897 5.02277 2.48299C5.2907 2.06898 5.64933 1.72138 6.0715 1.4665C6.27 1.3465 6.2315 1 6 1C3.2385 1 1 3.2385 1 6C1 8.7615 3.2385 11 6 11Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span>DARK</span>
                  </button>
                </div>
          </div>

          {/* Notifications Section */}
          <div className="market-header__panel">
            <div className="market-header__row">
              <div className="market-header__row-main">
                <div className="settings-modal__section-title">NOTIFICATIONS OFFERS</div>
              </div>
            </div>
            <div className="settings-modal__button-group">
              <button 
                className={`settings-modal__option-button settings-modal__option-button--notifications ${notificationsEnabled ? 'settings-modal__option-button--active' : ''}`}
                onClick={() => {
                  setNotificationsEnabled(true);
                  updateSettingMutation.mutate({ setting: 'offers_notifications', status: true });
                }}
              >
                <span>ON</span>
              </button>
              <button 
                className={`settings-modal__option-button settings-modal__option-button--notifications ${!notificationsEnabled ? 'settings-modal__option-button--active' : ''}`}
                onClick={() => {
                  setNotificationsEnabled(false);
                  updateSettingMutation.mutate({ setting: 'offers_notifications', status: false });
                }}
              >
                <span>OFF</span>
              </button>
            </div>
          </div>
        </div>

      <div className="market-header__sheet-footer">
        <button className="market-header__btn-secondary" onClick={() => window.open(config.settings.politicsUrl, '_blank')}>
          <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.68603 18.2083L2.41666 21.5625V3.83333C2.41666 3.57917 2.51762 3.33541 2.69735 3.15569C2.87707 2.97597 3.12082 2.875 3.37499 2.875H20.625C20.8792 2.875 21.1229 2.97597 21.3026 3.15569C21.4824 3.33541 21.5833 3.57917 21.5833 3.83333V17.25C21.5833 17.5042 21.4824 17.7479 21.3026 17.9276C21.1229 18.1074 20.8792 18.2083 20.625 18.2083H6.68603ZM11.0417 13.4167V15.3333H12.9583V13.4167H11.0417ZM8.71003 8.44579L10.5903 8.82242C10.6436 8.55546 10.7717 8.30913 10.9596 8.11212C11.1475 7.9151 11.3874 7.77548 11.6516 7.70951C11.9157 7.64354 12.1931 7.65393 12.4516 7.73947C12.71 7.82501 12.9389 7.98219 13.1115 8.19271C13.2841 8.40323 13.3934 8.65844 13.4266 8.92864C13.4599 9.19885 13.4157 9.47294 13.2993 9.71902C13.1828 9.9651 12.9989 10.1731 12.7689 10.3187C12.5389 10.4643 12.2722 10.5416 12 10.5417H11.0417V12.4583H12C12.6351 12.4581 13.2572 12.2776 13.7938 11.9377C14.3303 11.5979 14.7594 11.1126 15.031 10.5385C15.3026 9.96432 15.4056 9.32485 15.328 8.69446C15.2504 8.06406 14.9954 7.46865 14.5927 6.97748C14.19 6.48632 13.6561 6.1196 13.0531 5.91997C12.4502 5.72035 11.8029 5.69603 11.1867 5.84984C10.5704 6.00365 10.0105 6.32928 9.57208 6.78884C9.13365 7.24839 8.8347 7.82299 8.71003 8.44579Z" fill="currentColor"/>
          </svg>
          <span>Politics</span>
        </button>
        <button className="market-header__btn-primary" onClick={() => window.open(config.settings.supportUrl, '_blank')}>
          <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20.125C13.9137 20.1247 15.773 19.488 17.2851 18.3151C18.7972 17.1421 19.8763 15.4996 20.3525 13.6461C20.8286 11.7926 20.6748 9.83331 19.9153 8.07679C19.1558 6.32026 17.8336 4.86623 16.157 3.94359C14.4804 3.02096 12.5445 2.68213 10.6542 2.98045C8.76391 3.27877 7.02649 4.19729 5.71549 5.59141C4.4045 6.98553 3.59438 8.77607 3.41269 10.6811C3.231 12.5862 3.68805 14.4976 4.71188 16.1144L3.375 20.125L7.38563 18.7881C8.76522 19.6637 10.366 20.1275 12 20.125Z" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Support</span>
        </button>
      </div>
    </div>
  );
};
