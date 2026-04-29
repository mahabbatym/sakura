const BannerAd = ({ enabled }) => {
  if (!enabled) return null;
  return (
    <div className="ad-banner">
      <span>Sponsored</span>
      <p>Sakura Premium — шектеусіз музыка, офлайн тыңдау.</p>
    </div>
  );
};

export default BannerAd;
