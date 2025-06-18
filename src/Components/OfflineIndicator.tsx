import React from 'react';

interface Props {
  offline: boolean;
  syncing: boolean;
}

export const OfflineIndicator: React.FC<Props> = ({ offline, syncing }) => {
  if (syncing) {
    return (
      <div className="text-orange-500 text-sm font-medium mb-2">
        Syncing changes...
      </div>
    );
  }

  if (offline) {
    return (
      <div className="text-red-500 text-sm font-medium mb-2">
        Offline mode: changes will sync later
      </div>
    );
  }

  return null;
};