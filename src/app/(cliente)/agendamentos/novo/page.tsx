"use client"

import { FormProvider } from "./hooks/use-form-data"
import AgendarColeta from "./agendar-coleta"

export default function AppWrapper() {
  return (
    <FormProvider>
      <AgendarColeta />
    </FormProvider>
  )
}

