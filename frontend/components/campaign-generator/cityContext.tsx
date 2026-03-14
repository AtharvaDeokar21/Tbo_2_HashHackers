"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CityContext = createContext<any>(null)

export const CityProvider = ({ children }: any) => {
  const [city, setCity] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("city")
    if (saved) setCity(saved)
  }, [])

  const updateCity = (newCity: string) => {
    setCity(newCity)
    localStorage.setItem("city", newCity)
  }

  return (
    <CityContext.Provider value={{ city, updateCity }}>
      {children}
    </CityContext.Provider>
  )
}

export const useCity = () => useContext(CityContext)