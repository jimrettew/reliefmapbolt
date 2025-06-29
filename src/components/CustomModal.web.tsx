import React from 'react';

interface CustomModalProps {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  isDark?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title,
  message,
  onClose,
  isDark = false,
}) => {
  const PRIMARY = '#f94b6c';
  
  if (!visible) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: isDark ? '#2c2c2e' : '#fff',
    borderRadius: '16px',
    padding: '24px',
    minWidth: '280px',
    maxWidth: '340px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    animation: 'fadeIn 0.2s ease-out',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    textAlign: 'center',
    color: isDark ? '#fff' : '#000',
    margin: '0 0 12px 0',
  };

  const messageStyle: React.CSSProperties = {
    fontSize: '16px',
    lineHeight: '22px',
    marginBottom: '24px',
    textAlign: 'center',
    color: isDark ? '#fff' : '#000',
    margin: '0 0 24px 0',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: PRIMARY,
    borderRadius: '12px',
    padding: '12px 24px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    transition: 'opacity 0.2s ease',
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          <p style={messageStyle}>{message}</p>
          <button 
            style={buttonStyle}
            onClick={onClose}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.opacity = '0.9'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.opacity = '1'}
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomModal; 