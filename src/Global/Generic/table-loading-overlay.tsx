import { MaliFlag } from '@/components/others/mali-flag'

function SpinningRing({
  r,
  stroke,
  dasharray,
  duration,
  direction,
}: {
  r: number
  stroke: string
  dasharray: string
  duration: string
  direction: 'cw' | 'ccw'
}) {
  return (
    <svg
      viewBox='0 0 120 120'
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        animation: `np-spin-${direction} ${duration} linear infinite`,
        transformOrigin: 'center',
      }}
    >
      <circle
        cx='60'
        cy='60'
        r={r}
        fill='none'
        stroke={stroke}
        strokeWidth='5'
        strokeDasharray={dasharray}
        strokeLinecap='round'
      />
    </svg>
  )
}

export function TableLoadingOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        backdropFilter: 'blur(1px)',
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: 'inherit',
      }}
    >
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        {/* Anneau extérieur — Vert (Mali) */}
        <SpinningRing r={54} stroke='#009460' dasharray='200 140' duration='3s'   direction='cw'  />
        {/* Anneau intermédiaire — Jaune/Or (Mali) */}
        <SpinningRing r={40} stroke='#FCD116' dasharray='150 101' duration='2s'   direction='ccw' />
        {/* Anneau intérieur — Rouge (Mali) */}
        <SpinningRing r={26} stroke='#CE1126' dasharray='90 73'   duration='1.2s' direction='cw'  />

        {/* Drapeau du Mali au centre */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MaliFlag width={18} height={12} className='rounded-xs shadow-xs' />
        </div>
      </div>

      <style>{`
        @keyframes np-spin-cw  { from { transform: rotate(0deg);    } to { transform: rotate(360deg);  } }
        @keyframes np-spin-ccw { from { transform: rotate(0deg);    } to { transform: rotate(-360deg); } }
      `}</style>
    </div>
  )
}