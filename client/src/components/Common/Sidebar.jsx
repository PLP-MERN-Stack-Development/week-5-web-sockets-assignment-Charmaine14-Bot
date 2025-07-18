import React from 'react'
import { Hash, Users } from 'lucide-react'
import { useSocket } from '../../contexts/SocketContext'
import UserStatus from '../Users/UserStatus'

const Sidebar = ({ rooms, currentRoom, onRoomChange }) => {
  const { onlineUsers } = useSocket()

  return (
    <div className="sidebar">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Channels</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="mb-4">
            <h3 className="px-2 py-1 text-sm font-medium text-gray-300 uppercase tracking-wider">
              Rooms
            </h3>
            <div className="mt-1 space-y-1">
              {rooms.map((room) => (
                <button
                  key={room}
                  onClick={() => onRoomChange(room)}
                  className={`w-full flex items-center px-2 py-1 text-sm rounded hover:bg-gray-700 ${
                    currentRoom === room ? 'bg-gray-700 text-white' : 'text-gray-300'
                  }`}
                >
                  <Hash className="h-4 w-4 mr-2" />
                  {room}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="px-2 py-1 text-sm font-medium text-gray-300 uppercase tracking-wider flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Online ({onlineUsers.length})
            </h3>
            <div className="mt-1 space-y-1">
              {onlineUsers.map((user) => (
                <UserStatus
                  key={user.userId}
                  user={user}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar