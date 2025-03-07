interface ArrowProps {
  direction: 'top' | 'bottom' | 'left' | 'right'
  onClick?: () => void
}

export function Arrow({ direction, onClick }: ArrowProps) {
  const rotation = () => {
    switch (direction) {
      case 'top':
        return 'rotate(90deg)'
      case 'bottom':
        return 'rotate(270deg)'
      case 'left':
        return ''
      case 'right':
        return 'rotate(180deg)'
    }
  }

  return (
    <svg
      width="9"
      height="13"
      viewBox="0 0 9 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: rotation() }}
      onClick={onClick}
    >
      <path
        d="M0.210938 6.19733L7.2753 12.1837L8.3742 11.186L2.56573 6.19733L8.3742 1.20867L7.2753 0.210938L0.210938 6.19733Z"
        fill="black"
      />
    </svg>
  )
}
