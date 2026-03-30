const RyznWordLogo = ({ className = '', height = 32 }: { className?: string; height?: number }) => {
  // Combined Word_White + Word_Color (green accent on the "Z" dot)
  // Both SVGs share the same viewBox 0 0 960 720, so we merge paths
  const aspectRatio = 960 / 720;
  const w = height * aspectRatio;

  return (
    <svg
      viewBox="100 240 770 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ height, width: 'auto' }}
      aria-label="RYZN"
    >
      {/* White paths — main letterforms */}
      <path fill="#ffffff" d="m230.7223 418.38058l-124.59897 -122.248474l0 -43.200348l168.62993 165.44882z" />
      <path fill="#ffffff" d="m106.123344 252.92651l168.62991 0l0 31.307068l-168.62991 0z" />
      <path fill="#ffffff" d="m274.75235 252.93175l0 96.47243l-31.307068 0l0 -96.47243z" />
      <path fill="#ffffff" d="m344.04776 419.14566l127.81052 -122.993164l0 -43.463516l-172.97638 166.45668z" />
      <path fill="#ffffff" d="m243.4865 349.45587l-31.086609 -31.086609l61.92125 0.25198364z" />
      <path fill="#ffffff" d="m542.53723 418.8832l127.81055 -122.993195l0 -43.4635l-172.97638 166.4567z" />
      <path fill="#ffffff" d="m670.3478 387.57742l-134.96063 0l0 31.307098l134.96063 0z" />
      <path fill="#ffffff" d="m695.8642 294.59564l122.993164 127.81052l43.4635 0l-166.45667 -172.97636z" />
      <path fill="#ffffff" d="m727.1699 422.40616l0 -134.96063l-31.307068 0l0 134.96063z" />
      <path fill="#ffffff" d="m497.20206 284.15747l109.60629 0l0 -31.307083l-109.60629 0z" />
      <path fill="#ffffff" d="m606.81757 284.23343l-31.40155 -31.401566l62.677124 0.12597656z" />
      <path fill="#ffffff" d="m830.48645 249.44894l0 109.60629l31.307129 0l0 -109.60629z" />
      <path fill="#ffffff" d="m830.4105 359.06445l31.40155 -31.40158l-0.12597656 62.677185z" />
      <path fill="#ffffff" d="m351.74777 340.42752l-48.408264 -47.723877l21.455841 -21.17862l48.408264 47.723877z" />
      <path fill="#ffffff" d="m303.16803 292.83896l43.83972 0.5463867l-44.418335 -43.619125z" />
      {/* Green accent — dot on Z */}
      <path fill="#00ff00" d="m145.47598 418.69028l-39.352623 -38.78952l0 -39.32071l79.24409 78.11023z" />
    </svg>
  );
};

export default RyznWordLogo;