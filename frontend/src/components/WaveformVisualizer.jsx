const bars = [20, 12, 28, 18, 32, 14, 24];

const WaveformVisualizer = () => (
  <div className="waveform" aria-hidden="true">
    {bars.map((height, index) => (
      <span key={`${height}-${index}`} style={{ '--h': `${height}px`, animationDelay: `${index * 0.09}s` }} />
    ))}
  </div>
);

export default WaveformVisualizer;
