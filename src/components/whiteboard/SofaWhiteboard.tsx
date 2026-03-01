"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Trash2, Download, Eraser, Pen } from "lucide-react"

const WHITEBOARD_CONSTANTS = {
  PEN_COLOR: '#000000',
  ERASER_COLOR: '#ffffff',
  PEN_WIDTH: 3,
  ERASER_WIDTH: 20,
  INTERNAL_WIDTH: 1000,
  INTERNAL_HEIGHT: 600
}

export default function SofaWhiteboard() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const isDrawingRef = React.useRef(false)
  const [tool, setTool] = React.useState<'pen' | 'eraser'>('pen')

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY

    // Scale CSS pixels to Canvas internal resolution
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawingRef.current = true
    const { x, y } = getCoordinates(e)
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      draw(e, true)
    }
  }

  const stopDrawing = () => {
    isDrawingRef.current = false
    canvasRef.current?.getContext('2d')?.beginPath()
  }

  const draw = (e: React.MouseEvent | React.TouchEvent, force = false) => {
    if (!isDrawingRef.current && !force) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const { x, y } = getCoordinates(e)

    ctx.strokeStyle = tool === 'eraser' ? WHITEBOARD_CONSTANTS.ERASER_COLOR : WHITEBOARD_CONSTANTS.PEN_COLOR
    ctx.lineWidth = tool === 'eraser' ? WHITEBOARD_CONSTANTS.ERASER_WIDTH : WHITEBOARD_CONSTANTS.PEN_WIDTH

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'whiteboard-practice.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <Card className="w-full h-full shadow-lg border-2">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/50">
        <div>
          <CardTitle>The Sofa Whiteboard</CardTitle>
          <CardDescription>Practice coding interview questions on paper (digitally).</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant={tool === 'pen' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setTool('pen')}
            aria-label="Pen Tool"
          >
            <Pen className="h-4 w-4" />
          </Button>
          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setTool('eraser')}
            aria-label="Eraser Tool"
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={clear} aria-label="Clear Whiteboard">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={download} aria-label="Download as PNG">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 bg-white cursor-crosshair relative aspect-video overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          width={WHITEBOARD_CONSTANTS.INTERNAL_WIDTH}
          height={WHITEBOARD_CONSTANTS.INTERNAL_HEIGHT}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={(e) => draw(e)}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={(e) => draw(e)}
        />
      </CardContent>
    </Card>
  )
}
