import type { JSX } from "react";

export default function EmptyTasksIllustration({
  className = "",
}: {
  className?: string;
}): JSX.Element {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 ${className}`}
    >
      <div className="relative">
        <svg
          width="220"
          height="160"
          viewBox="0 0 220 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="g2" x1="0" x2="1">
              <stop offset="0%" stopColor="#34D399" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.14" />
            </linearGradient>
          </defs>

          {/* background blobs */}
          <circle cx="34" cy="30" r="28" fill="url(#g1)" />
          <circle cx="190" cy="24" r="18" fill="url(#g2)" />

          {/* card */}
          <rect
            x="20"
            y="36"
            width="180"
            height="96"
            rx="12"
            fill="#FFFFFF"
            stroke="#E6E9EE"
          />

          {/* lines */}
          <rect x="40" y="56" width="90" height="8" rx="4" fill="#F1F5F9" />
          <rect x="40" y="72" width="120" height="6" rx="4" fill="#F8FAFC" />
          <rect x="40" y="84" width="100" height="6" rx="4" fill="#F8FAFC" />

          {/* checklist icon */}
          <rect
            x="132"
            y="58"
            width="38"
            height="30"
            rx="6"
            fill="#FAFAFA"
            stroke="#EEF2FF"
          />
          <path
            d="M140 72l4 4 8-8"
            stroke="#60A5FA"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* small confetti dots */}
          <circle cx="26" cy="116" r="3" fill="#F59E0B" />
          <circle cx="46" cy="126" r="3" fill="#34D399" />
          <circle cx="64" cy="110" r="3" fill="#A78BFA" />
        </svg>

        {/* character */}
        <div className="absolute left-6 top-6 flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-violet-400 flex items-center justify-center text-white font-bold shadow-md animate-bounce"
            style={{ animationDuration: "1.6s" }}
          >
            :)
          </div>
          <div className="text-sm text-foreground font-medium">Ready</div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <div className="text-lg font-semibold text-foreground">
          No tasks yet
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Create your first task to get things done
        </div>
      </div>
    </div>
  );
}
