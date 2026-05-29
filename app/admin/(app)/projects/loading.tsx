import { TableSkeleton } from '@/components/admin/shared/Skeleton'

export default function Loading() {
  return (
    <div className="kf-anim-in">
      <TableSkeleton />
    </div>
  )
}
