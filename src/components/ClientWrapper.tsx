"use client"

import { ReactNode, useEffect } from 'react'
import { useLabelsStore } from "@/stores/LabelsStore"

interface ClientWrapperProps {
    children: ReactNode
    labels?: any
}

/**
 * This component exists to allow the usage of translatable labels via Zustand.
 */
export default function ClientWrapper({ children, labels }: ClientWrapperProps) {
    const { setLabels } = useLabelsStore()

    useEffect(() => {
        if (labels) {
            setLabels(labels['labels'])
        }
    }, [labels, setLabels])

    return <>{children}</>
}
