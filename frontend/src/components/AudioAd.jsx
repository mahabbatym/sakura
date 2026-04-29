import { useEffect, useState } from 'react';

const AudioAd = ({ enabled }) => {
  const [canSkip, setCanSkip] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    setVisible(true);
    setCanSkip(false);
    const timer = setTimeout(() => setCanSkip(true), 5000);
    return () => clearTimeout(timer);
  }, [enabled]);

  if (!enabled || !visible) return null;

  return (
    <div className="ad-audio">
      <p>Audio Ad: Premium-ға өтіп, жарнамасыз тыңдаңыз.</p>
      <button disabled={!canSkip} onClick={() => setVisible(false)}>
        {canSkip ? 'Skip ad' : 'Skip in 5s'}
      </button>
    </div>
  );
};

export default AudioAd;
