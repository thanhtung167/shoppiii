import { createContext, useState } from 'react'
import { getAccessToken, getUserProfile } from '../utils/auth.ts'
import * as React from 'react'
import { User } from '../types/user.type.ts'
import { ExtendPurchase } from '../types/purchases.type.ts'

interface AppContextInterface {
  isAuthenticate: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  profile: User | null
  extendedPurchase: ExtendPurchase[]
  setExtendedPurchase: React.Dispatch<React.SetStateAction<ExtendPurchase[]>>
}

const initAppContext: AppContextInterface = {
  isAuthenticate: Boolean(getAccessToken()),
  setIsAuthenticated: () => null,
  setProfile: () => null,
  profile: getUserProfile(),
  extendedPurchase: [],
  setExtendedPurchase: () => null
}

export const AppContext = createContext<AppContextInterface>(initAppContext)
export const Approvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticate, setIsAuthenticated] = useState<boolean>(initAppContext.isAuthenticate)
  const [extendedPurchase, setExtendedPurchase] = useState<ExtendPurchase[]>(initAppContext.extendedPurchase)
  const [profile, setProfile] = useState<User | null>(initAppContext.profile)
  return (
    <AppContext.Provider value={{ isAuthenticate, setIsAuthenticated, profile, setProfile,extendedPurchase,setExtendedPurchase }}>
      {children}
    </AppContext.Provider>
  )
}
