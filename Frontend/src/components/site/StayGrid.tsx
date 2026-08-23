import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { StayCard } from "./StayCard";
import type { Stay } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export function StayGrid({
  stays,
  columns = 4,
  className,
}: {
  stays: Stay[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <RevealGroup
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-10",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
      stagger={0.12}
    >
      {stays.map((stay) => (
        <RevealItem key={stay.slug} className="h-full">
          <StayCard stay={stay} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
