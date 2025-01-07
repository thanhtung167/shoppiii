import { Link, NavLink } from 'react-router-dom'
import path from '../../../../constants/path.ts'
import { Fragment, useContext } from 'react'
import { AppContext } from '../../../../contexts/app.context.tsx'
import { getAvatar } from '../../../../utils/utils.ts'
import classNames from 'classnames'

function UserSideNav() {
  const { profile } = useContext(AppContext)
  return (
    <Fragment>
      <div className={'flex items-center'}>
        <Link to={path.profile} className={'w-12 h-12 flex-shrink-0 overflow-hidden'}>
          <img className={'object-cover w-full h-full rounded-full'}
               src={getAvatar(profile?.avatar)} alt={'avt'} />
        </Link>
        <div className="flex-grow pl-4">
          <div className="mb-1 truncate text-gray-600 font-semibold">{profile?.email}</div>
          <NavLink to={path.profile} className={() =>
            classNames('flex items-center text-gray-500 capitalize', )}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
            <span className={'ml-2'}>Sửa hồ sơ</span>
          </NavLink>
        </div>
      </div>
      <div className="mt-7">
        <NavLink to={path.profile} className={({ isActive }) =>
          classNames('flex items-center text-gray-500 capitalize', {
            'text-orange': isActive,
            'text-gray-500': !isActive
          })}>
          <div className={'flex items-center'} >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="size-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <span className={'ml-2'} >tài khoản của tôi</span>
          </div>
        </NavLink>
        <NavLink to={path.changePassword} className={({ isActive }) =>
          classNames('flex items-center text-gray-500 capitalize mt-3', {
            'text-orange': isActive,
            'text-gray-500': !isActive
          })}>
          <div className={'flex items-center'} >
            <span className={'ml-8'} >đổi mật khẩu</span>
          </div>
        </NavLink>
        <NavLink to={path.purchaseHistory} className={({ isActive }) =>
          classNames('flex items-center text-gray-500 capitalize mt-3', {
            'text-orange': isActive,
            'text-gray-500': !isActive
          })}>
          <div className={'flex items-center'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="size-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <span className={'ml-2'}>Lịch sử mua hàng </span>
          </div>
        </NavLink>
      </div>
    </Fragment>

  )
}

export default UserSideNav