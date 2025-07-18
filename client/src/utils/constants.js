export const CHAT_EVENTS = {
  MESSAGE: 'message',
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  TYPING_START: 'typingStart',
  TYPING_STOP: 'typingStop',
  ROOM_MESSAGES: 'roomMessages',
  USER_JOINED: 'userJoined',
  USER_LEFT: 'userLeft',
  ONLINE_USERS: 'onlineUsers'
}

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system'
}

export const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
  BUSY: 'busy'
}

export const ROOM_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  DIRECT: 'direct'
}