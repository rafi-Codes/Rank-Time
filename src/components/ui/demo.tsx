"use client"

import * as React from "react"
import { LiquidButton, MetalButton } from "@/components/ui/liquid-glass-button"
import { ButtonColorful } from "@/components/ui/button-colorful"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ExpandableTabs } from "@/components/ui/expandable-tabs"
import { TextScramble } from "@/components/ui/text-scramble"
import { Bell, Home, HelpCircle, Settings, Shield, User } from "lucide-react"

export default function DemoShowcase() {
  const tabs = [
    { title: "Dashboard", icon: Home },
    { title: "Notifications", icon: Bell },
    { type: "separator" as const },
    { title: "Settings", icon: Settings },
    { title: "Support", icon: HelpCircle },
  ]

  const [scrambleTrigger, setScrambleTrigger] = React.useState(true)

  return (
    <div className="flex flex-col gap-10 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
      <div>
        <h2 className="text-xl font-bold mb-4">Liquid & Metal Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <LiquidButton>Liquid Glass</LiquidButton>
          <MetalButton variant="primary">Metal Primary</MetalButton>
          <ButtonColorful label="Colorful Button" />
          <MetalButton variant="success">Metal Success</MetalButton>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Expandable Navigation Tabs</h2>
        <ExpandableTabs tabs={tabs} />
      </div>

      <div className="flex flex-wrap gap-10">
        <div>
          <h2 className="text-xl font-bold mb-4">Theme Toggle</h2>
          <ThemeToggle />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Text Scramble Animation</h2>
          <div className="flex flex-col gap-2">
            <TextScramble 
              trigger={scrambleTrigger} 
              onScrambleComplete={() => setScrambleTrigger(false)}
              className="font-mono text-cyan-400 font-bold"
            >
              COMPETITIVE PROGRAMMING PRACTICE CLARIFIED
            </TextScramble>
            <button 
              onClick={() => setScrambleTrigger(true)}
              className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer text-left"
            >
              Trigger Scramble Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
