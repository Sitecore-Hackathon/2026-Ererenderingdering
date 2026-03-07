"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary underline underline-offset-4 hover:text-primary/80"
    >
      {children}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center pt-2">
            <img src="/logo.png" alt="Sitecore JavaScript Extensions" className="h-20 w-20" />
          </div>
          <DialogTitle className="text-center">Sitecore JavaScript Extensions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div>
            <span className="font-medium">Author:</span>{" "}
            <ExtLink href="https://www.linkedin.com/in/anton-tishchenko/">Anton Tishchenko</ExtLink>, CTO of{" "}
            <ExtLink href="https://exdst.com/">EXDST</ExtLink>
          </div>
          <div>
            <span className="font-medium">Built with:</span>{" "}
            <ExtLink href="https://claude.com/product/claude-code">Claude Code</ExtLink>{" "}
            by Anthropic
          </div>
          <div>
            <span className="font-medium">Inspired by:</span>{" "}
            <ExtLink href="https://doc.sitecorepowershell.com/#about-the-module">
              Sitecore PowerShell Extensions
            </ExtLink>{" "}
            — thanks to Adam Najmanowicz and Michael West
          </div>
          <div>
            <span className="font-medium">Made during:</span>{" "}
            <ExtLink href="https://sitecorehackathon.org/">
              Sitecore Hackathon 2026
            </ExtLink>{" "}
            — thanks to Akshay Sura
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
