"use client"
import { useAuth } from '@/context/AuthContext'
import { useUser } from '@/lib/firestore/user/read'
import { Badge } from '@nextui-org/react'
import { Heart, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function HeaderClientButtons() {
  const { user } = useAuth()
  const { data } = useUser({ uid: user?.uid })
  
  const favoritesCount = data?.favorites?.length ?? 0
  const cartsCount = data?.carts?.length ?? 0

  return (
    <div className="flex items-center space-x-1 md:space-x-4 relative">
      {/* Favorites Button with Badge */}
      <Link href={'/favorites'} className="relative">
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-purple-100 relative">
            <Heart className="h-6 w-6 text-purple-700" />
          </button>
          {favoritesCount > 0 && (
            <Badge
              content={favoritesCount}
              className="absolute -top-8 -right-1 border bg-pink-500 font-semibold text-white text-xs px-1.5 rounded-full shadow-md"
            />
          )}
        </div>
      </Link>
      
      {/* Cart Button */}
      <Link href={'/cart'} className="relative">
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-purple-100 relative">
            <ShoppingCart className="h-6 w-6 text-purple-700" />
          </button>
          {cartsCount > 0 && (
            <Badge
              content={cartsCount}
              className="absolute -top-8 -right-1 border bg-pink-500 font-semibold text-white text-xs px-1.5 rounded-full shadow-md"
            />
          )}
        </div>
      </Link>
    </div>
  )
}

export default HeaderClientButtons