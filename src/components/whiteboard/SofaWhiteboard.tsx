"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Pen, Eraser, Trash2, Download } from "lucide-react"
import { cn } from "@/lib/utils"

const INTERNAL_WIDTH = 1000
const INTERNAL_HEIGHT = 600

const COLORS = [
  { name: "Black", value: "#000000" },
  { name: "Blue", value: "#2563eb" },
  { name: "Red", value: "#dc2626" },
  { name: "Green", value: "#16a34a" },
]

export default function SofaWhiteboard() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null)
  const [tool, setTool] = React.useState<"pen" | "eraser">("pen")
  const [color, setColor] = React.useState("#000000")

  // Refs to avoid stale closures in event handlers
  const isDrawing = React.useRef(false)
  const lastPoint = React.useRef<{ x: number; y: number } | null>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctxRef.current = ctx
  }, [])

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    let clientX, clientY

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = (e as MouseEvent).clientX
      clientY = (e as MouseEvent).clientY
    }

    // Scale coordinates to internal resolution
    const x = (clientX - rect.left) * (INTERNAL_WIDTH / rect.width)
    const y = (clientY - rect.top) * (INTERNAL_HEIGHT / rect.height)

    return { x, y }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoordinates(e)
    if (!coords) return

    isDrawing.current = true
    lastPoint.current = coords
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !ctxRef.current || !lastPoint.current) return

    const coords = getCoordinates(e)
    if (!coords) return

    const ctx = ctxRef.current
    ctx.beginPath()
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y)
    ctx.lineTo(coords.x, coords.y)

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out"
      ctx.lineWidth = 20
    } else {
      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = color
      ctx.lineWidth = 3
    }

    ctx.stroke()
    lastPoint.current = coords
  }

  const stopDrawing = () => {
    isDrawing.current = false
    lastPoint.current = null
  }

  const clear = () => {
    const ctx = ctxRef.current
    if (!ctx) return
    ctx.clearRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT)
  }

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = "sofa-whiteboard.png"
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center space-x-2">
          <Button
            variant={tool === "pen" ? "default" : "outline"}
            size="icon"
            onClick={() => setTool("pen")}
            title="Pen"
            aria-label="Pen Tool"
          >
            <Pen className="h-4 w-4" />
          </Button>
          <Button
            variant={tool === "eraser" ? "default" : "outline"}
            size="icon"
            onClick={() => setTool("eraser")}
            title="Eraser"
            aria-label="Eraser Tool"
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          {COLORS.map((c) => (
            <button
              key={c.value}
              className={cn(
                "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                color === c.value ? "border-primary scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: c.value }}
              onClick={() => {
                setColor(c.value)
                setTool("pen")
              }}
              title={c.name}
              aria-label={`Select ${c.name} color`}
            />
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={clear} title="Clear canvas" aria-label="Clear Canvas">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={download} title="Download drawing" aria-label="Download Drawing">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-white relative cursor-crosshair overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          width={INTERNAL_WIDTH}
          height={INTERNAL_HEIGHT}
          className="absolute inset-0 w-full h-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        />
      </div>
    </div>
  )
}
