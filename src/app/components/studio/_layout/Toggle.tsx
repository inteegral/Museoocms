interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
}

export function Toggle({ checked, onChange, className }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 rounded-full flex-shrink-0 cursor-pointer focus:outline-none transition-colors duration-200 ${className ?? ""}`}
      style={{
        background: checked ? "#1a1a1a" : "#efefef",
        boxShadow: "inset 0px 3px 5px 2px rgba(0,0,0,0.10)",
      }}
    >
      <span
        className="absolute top-1/2 -translate-y-1/2 rounded-full bg-white transition-transform duration-200"
        style={{
          width: 18,
          height: 18,
          transform: `translateY(-50%) translateX(${checked ? "22px" : "3px"})`,
          boxShadow: "2px 1px 4px rgba(0,0,0,0.22)",
        }}
      />
    </button>
  );
}
