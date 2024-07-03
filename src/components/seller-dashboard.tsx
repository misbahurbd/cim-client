/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from '@/components/loading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { selectCurrentUser } from '@/redux/features/auth/auth-slice'
import { useGetTopProductsQuery, useSellerOrderHistoryQuery } from '@/redux/features/order/orderApi'
import { useAppSelector } from '@/redux/hooks'
import { DollarSign, PackageOpen, ShoppingBag } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

const SellerDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentUser = useAppSelector(selectCurrentUser)

  const { data: historyData, isLoading } = useSellerOrderHistoryQuery({
    userId: currentUser?.id || '',
    query: { dateRange: 'weekly', ...Object.fromEntries([...searchParams]) },
  })
  const { data: topProduct, isLoading: isTopProductLoading } = useGetTopProductsQuery({
    userId: currentUser?.id || '',
    query: { dateRange: 'weekly', ...Object.fromEntries([...searchParams]) },
  })

  const handleChange = (value: string) => {
    searchParams.set('dateRange', value)
    setSearchParams(searchParams)
  }

  const tabsData = [
    {
      label: 'Total Revenue',
      value: historyData?.meta?.totalRevenue || 0,
      icon: DollarSign,
      sign: '$',
    },
    {
      label: 'Total Order',
      value: historyData?.meta?.totalOrder || 0,
      icon: ShoppingBag,
      sign: '+',
    },
    {
      label: 'Active Products',
      value: historyData?.meta?.totalProduct || 0,
      icon: PackageOpen,
      sign: '+',
    },
  ]

  if (isLoading) {
    return <Loading />
  }

  return (
    <section className='space-y-5'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Dashboard</h1>

        <div className='flex items-center gap-2'>
          <span>Sell history</span>
          <Select
            onValueChange={handleChange}
            defaultValue={searchParams.get('dateRange') || 'weekly'}>
            <SelectTrigger className='w-[100px]'>
              <SelectValue placeholder='Theme' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='daily'>Daily</SelectItem>
              <SelectItem value='weekly'>Weekly</SelectItem>
              <SelectItem value='monthly'>Monthly</SelectItem>
              <SelectItem value='yearly'>Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='grid gap-3 md:grid-cols-3'>
        {tabsData.map((tab) => (
          <Card
            className='flex-1'
            key={tab.label}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{tab.label}</CardTitle>
              <tab.icon className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {tab.sign}
                {Number(tab.value).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <h2 className='font-bold'>Top Selling Product</h2>
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-3'>
        {isTopProductLoading && <Loading />}
        {topProduct?.data?.length === 0 && (
          <div className=' sm:col-span-2 lg:col-span-3 gap-3 flex flex-col justify-center items-center min-h-72'>
            <PackageOpen className='text-muted-foreground w-12 h-12' />
            <p className='text-muted-foreground'>No order found.</p>
          </div>
        )}
        {topProduct?.data?.map((product: any) => (
          <Card
            key={product._id}
            className='flex flex-col overflow-hidden'>
            <img
              src={product.image}
              alt={product.title}
              className='w-full aspect-[16/12] object-contain object-center'
            />
            <Separator />
            <CardContent className='flex flex-col flex-1 p-0'>
              <div className='p-3 grow space-y-1'>
                <h3 className='font-semibold'>{product.title}</h3>
                <div className='text-sm flex gap-3 items-center'>
                  <div>
                    <span className='text-muted-foreground'>Category: </span>
                    {product.category.name}
                  </div>
                  <Separator className='w-1 h-1 rounded-full' />
                  <div>
                    <span className='text-muted-foreground'>Brand: </span>
                    {product.brand.name}
                  </div>
                </div>
              </div>
              <Separator className='m-0' />
              <div className='flex'>
                <div className='text-center w-full p-2'>
                  <p className='text-lg font-bold'>
                    $
                    {Number(product.totalPrice).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className='text-muted-foreground text-sm'>Total Revenue</p>
                </div>
                <Separator orientation='vertical' />
                <div className='text-center w-full p-2'>
                  <p className='text-lg font-bold'>
                    {Number(product.totalQuantitySold).toLocaleString()}
                  </p>
                  <p className='text-muted-foreground text-sm'>Total Sold</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default SellerDashboard
