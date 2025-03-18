"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Recycle, Cpu, Monitor, Battery, Smartphone, Tv, Laptop } from "lucide-react"
import { useFormData } from "../hooks/use-form-data"

interface ItemsTabProps {
  onNext: () => void
  onPrevious: () => void
}

export function ItemsTab({ onNext, onPrevious }: ItemsTabProps) {
  const { formData, setFormData, toggleWasteItem } = useFormData()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isFormValid, setIsFormValid] = useState(false)

  // Validate form fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Check if at least one item is selected
    const hasSelectedItems = Object.values(formData.itensDescarte).some((value) => value === true)

    if (!hasSelectedItems) {
      newErrors.items = "Selecione pelo menos um item para descarte"
    }

    // Validate description if any item is selected
    if (hasSelectedItems && !formData.descricao.trim()) {
      newErrors.descricao = "Descreva os itens para descarte"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Check form validity whenever form data changes
  useEffect(() => {
    setIsFormValid(validateForm())
  }, [formData.itensDescarte, formData.descricao])

  // Handle next button click
  const handleNext = () => {
    const isValid = validateForm()
    if (isValid) {
      onNext()
    }
  }

  const wasteItemsList = [
    {
      id: 1,
      name: "Computador",
      type: "computador",
      selected: formData.itensDescarte.computador,
      icon: <Cpu className="h-4 w-4" />,
    },
    {
      id: 2,
      name: "Monitor",
      type: "monitores",
      selected: formData.itensDescarte.monitores,
      icon: <Monitor className="h-4 w-4" />,
    },
    {
      id: 3,
      name: "Pilhas e baterias",
      type: "pilhasBaterias",
      selected: formData.itensDescarte.pilhasBaterias,
      icon: <Battery className="h-4 w-4" />,
    },
    {
      id: 4,
      name: "Celulares",
      type: "celulares",
      selected: formData.itensDescarte.celulares,
      icon: <Smartphone className="h-4 w-4" />,
    },
    {
      id: 5,
      name: "Televisores",
      type: "televisores",
      selected: formData.itensDescarte.televisores,
      icon: <Tv className="h-4 w-4" />,
    },
    {
      id: 6,
      name: "Eletrodomésticos",
      type: "eletrodomesticos",
      selected: formData.itensDescarte.eletrodomesticos,
      icon: <Laptop className="h-4 w-4" />,
    },
  ]

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Selecione os itens para descarte</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {wasteItemsList.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer transition-colors ${
              item.selected ? "bg-green-100 border-green-500" : "border-gray-200 hover:border-green-300"
            }`}
            onClick={() => toggleWasteItem(item.id)}
          >
            <div
              className={`p-2 rounded-full ${item.selected ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"}`}
            >
              {item.icon}
            </div>
            <span className="font-medium">{item.name}</span>
          </div>
        ))}
      </div>
      {errors.items && <p className="text-red-500 text-xs mt-1">{errors.items}</p>}

      <div className="mt-6">
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
          Descreva os itens
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              descricao: e.target.value,
            }))
          }
          placeholder="Descreva quais itens e a quantidade para coleta"
          className={`mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px] ${
            errors.descricao ? "border-red-500" : "border-green-200"
          }`}
        />
        {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao}</p>}
      </div>

      <div className="bg-green-50 p-4 rounded-md border border-green-100 mt-4">
        <h4 className="font-medium text-green-800 flex items-center gap-2">
          <Recycle className="h-5 w-5" />
          Informações importantes
        </h4>
        <ul className="mt-2 text-sm text-gray-600 space-y-1">
          <li>• Remova dados pessoais de dispositivos de armazenamento</li>
          <li>• Separe baterias e pilhas em embalagens separadas</li>
          <li>• Embale itens frágeis adequadamente</li>
          <li>• Equipamentos muito grandes podem exigir agendamento especial</li>
        </ul>
      </div>
      <div className="flex justify-between mt-6">
        <Button onClick={onPrevious} variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
          Voltar
        </Button>
        <Button
          onClick={handleNext}
          className={`${
            isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-green-300 cursor-not-allowed"
          } text-white`}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}

