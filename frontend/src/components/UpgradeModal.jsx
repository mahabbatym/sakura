const UpgradeModal = ({ open, onClose, onSelect }) => {
  if (!open) return null;

  return (
    <div className="upgrade-modal-backdrop" onClick={onClose}>
      <div className="upgrade-modal" onClick={(event) => event.stopPropagation()}>
        <h3>Premium функция</h3>
        <p>Толық тыңдау және шектеусіз мүмкіндіктер үшін жоспар таңдаңыз.</p>
        <div className="upgrade-actions">
          <button onClick={() => onSelect('premium')}>Premium 799₸</button>
          <button onClick={() => onSelect('artist_pro')}>Artist Pro 1499₸</button>
        </div>
        <button className="icon-btn" onClick={onClose}>Жабу</button>
      </div>
    </div>
  );
};

export default UpgradeModal;
