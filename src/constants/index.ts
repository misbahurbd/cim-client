import {
  ArchiveIcon,
  ChatBubbleIcon,
  CrumpledPaperIcon,
  CubeIcon,
  DashboardIcon,
  HomeIcon,
  IdCardIcon,
} from '@radix-ui/react-icons'

export const navItems = [
  {
    label: 'Home',
    to: '/',
    icon: HomeIcon,
    role: ['buyer'],
  },
  {
    label: 'Dashboard',
    to: '/',
    icon: DashboardIcon,
    role: ['seller'],
  },
  {
    label: 'Products',
    to: '/products',
    icon: CubeIcon,
    role: ['seller'],
  },
  {
    label: 'Shop',
    to: '/shop',
    icon: CrumpledPaperIcon,
    role: ['buyer'],
  },
  {
    label: 'Coupons',
    to: '/coupons',
    icon: IdCardIcon,
    role: ['seller'],
  },
  {
    label: 'Orders',
    to: '/orders',
    icon: ArchiveIcon,
    role: ['seller', 'buyer'],
  },
  {
    label: 'Requests',
    to: '/requests',
    icon: ChatBubbleIcon,
    role: ['seller', 'buyer'],
  },
]

export const PRODUCT_CONDITION = [
  {
    label: 'New',
    key: 'new',
  },
  {
    label: 'Used',
    key: 'used',
  },
]

export const PRODUCT_COMPATIBILITY = [
  {
    label: 'Windows',
    key: 'windows',
  },
  {
    label: 'Mac',
    key: 'mac',
  },
  {
    label: 'Linux',
    key: 'linux',
  },
]

export const PRODUCT_INTERFACE = [
  {
    label: 'USB',
    key: 'usb',
  },
  {
    label: 'HDMI',
    key: 'hdmi',
  },
  {
    label: 'DisplayPort',
    key: 'displayport',
  },
  {
    label: 'Bluetooth',
    key: 'bluetooth',
  },
  {
    label: 'SATA',
    key: 'sata',
  },
]

export const DISCOUNT_TYPE = {
  percentage: 'percentage',
  amount: 'amount',
}
