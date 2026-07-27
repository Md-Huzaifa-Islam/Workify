"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ComingSoonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  eta?: string;
}

export function ComingSoon({ icon, title, description, eta = "Next update" }: ComingSoonProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative flex max-w-md flex-col items-center gap-4 rounded-2xl border bg-card/60 p-10 text-center shadow-sm backdrop-blur-sm"
      >
        <div className="relative flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary [&_svg]:size-8">
          {icon}
          <div className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-3.5" />
          </div>
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground text-balance">{description}</p>
        </div>
        <Badge variant="secondary" className="font-normal">
          {eta}
        </Badge>
      </motion.div>
    </div>
  );
}
