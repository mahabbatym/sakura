import { useEffect, useRef, useState } from 'react';

const MAX_PULL = 90;
const TRIGGER_PULL = 64;

export const usePullToRefresh = (onRefresh, enabled = true) => {
  const containerRef = useRef(null);
  const startYRef = useRef(0);
  const pullingRef = useRef(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return undefined;

    const onTouchStart = (event) => {
      if (container.scrollTop > 0 || refreshing) return;
      startYRef.current = event.touches[0].clientY;
      pullingRef.current = true;
    };

    const onTouchMove = (event) => {
      if (!pullingRef.current) return;
      const distance = Math.max(0, event.touches[0].clientY - startYRef.current);
      if (distance <= 0) return;
      event.preventDefault();
      setPullDistance(Math.min(MAX_PULL, distance * 0.55));
    };

    const onTouchEnd = async () => {
      if (!pullingRef.current) return;
      pullingRef.current = false;
      if (pullDistance >= TRIGGER_PULL && typeof onRefresh === 'function') {
        setRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setRefreshing(false);
        }
      }
      setPullDistance(0);
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);
    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [enabled, onRefresh, pullDistance, refreshing]);

  return { containerRef, pullDistance, refreshing };
};
