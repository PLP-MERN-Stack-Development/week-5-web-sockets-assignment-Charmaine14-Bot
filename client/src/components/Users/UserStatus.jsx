import React from 'react'
import { Circle } from 'lucide-react'

const UserStatus = ({ user, showStatus = true }) => {
  return (
    <div className="flex items-center space-x-2 px-2 py-1 text-sm text-gray-300 hover:bg-gray-700 rounded">
      {showStatus && (
        <Circle className="h-2 w-2 text-green-400 fill-current" />
      )}
      <span className="truncate">{user.username}</span>
    </div>
  )
}

export default UserStatus