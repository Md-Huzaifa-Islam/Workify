import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PALETTE = [
  "oklch(0.62 0.17 262.9)",
  "oklch(0.62 0.15 200)",
  "oklch(0.62 0.17 320)",
  "oklch(0.68 0.15 75)",
  "oklch(0.62 0.14 149)",
  "oklch(0.62 0.19 25)",
];

function colorForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface EntityAvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function EntityAvatar({ name, src, size = "default", className }: EntityAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback
        className="font-medium text-white"
        style={{ backgroundColor: colorForName(name) }}
      >
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

export { colorForName, initials };
