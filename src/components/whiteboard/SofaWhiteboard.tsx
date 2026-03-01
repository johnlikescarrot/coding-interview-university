"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Trash2, Download, Eraser, Pen } from "lucide-react"

export default function SofaWhiteboard() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = React.useState(false)
  const [tool, setTool] = React.useState<'pen' | 'eraser'>('pen')

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 3
    ctx.strokeStyle = '#000000'
  }, [])

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) canvas.getContext('2d')?.beginPath()
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top

    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : '#000000'
    ctx.lineWidth = tool === 'eraser' ? 20 : 3

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

  return (
    <Card className="w-full h-full shadow-lg border-2">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/50">
        <div>
          <CardTitle>The Sofa Whiteboard</CardTitle>
          <CardDescription>Practice coding interview questions on paper (digitally).</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant={tool === 'pen' ? 'default' : 'outline'} size="icon" onClick={() => setTool('pen')}>
            <Pen className="h-4 w-4" />
          </Button>
          <Button variant={tool === 'eraser' ? 'default' : 'outline'} size="icon" onClick={() => setTool('eraser')}>
            <Eraser className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={clear}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 bg-white cursor-crosshair relative aspect-video">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          width={1000}
          height={600}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
      </CardContent>
    </Card>
  )
}
