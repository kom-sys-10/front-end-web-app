import { Outlet } from 'react-router-dom'
import Header from '../src/componments/header'

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}