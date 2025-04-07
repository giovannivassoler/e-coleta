"use client"

import React, { createContext, useState, useContext } from "react"

interface ItensDescarte {
  computador: boolean
  monitores: boolean
  pilhasBaterias: boolean
  outros: boolean
  celulares: boolean
  televisores: boolean
  eletrodomesticos: boolean
}

interface Quantidades {
  computador: number
  monitores: number
  pilhasBaterias: number
  outros: number
  celulares: number
  televisores: number
  eletrodomesticos: number
}

interface Observacoes {
  computador: string
  monitores: string
  pilhasBaterias: string
  outros: string
  celulares: string
  televisores: string
  eletrodomesticos: string
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
  quantidades: Quantidades
  observacoes: Observacoes
  descricao: string
  collectType: string
  personalInfo: PersonalInfo
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
  quantidades: {
    computador: 0,
    monitores: 0,
    pilhasBaterias: 0,
    outros: 0,
    celulares: 0,
    televisores: 0,
    eletrodomesticos: 0,
  },
  observacoes: {
    computador: "",
    monitores: "",
    pilhasBaterias: "",
    outros: "",
    celulares: "",
    televisores: "",
    eletrodomesticos: "",
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

interface FormContextType {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  toggleWasteItem: (id: number) => void
  incrementQuantity: (itemName: keyof Quantidades) => void
  decrementQuantity: (itemName: keyof Quantidades) => void
  updateObservacao: (itemName: keyof Observacoes, value: string) => void
}

const FormContext = createContext<FormContextType>({
  formData: initialFormData,
  setFormData: () => {},
  toggleWasteItem: () => {},
  incrementQuantity: () => {},
  decrementQuantity: () => {},
  updateObservacao: () => {},
})

interface FormDataProviderProps {
  children: React.ReactNode
}

export const FormDataProvider: React.FC<FormDataProviderProps> = ({ children }) => {
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
      const newValue = !formData.itensDescarte[itemName]
      
      setFormData((prev) => ({
        ...prev,
        itensDescarte: {
          ...prev.itensDescarte,
          [itemName]: newValue,
        },
        quantidades: {
          ...prev.quantidades,
          [itemName]: newValue ? 1 : 0, // Set to 1 when selected, 0 when deselected
        },
        // Reset observation when item is deselected
        observacoes: {
          ...prev.observacoes,
          [itemName]: newValue ? prev.observacoes[itemName as keyof Observacoes] : "",
        },
      }))
    }
  }

  const incrementQuantity = (itemName: keyof Quantidades) => {
    setFormData((prev) => ({
      ...prev,
      quantidades: {
        ...prev.quantidades,
        [itemName]: prev.quantidades[itemName] + 1
      }
    }))
  }

  const decrementQuantity = (itemName: keyof Quantidades) => {
    if (formData.quantidades[itemName] > 1) {
      setFormData((prev) => ({
        ...prev,
        quantidades: {
          ...prev.quantidades,
          [itemName]: prev.quantidades[itemName] - 1
        }
      }))
    }
  }

  const updateObservacao = (itemName: keyof Observacoes, value: string) => {
    setFormData((prev) => ({
      ...prev,
      observacoes: {
        ...prev.observacoes,
        [itemName]: value
      }
    }))
  }

  return (
    <FormContext.Provider 
      value={{ 
        formData, 
        setFormData, 
        toggleWasteItem, 
        incrementQuantity, 
        decrementQuantity,
        updateObservacao
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export const useFormData = () => useContext(FormContext)
