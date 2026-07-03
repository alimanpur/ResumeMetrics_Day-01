import { useState, useEffect, useRef, useCallback } from 'react'

const useAnimation = (duration = 300, delay = 0) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutRef = useRef(null)

  const animate = useCallback((callback) => {
    setIsAnimating(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    
    timeoutRef.current = setTimeout(() => {
      callback?.()
      setIsAnimating(false)
    }, duration + delay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [duration, delay])

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  return { isAnimating, animate }
}

export function useCountUp(end, start = 0, duration = 1000, options = {}) {
  const { decimals = 0, separator = false, trigger = true } = options
  const endValue = parseFloat(end) || 0
  const [count, setCount] = useState(start)
  const [isAnimating, setIsAnimating] = useState(false)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!trigger || isNaN(endValue)) {
      setCount(start)
      return
    }
    
    setIsAnimating(true)
    const range = endValue - start
    const startTime = performance.now()
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = start + range * easeOutQuart
      
      setCount(parseFloat(current.toFixed(decimals)))
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }
    
    frameRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [endValue, start, duration, trigger, decimals])

  return { count, isAnimating }
}

export function useStagger(items, delay = 50) {
  const [visibleItems, setVisibleItems] = useState(new Set())
  const timeoutRefs = useRef([])

  useEffect(() => {
    setVisibleItems(new Set())
    timeoutRefs.current.forEach(t => clearTimeout(t))
    timeoutRefs.current = []
    
    items.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, index]))
      }, index * delay)
      timeoutRefs.current[index] = timeout
    })
    
    return () => {
      timeoutRefs.current.forEach(t => clearTimeout(t))
    }
  }, [items, delay])

  return visibleItems
}

export function useChartAnimation(isVisible = true, duration = 800) {
  const [animated, setAnimated] = useState(false)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true
      setAnimated(true)
    }
  }, [isVisible])

  return { animated }
}

export function useMotionPreference() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    
    const handler = (e) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

export default useAnimation