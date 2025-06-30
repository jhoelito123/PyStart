type IconStarProps = {
  filled?: boolean;
  size?: number;
};

export default function IconStar({ filled = false, size = 24 }: IconStarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? '#0F132B' : 'none'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        stroke="#0F132B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
