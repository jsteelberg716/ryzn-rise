const RyznIconLogo = ({
  className = '',
  size = 32,
  mainFill = '#ffffff',
}: {
  className?: string;
  size?: number;
  /// Override the main R/arrow paths' fill. Default is white so the
  /// logo reads on dark backgrounds (the default brand surface).
  /// Pass a dark color (e.g. '#1a1a1a' or '#0a3d20') when rendering
  /// the logo on a light surface — used by the mobile hero's
  /// off-white "NFC tag" hero card.
  mainFill?: string;
}) => {
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
      {/* Main R/arrow paths */}
      <path fill={mainFill} d="m595.1308 595.992l-356.10382 -349.38617l0 -123.46658l481.94427 472.85272z" />
      <path fill={mainFill} d="m239.02696 123.12427l481.94427 0l0 89.47565l-481.94427 0z" />
      <path fill={mainFill} d="m720.9687 123.13923l0 275.71823l-89.47565 0l0 -275.71823z" />
      <path fill={mainFill} d="m631.6109 399.00522l-88.84558 -88.84555l176.97101 0.7201233z" />
      {/* Green accent triangle — always brand green */}
      <path fill="#22c55e" d="m351.50107 596.87714l-112.474045 -110.86301l0 -112.38107l226.48817 223.24408z" />
    </svg>
  );
};

export default RyznIconLogo;