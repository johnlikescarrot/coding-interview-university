"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Eraser, Pen, Trash2 } from "lucide-react"

const CANVAS_WIDTH = 1000
const CANVAS_HEIGHT = 600

export default function SofaWhiteboard() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const isDrawingRef = React.useRef(false)
  const [tool, setTool] = React.useState<"pen" | "eraser">("pen")

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawingRef.current = true
    const { x, y } = getCoordinates(e)
    const ctx = canvasRef.current?.getContext("2d")
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return
    const { x, y } = getCoordinates(e)
    const ctx = canvasRef.current?.getContext("2d")
    if (ctx) {
      if (tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out"
        ctx.lineWidth = 25
      } else {
        ctx.globalCompositeOperation = "source-over"
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 3
      }
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.lineTo(x, y)
      ctx.stroke()

      // Reset path to prevent accumulation artifacts
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const stopDrawing = () => {
    isDrawingRef.current = false
    const ctx = canvasRef.current?.getContext("2d")
    if (ctx) {
      ctx.globalCompositeOperation = "source-over" // Restore to default
    }
  }

  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
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
    <Card className="w-full h-full flex flex-col overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0 py-4">
        <div>
          <CardTitle>The Sofa Whiteboard</CardTitle>
          <CardDescription>Draw your solutions during your study session.</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={tool === "pen" ? "default" : "outline"}
            size="icon"
            onClick={() => setTool("pen")}
            aria-label="Pen tool"
          >
            <Pen className="h-4 w-4" />
          </Button>
          <Button
            variant={tool === "eraser" ? "default" : "outline"}
            size="icon"
            onClick={() => setTool("eraser")}
            aria-label="Eraser tool"
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={clear} aria-label="Clear canvas">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={download} aria-label="Download drawing">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 bg-[#0f172a] relative cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-full touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        />
      </CardContent>
    </Card>
  )
}
