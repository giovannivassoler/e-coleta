"use client"

import type React from "react"

import { useState, createContext, useContext, type ReactNode } from "react"

interface ItensDescarte {
  computador: boolean
  monitores: boolean
  pilhasBaterias: boolean
  outros: boolean
  celulares: boolean
  televisores: boolean
  eletrodomesticos: boolean
}

interface PersonalInfo {
  nome: string
  email: string
  telefone: string
  cpf: string
}

export interface FormData {
  data: string
  horario: string
  cep: string
  numero: string
  complemento: string
  endereco: string
  estado: string
  cidade: string
  bairro: string
  outroEndereco: boolean
  itensDescarte: ItensDescarte
  descricao: string
  collectType: string
  personalInfo: PersonalInfo
}

interface FormContextType {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  toggleWasteItem: (id: number) => void
}

const initialFormData: FormData = {
  data: "",
  horario: "",
  cep: "",
  numero: "",
  complemento: "",
  endereco: "",
  estado: "",
  cidade: "",
  bairro: "",
  outroEndereco: false,
  itensDescarte: {
    computador: false,
    monitores: false,
    pilhasBaterias: false,
    outros: false,
    celulares: false,
    televisores: false,
    eletrodomesticos: false,
  },
  descricao: "",
  collectType: "residential",
  personalInfo: {
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
  },
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const toggleWasteItem = (id: number) => {
    const wasteItems = [
      { id: 1, name: "computador" },
      { id: 2, name: "monitores" },
      { id: 3, name: "pilhasBaterias" },
      { id: 4, name: "celulares" },
      { id: 5, name: "televisores" },
      { id: 6, name: "eletrodomesticos" },
      { id: 7, name: "outros" },
    ]

    const item = wasteItems.find((item) => item.id === id)
    if (item) {
      const itemName = item.name as keyof ItensDescarte
      setFormData((prev) => ({
        ...prev,
        itensDescarte: {
          ...prev.itensDescarte,
          [itemName]: !prev.itensDescarte[itemName],
        },
      }))
    }
  }

  return <FormContext.Provider value={{ formData, setFormData, toggleWasteItem }}>{children}</FormContext.Provider>
}

export function useFormData() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error("useFormData must be used within a FormProvider")
  }
  return context
}

