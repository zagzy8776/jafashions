export default function Logo({
  className = "h-10 w-10",
  light = true,
}: {
  className?: string;
  light?: boolean;
}) {
  const fill = light ? "#f7f4ef" : "#111111";
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <path
        fill={fill}
        d="M36 8c6 0 11.5 1.4 16 4.6l-5.2 9.2c-3-2-6.4-3-10-3-9.2 0-15.2 6-15.2 16.4V74H10V34C10 18 21.2 8 36 8z"
      />
      <path
        fill={fill}
        d="M52.4 74c-7.2 12.4-17.8 19-31.6 19H10v-11h14.8c9.2 0 16.4-4.6 21.6-13.2z"
      />
      <path
        fill={fill}
        d="M46 32.4 76 82H62.4L55.2 70H29.6l7.2-12.4H52L46 46.8 53.2 32.4H46zm-1.2 25.2h12.4L50.8 46.4 44.8 57.6z"
      />
    </svg>
  );
}
