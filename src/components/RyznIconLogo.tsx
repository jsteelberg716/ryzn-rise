const RyznIconLogo = ({ className = '', size = 32 }: { className?: string; size?: number }) => {
  // Combined Icon_White + Icon_Color (green accent triangle)
  // Both SVGs share the same viewBox 0 0 960 720
  return (
    <svg
      viewBox="220 110 520 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ height: size, width: 'auto' }}
      aria-label="RYZN icon"
    >
      {/* White paths — main R/arrow shape */}
      <path fill="#ffffff" d="m595.1308 595.992l-356.10382 -349.38617l0 -123.46658l481.94427 472.85272z" />
      <path fill="#ffffff" d="m239.02696 123.12427l481.94427 0l0 89.47565l-481.94427 0z" />
      <path fill="#ffffff" d="m720.9687 123.13923l0 275.71823l-89.47565 0l0 -275.71823z" />
      <path fill="#ffffff" d="m631.6109 399.00522l-88.84558 -88.84555l176.97101 0.7201233z" />
      {/* Green accent triangle */}
      <path fill="#00ff00" d="m351.50107 596.87714l-112.474045 -110.86301l0 -112.38107l226.48817 223.24408z" />
    </svg>
  );
};

export default RyznIconLogo;