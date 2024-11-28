import React, { useState, useEffect } from 'react';
import NotificationService from '../../services/NotificationService';
import './Notification.css'; // Importar el archivo CSS

const Notification = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const observer = {
      update: (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000); // Limpiar el mensaje después de 3 segundos
      }
    };

    NotificationService.subscribe(observer);

    return () => {
      NotificationService.unsubscribe(observer);
    };
  }, []);

  if (!message) return null;

  return (
    <div className="notification">
      {message}
    </div>
  );
};

export default Notification;