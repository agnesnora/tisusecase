'use client'
import dynamic from 'next/dynamic'
import { MeterType } from '@/schemas/meters'

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div>Térkép betöltése...</div>
})

interface MapWrapperProps {
  gasMeters: MeterType[]
  electricityMeters: MeterType[]
}

export default function MapWrapper({ gasMeters, electricityMeters }: MapWrapperProps) {
  return <MapComponent gasMeters={gasMeters} electricityMeters={electricityMeters} />
}