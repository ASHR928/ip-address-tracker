import React, { useEffect, useMemo } from "react"
import { Marker, Popup, useMap } from "react-leaflet"
import icon from "./icon"

export default function Markerposition({ address }) {
  const position = useMemo(() => {
    return [address.lat, address.lon]
  }, [address.lat, address.lon])
  const map = useMap()

  useEffect(() => {
    map.flyTo(position, 13, {
      animate: true,
    })
  }, [map, position])

  return (
    <>
      <Marker icon={icon} position={position}>
        <Popup>This is the location of the IP Address or Domain</Popup>
      </Marker>
    </>
  )
}