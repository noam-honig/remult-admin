import { PropsWithChildren } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'

export const AppLink = ({
  to,
  children: text,
}: { key: string; to: string } & PropsWithChildren) => {
  const location = useLocation()

  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1)

  return (
    <Link
      style={{
        marginRight: '10px',
        textDecoration: 'none',
        fontWeight: !!matchPath({ path: to }, location.pathname)
          ? 'bold'
          : 'normal',
        color: 'rgb(25, 118, 210)',
      }}
      to={to}
    >
      {capitalize(text as string)}
    </Link>
  )
}
