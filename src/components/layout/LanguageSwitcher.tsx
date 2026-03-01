"use client"

import * as React from "react"
import { useProgressStore } from "@/store/useProgressStore"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"
import { SUPPORTED_LANGUAGES } from "@/lib/constants"

export function LanguageSwitcher() {
  const { language, setLanguage } = useProgressStore()

  return (
    <div className="flex gap-2">
      <Languages className="h-4 w-4 mr-2" />
      <div className="flex flex-wrap gap-1">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <Button
            key={lang.code}
            variant={language === lang.code ? "default" : "ghost"}
            size="sm"
            onClick={() => setLanguage(lang.code)}
          >
            {lang.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
