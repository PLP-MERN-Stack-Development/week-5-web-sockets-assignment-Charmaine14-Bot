import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../contexts/SocketContext';

export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if (!context) {
    return {
      socket: null,
      emit: () => console.warn('Socket not connected'),
      isConnected: false
    };
  }
  
  const { socket } = context;
  
  const emit = (event, data) => {
    if (socket && socket.connected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
    }
  };
  
  return {
    socket,
    emit,
    isConnected: socket ? socket.connected : false
  };
};