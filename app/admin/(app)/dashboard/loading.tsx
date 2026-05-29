import { CardGridSkeleton } from '@/components/admin/shared/Skeleton'

export default function Loading() {
  return (
    <div className="kf-anim-in">
      <CardGridSkeleton cards={4} />
    </div>
  )
}
