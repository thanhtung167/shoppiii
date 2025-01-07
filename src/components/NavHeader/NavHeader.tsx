import Popover from '../Popover/Popover.tsx'
import path from '../../constants/path.ts'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context.tsx'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logoutApi } from '../../apis/auth.apis.ts'
import { purchaseStatus } from '../../constants/purchases.ts'
import { getAvatar } from '../../utils/utils.ts'

function NavHeader() {
  const queryClient = useQueryClient()
  const { setIsAuthenticated, isAuthenticate, setProfile, profile } = useContext(AppContext)
  const logoutOutMutation = useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      setProfile(null)
      setIsAuthenticated(false)
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchaseStatus.inCart }] })
    }
  })
  const handleLogout = () => {
    logoutOutMutation.mutate()
  }
  return (
    <div className='flex justify-end gap-4 py-1'>
      <Popover
        className={'flex items-center py-1 cursor-pointer hover:text-white/70'}
        renderPopover={
          <div className={'bg-white relative shadow-sm rounded-sm border border-gray-200 text-sm w-48'}>
            <div className={'flex flex-col py-2 px-2'}>
              <button className='text-left py-1 px-1 hover:text-orange'>Tiếng Việt</button>
              <button className='text-left py-1 px-1 mt-2 hover:text-orange'>English</button>
            </div>
          </div>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span className='mx-1'>Tiếng việt</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>
      {isAuthenticate && (
        <Popover
          placement={'bottom'}
          renderPopover={
            <div className={'text-sm relative bg-white border shadow-sm rounded-sm border-gray-200'}>
              <Link
                to={path.profile}
                className={'block w-full py-2 px-3 bg-white hover:bg-slate-100 hover:text-cyan-500 '}
              >
                Tài khoản của tôi
              </Link>
              <Link to={'/'} className={'block w-full py-2 px-3 bg-white hover:bg-slate-100 hover:text-cyan-500 '}>
                Đơn mua
              </Link>
              <button
                onClick={handleLogout}
                className={'block w-full text-left py-2 px-3 bg-white hover:bg-slate-100 hover:text-cyan-500 '}
              >
                Đăng xuất
              </button>
            </div>
          }
          className={'flex items-center py-1 cursor-pointer hover:text-gray-300'}
        >
          <div className='w-5 h-5 mr-2 flex-shrink-0'>
            <img
              className={'w-full h-full object-cover rounded-full'}
              src={getAvatar( profile?.avatar)}
              alt={'avatar'}
            />
          </div>
          <div>{profile?.email}</div>
        </Popover>
      )}

      {!isAuthenticate && (
        <div className='flex items-center'>
          <Link to={path.register} className={'mx-3 capitalize hover:text-white/70 text-white'}>
            Đăng ký
          </Link>
          <div className={'border-r-white/40 border-r-[1px] h-4 '}></div>
          <Link to={path.login} className={'mx-3 capitalize hover:text-white/70 text-white'}>
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  )
}

export default NavHeader