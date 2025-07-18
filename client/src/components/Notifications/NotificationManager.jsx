import React, { useState, useEffect } from 'react'
import { useSocket } from '../../contexts/SocketContext'
import { X, MessageSquare, Users } from 'lucide-react'

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([])
  const { socket } = useSocket()

  useEffect(() => {
    if (socket) {
      socket.on('notification', (notification) => {
        addNotification(notification)
      })

      socket.on('userJoined', (data) => {
        addNotification({
          id: Date.now(),
          type: 'info',
          title: 'User Joined',
          message: `${data.username} joined the chat`,
          icon: Users
        })
      })

      socket.on('userLeft', (data) => {
        addNotification({
          id: Date.now(),
          type: 'info',
          title: 'User Left',
          message: `${data.username} left the chat`,
          icon: Users
        })
      })

      return () => {
        socket.off('notification')
        socket.off('userJoined')
        socket.off('userLeft')
      }
    }
  }, [socket])

  const addNotification = (notification) => {
    const id = notification.id || Date.now()
    const newNotification = {
      ...notification,
      id,
      timestamp: new Date().toISOString()
    }
    
    setNotifications(prev => [...prev, newNotification])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 3001)
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return MessageSquare
      case 'user':
        return Users
      default:
        return MessageSquare
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      case 'warning':
        return 'bg-yellow-500'
      default:
        return 'bg-blue-500'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        const Icon = notification.icon || getNotificationIcon(notification.type)
        return (
          <div
            key={notification.id}
            className={`max-w-sm w-full ${getNotificationColor(notification.type)} shadow-lg rounded-lg pointer-events-auto overflow-hidden animate-slide-up`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-white">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm text-white opacity-90">
                    {notification.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="inline-flex text-white hover:text-gray-200 focus:outline-none focus:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default NotificationManager