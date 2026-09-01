import { useCallback } from 'react'
import TaskRow from './TaskRow'
import useDragList from '../lib/useDragList'
import { useStore } from '../state/store'

/**
 * Reordering happens against the full task array, not the filtered view, so a
 * drag inside "Today" cannot scramble the order of anything in "Future".
 */
export default function TaskList({ tasks, onOpen, onStart, emptyState }) {
  const { state, dispatch } = useStore()

  const onMove = useCallback(
    (from, to) => {
      const fromId = tasks[from]?.id
      const toId = tasks[to]?.id
      if (!fromId || !toId) return
      const gFrom = state.tasks.findIndex((t) => t.id === fromId)
      const gTo = state.tasks.findIndex((t) => t.id === toId)
      if (gFrom < 0 || gTo < 0) return
      dispatch({ type: 'reorder', from: gFrom, to: gTo })
    },
    [tasks, state.tasks, dispatch],
  )

  const drag = useDragList(tasks.length, onMove)

  const onToggleDone = (task) =>
    dispatch({ type: 'set-status', id: task.id, status: task.status === 'done' ? 'focus' : 'done' })

  if (!tasks.length) return emptyState ?? null

  return (
    <ul className="space-y-2.5">
      {tasks.map((task, i) => (
        <TaskRow
          key={task.id}
          task={task}
          setRef={drag.setItemRef(i)}
          style={drag.styleFor(i)}
          dragHandle={drag.handleProps(i)}
          onOpen={onOpen}
          onStart={onStart}
          onToggleDone={onToggleDone}
        />
      ))}
    </ul>
  )
}
