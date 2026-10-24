const ba =
  "M8 25H20V43H37V25H49V89H8Z M20 55V77H37V55Z M58 22H71V49H84V62H71V94H58Z";
const geul =
  "M5 3H57L54 22L32 35H12L38 17H5Z M4 40H59V51H4Z M8 57H57V86H23V95H59V106H8V76H42V68H8Z";

// Paths keep the sign-inspired lettering consistent without a device font.
const letters = [
  {
    path: ba,
    transform: "translate(3 5) rotate(-2 42 55)",
    accent: "M8 25H20V38H8Z",
    color: "#e74d64",
  },
  {
    path: geul,
    transform: "translate(96 3) rotate(1 30 55)",
    accent: "M5 3H25V17H5Z",
    color: "#347ee5",
  },
  {
    path: ba,
    transform: "translate(168 7) rotate(1 42 55)",
    accent: "M8 25H20V38H8Z",
    color: "#f4bd34",
  },
  {
    path: geul,
    transform: "translate(261 5) rotate(-2 30 55)",
    accent: "M5 3H25V17H5Z",
    color: "#37a35b",
  },
];

export function BrandWordmark() {
  return (
    <svg
      className="brand-wordmark"
      viewBox="0 0 330 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {letters.map((letter, index) => (
        <g key={index} transform={letter.transform} strokeLinejoin="round">
          <path
            d={letter.path}
            fill="#202736"
            fillRule="evenodd"
            stroke="#202736"
            strokeWidth="6"
            transform="translate(1 3)"
          />
          <path
            d={letter.path}
            fill="#f4f5f8"
            fillRule="evenodd"
            stroke="#202736"
            strokeWidth="4"
            paintOrder="stroke"
          />
          <path d={letter.accent} fill={letter.color} />
        </g>
      ))}
    </svg>
  );
}
