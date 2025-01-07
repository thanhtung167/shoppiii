import classNames from 'classnames'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from '../../constants/path.ts'
import { QueryConfig } from '../../../hooks/useQueryConfig.tsx'

interface Props {
  queryConfig: QueryConfig
}
export default function RatingStar({ queryConfig }: Props) {
  const navigate = useNavigate()
  const handleRate = (index: number) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        rating_filter: String(index)
      }).toString()
    })
  }
  return (
    <ul className={'my-3'}>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <li key={index} className={'py-1 pl-2'}>
            <button
              onClick={() => handleRate(5 - index)}
              className={'flex items-center text-sm cursor-pointer'}
            >
              {Array(5)
                .fill(0)
                .map((_, indexStar) => (
                  <svg
                    key={indexStar}
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className={classNames('h-4 w-4  mr-[3px]', {
                      'text-yellow-400 fill-amber-400': indexStar < 5 - index,
                      'text-yellow-400': indexStar >= 5 - index
                    })}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
                    />
                  </svg>
                ))}
              {index > 0 && <span className={'text-sm ml-1'}>trở lên</span>}
            </button>
          </li>
        ))}
    </ul>
  )
}
