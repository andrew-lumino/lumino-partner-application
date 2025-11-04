import { useRef, useEffect } from "react"

function useInfiniteScroll(callback: () => void, hasMore: boolean, loading: boolean) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (loading) return
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) {
        callback()
      }
    })

    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current)
  }, [callback, hasMore, loading])

  return sentinelRef
}
