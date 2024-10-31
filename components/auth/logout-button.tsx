'use client'

import { logout } from "@/actions/logout"
// import { signOut } from "next-auth/react"
import React from "react"

interface LogoutButtonProps {
    children : React.ReactNode
}

const LogoutButton= ({children}: LogoutButtonProps) => {

    const onClick = () => {
        // signOut()
        logout()
    }
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  )
}

export default LogoutButton
