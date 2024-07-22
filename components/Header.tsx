import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

/**
 * A header component that renders a logo and some children.
 * The logo is either a text logo or an icon logo depending on the screen size.
 * The text logo is only visible on medium and larger screens, while the icon logo is only visible on smaller screens.
 * The children are rendered on the right side of the logo.
 */
const Header = ({ children, className }: HeaderProps) => {
  return (
    <div className={cn("header", className)}>
      {/* The logo is rendered as a link to the homepage. The link is given the class 'md:flex-1' which makes it take up all the available space on medium and larger screens. */}
      <Link href='/' className="md:flex-1">
        {/* The text logo is rendered as an image with the alt text 'Logo with name'. It is only visible on medium and larger screens. */}
        <Image 
          src="/assets/icons/logo.svg"
          alt="Logo with name"
          width={120}
          height={32}
          className="hidden md:block"
        />
        {/* The icon logo is rendered as an image with the alt text 'Logo'. It is only visible on smaller screens. */}
        <Image 
          src="/assets/icons/logo-icon.svg"
          alt="Logo"
          width={32}
          height={32}
          className="mr-2 md:hidden"
        />
      </Link>
      {/* The children are rendered on the right side of the logo. */}
      {children}
    </div>
  )
}

export default Header