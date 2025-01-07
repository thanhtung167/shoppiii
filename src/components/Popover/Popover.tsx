import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset, Placement,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole
} from '@floating-ui/react'
import { AnimatePresence, motion } from 'motion/react'
import {ElementType, useId, useRef, useState} from 'react'
import * as React from 'react'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?:ElementType
  initialOpen?:boolean
  placement?: Placement
}
export default function Popover({ children, renderPopover, className, as: Element = 'div',initialOpen,placement = 'bottom-end' }: Readonly<Props>) {
  const [isOpen, setIsOpen] = useState(initialOpen || false)
  const arrowRef = useRef(null)
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift(), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate,
    transform: false,
    placement: placement
  })

  const hover = useHover(context, {
    handleClose: safePolygon({
      requireIntent: false
    })
  })
  const id = useId()
  const focus = useFocus(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role])
  return (
    <Element ref={refs.setReference} {...getReferenceProps()} className={className}>
      {children}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className='floating'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.2,
              }}
              ref={refs.setFloating}
              style={ {...floatingStyles}}
              {...getFloatingProps()}
            >
              <FloatingArrow  style={{ transform: 'translateY(-1px)' }} className={'w-6 h-5 z-10'} fill='white' ref={arrowRef} context={context} />
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}
