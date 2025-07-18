import React from 'react';
import { Crown, Shield, Mic, MicOff, Headphones } from 'lucide-react';

const UserList = ({ users }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      case 'idle':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>;
      case 'dnd':
        return <div className="w-3 h-3 bg-red-500 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-500 rounded-full"></div>;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Crown size={12} className="text-yellow-400" />;
      case 'moderator':
        return <Shield size={12} className="text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4">
        Members — {users.length}
      </h3>
      
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.userId} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 border-2 border-gray-800 rounded-full">
                {getStatusIcon(user.status)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                {getRoleIcon(user.role)}
                <span className="text-sm text-white truncate">{user.username}</span>
              </div>
              {user.customStatus && (
                <div className="text-xs text-gray-400 truncate">{user.customStatus}</div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {user.isMuted && <MicOff size={12} className="text-red-400" />}
              {user.isDeafened && <Headphones size={12} className="text-red-400" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;