/**
 * University of Arizona block "A" logo — inline SVG recreation
 * in navy (#003366) + Arizona red (#AB0520) + white gap.
 *
 * Stylized for banner use. Size via the `height` prop.
 */
const ArizonaALogo = ({
  height = 22,
  className = '',
}: {
  height?: number;
  className?: string;
}) => {
  const width = (height * 100) / 92;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 92"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="University of Arizona"
      role="img"
    >
      {/* Navy outer block A */}
      <path
        d="M 4 92 L 35 0 L 65 0 L 96 92 L 76 92 L 69 72 L 31 72 L 24 92 Z M 39 58 L 61 58 L 50 22 Z"
        fill="#003366"
        fillRule="evenodd"
      />
      {/* White gap ring between navy and red */}
      <path
        d="M 15 87 L 40 13 L 60 13 L 85 87 L 73 87 L 66 66 L 34 66 L 27 87 Z M 41 56 L 59 56 L 50 28 Z"
        fill="#FFFFFF"
        fillRule="evenodd"
      />
      {/* Red inner A */}
      <path
        d="M 24 83 L 43 20 L 57 20 L 76 83 L 70 83 L 63 62 L 37 62 L 30 83 Z M 43 54 L 57 54 L 50 32 Z"
        fill="#AB0520"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default ArizonaALogo;
