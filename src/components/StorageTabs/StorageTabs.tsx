import { Link } from '@tanstack/react-router';

interface StorageTabsProps {
  activeTab: 'channels' | 'offers' | 'activity';
  showSubTabs?: boolean;
  activeSubTab?: 'received' | 'placed';
}

export function StorageTabs({ activeTab, showSubTabs = false, activeSubTab }: StorageTabsProps) {
  return (
    <div className="storage-tabs">
      <div className="storage-segment">
        <Link 
          to="/storage/channels" 
          className={`storage-tab-link ${activeTab === 'channels' ? 'is-active' : ''}`}
        >
          Channels
        </Link>
        <Link 
          to="/storage/offers/received" 
          className={`storage-tab-link ${activeTab === 'offers' ? 'is-active' : ''}`}
        >
          Offers
        </Link>
        <Link 
          to="/storage/activity" 
          className={`storage-tab-link ${activeTab === 'activity' ? 'is-active' : ''}`}
        >
          Activity
        </Link>
      </div>
      
      {showSubTabs && (
        <div className="storage-subsegment">
          <Link 
            to="/storage/offers/received" 
            className={`storage-tab-link ${activeSubTab === 'received' ? 'is-active' : ''}`}
          >
            Received
          </Link>
          <Link 
            to="/storage/offers/placed" 
            className={`storage-tab-link ${activeSubTab === 'placed' ? 'is-active' : ''}`}
          >
            Placed
          </Link>
        </div>
      )}
    </div>
  );
}

