import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Pointer-based drag reordering. Written by hand rather than pulled from a
 * library because HTML5 drag-and-drop does not fire on touch screens, and this
 * app is mobile first. Works with a mouse, a finger, or a stylus.
 *
 * Usage:
 *   const drag = useDragList(items.length, (from, to) => reorder(from, to))
 *   <li ref={drag.setItemRef(i)} style={drag.styleFor(i)}>
 *     <button {...drag.handleProps(i)}>drag</button>
 *   </li>
 */
export default function useDragList(count, onMove) {
  const [dragging, setDragging] = useState(null) // { index, offset }
  const [overIndex, setOverIndex] = useState(null)
  const itemRefs = useRef([])
  const startY = useRef(0)
  const rects = useRef([])

  const setItemRef = useCallback((i) => (el) => { itemRefs.current[i] = el }, [])

  const begin = useCallback((i, clientY) => {
    rects.current = itemRefs.current
      .slice(0, count)
      .map((el) => (el ? el.getBoundingClientRect() : null))
    startY.current = clientY
    setDragging({ index: i, offset: 0 })
    setOverIndex(i)
  }, [count])

  useEffect(() => {
    if (!dragging) return

    const move = (clientY) => {
      const offset = clientY - startY.current
      setDragging((d) => (d ? { ...d, offset } : d))
      const from = dragging.index
      const fromRect = rects.current[from]
      if (!fromRect) return
      const centre = fromRect.top + fromRect.height / 2 + offset
      let target = from
      rects.current.forEach((r, i) => {
        if (!r || i === from) return
        const mid = r.top + r.height / 2
        if (from < i && centre > mid) target = Math.max(target, i)
        if (from > i && centre < mid) target = Math.min(target, i)
      })
      setOverIndex(target)
    }

    const onPointerMove = (e) => { e.preventDefault(); move(e.clientY) }
    const onPointerUp = () => {
      if (overIndex != null && overIndex !== dragging.index) onMove(dragging.index, overIndex)
      setDragging(null)
      setOverIndex(null)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [dragging, overIndex, onMove])

  const handleProps = (i) => ({
    onPointerDown: (e) => {
      if (e.button != null && e.button !== 0) return
      e.preventDefault()
      e.currentTarget.releasePointerCapture?.(e.pointerId)
      begin(i, e.clientY)
    },
    style: { touchAction: 'none', cursor: dragging ? 'grabbing' : 'grab' },
    'aria-label': 'Drag to reorder',
  })

  /** Lifts the dragged row and slides the others out of its way. */
  const styleFor = (i) => {
    if (!dragging) return undefined
    const from = dragging.index
    if (i === from) {
      return {
        transform: `translateY(${dragging.offset}px) scale(1.02)`,
        zIndex: 30,
        position: 'relative',
        pointerEvents: 'none',
      }
    }
    const h = rects.current[from]?.height || 0
    const to = overIndex ?? from
    let shift = 0
    if (from < i && i <= to) shift = -h
    if (from > i && i >= to) shift = h
    return { transform: `translateY(${shift}px)`, transition: 'transform 150ms ease' }
  }

  return { setItemRef, handleProps, styleFor, draggingIndex: dragging?.index ?? null }
}
