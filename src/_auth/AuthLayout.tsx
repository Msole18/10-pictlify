import { Navigate, Outlet } from 'react-router-dom'

export const AuthLayout = () => {
  const isAuthenticated = false

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <img
            alt="a logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
            src="/assets/images/pictlify-side.png"
          />

          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>
        </>
      )}
    </>
  )
}
