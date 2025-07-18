import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
  }

  connect(token, userId, username) {
    this.socket = io('http://localhost:3001', {
      auth: { token, userId, username }
    })
    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }
}

export default new SocketService()
