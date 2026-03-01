"use client"

import * as React from "react"
import { useProgressStore } from "@/store/useProgressStore"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'cn', name: '简体中文' },
  { code: 'ja', name: '日本語' },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useProgressStore()

  return (
    <div className="flex gap-2">
      <Languages className="h-4 w-4 mr-2" />
      <div className="flex flex-wrap gap-1">
        {LANGUAGES.map((lang) => (
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
