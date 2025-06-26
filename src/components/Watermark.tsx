const Watermark = () => (
  <div style={{
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    textAlign: 'center',
    zIndex: 9999,
    pointerEvents: 'none',
    opacity: 0.7,
    fontSize: '1rem',
    color: '#888',
    padding: '0.5rem',
    fontFamily: 'Inter, sans-serif',
    background: 'transparent',
  }}>
    Made by Etash
  </div>
);

export default Watermark;
