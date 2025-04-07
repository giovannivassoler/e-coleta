"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useFormData } from "../hooks/use-form-data"

interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

interface AddressTabProps {
  onPrevious: () => void
}

export function AddressTab({ onPrevious }: AddressTabProps) {
  const { formData, setFormData } = useFormData()
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [cepError, setCepError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validate form fields
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    // Validate CEP
    if (!formData.cep) {
      newErrors.cep = "CEP é obrigatório"
    } else if (formData.cep.replace(/\D/g, "").length !== 8) {
      newErrors.cep = "CEP inválido"
    }

    // Validate address
    if (!formData.endereco) {
      newErrors.endereco = "Endereço é obrigatório"
    }

    // Validate number
    if (!formData.numero) {
      newErrors.numero = "Número é obrigatório"
    }

    // Validate neighborhood
    if (!formData.bairro) {
      newErrors.bairro = "Bairro é obrigatório"
    }

    // Validate city
    if (!formData.cidade) {
      newErrors.cidade = "Cidade é obrigatória"
    }

    // Validate state
    if (!formData.estado) {
      newErrors.estado = "Estado é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData.cep, formData.endereco, formData.numero, formData.bairro, formData.cidade, formData.estado])

  // Update validation whenever form data changes
  useEffect(() => {
    validateForm()
  }, [
    formData.cep,
    formData.endereco,
    formData.numero,
    formData.bairro,
    formData.cidade,
    formData.estado,
    validateForm,
  ])

  // Função para buscar endereço pelo CEP
  const fetchAddressByCep = useCallback(
    async (cep: string) => {
      if (!cep || cep.length !== 9) return

      // Remove caracteres não numéricos
      const cleanCep = cep.replace(/\D/g, "")

      if (cleanCep.length !== 8) return

      setIsLoadingCep(true)
      setCepError(null)

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        const data: ViaCepResponse = await response.json()

        if (data.erro) {
          setCepError("CEP não encontrado")
          return
        }

        setFormData((prev) => ({
          ...prev,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
          complemento: data.complemento || prev.complemento,
        }))
      } catch (error) {
        setCepError("Erro ao buscar o CEP. Tente novamente.")
        console.error("Erro ao buscar CEP:", error)
      } finally {
        setIsLoadingCep(false)
      }
    },
    [setFormData],
  )

  // Formatar o CEP enquanto o usuário digita (99999-999)
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")

    if (value.length > 8) {
      value = value.slice(0, 8)
    }

    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`
    }

    setFormData((prev) => ({
      ...prev,
      cep: value,
    }))

    // Limpar os campos de endereço se o CEP for apagado
    if (value.length < 8) {
      setCepError(null)
      if (value.length === 0) {
        setFormData((prev) => ({
          ...prev,
          endereco: "",
          bairro: "",
          cidade: "",
          estado: "",
        }))
      }
    }
  }

  // Buscar endereço quando o CEP estiver completo
  useEffect(() => {
    const cepWithoutMask = formData.cep.replace(/\D/g, "")
    if (cepWithoutMask.length === 8) {
      fetchAddressByCep(formData.cep)
    }
  }, [formData.cep, fetchAddressByCep])

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCollectTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      collectType: e.target.value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
            CEP
          </label>
          <div className="relative">
            <Input
              id="cep"
              name="cep"
              placeholder="00000-000"
              value={formData.cep}
              onChange={handleCepChange}
              className={`border-green-200 focus-visible:ring-green-500 ${
                cepError || errors.cep ? "border-red-500" : ""
              }`}
            />
            {isLoadingCep && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500 animate-spin" />
            )}
          </div>
          {cepError && <p className="text-red-500 text-xs mt-1">{cepError}</p>}
          {errors.cep && <p className="text-red-500 text-xs mt-1">{errors.cep}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tipo de Coleta</label>
          <select
            value={formData.collectType}
            onChange={handleCollectTypeChange}
            className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="residential">Residencial</option>
            <option value="commercial">Comercial</option>
            <option value="industrial">Industrial</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="street" className="block text-sm font-medium text-gray-700">
            Rua
          </label>
          <Input
            id="endereco"
            name="endereco"
            placeholder="Nome da rua"
            value={formData.endereco}
            onChange={handleAddressChange}
            className={`border-green-200 focus-visible:ring-green-500 bg-green-50 ${
              errors.endereco ? "border-red-500" : ""
            }`}
            readOnly
          />
          {errors.endereco && <p className="text-red-500 text-xs mt-1">{errors.endereco}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="number" className="block text-sm font-medium text-gray-700">
            Número
          </label>
          <Input
            id="numero"
            name="numero"
            placeholder="123"
            value={formData.numero}
            onChange={handleAddressChange}
            className={`border-green-200 focus-visible:ring-green-500 ${errors.numero ? "border-red-500" : ""}`}
          />
          {errors.numero && <p className="text-red-500 text-xs mt-1">{errors.numero}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="complement" className="block text-sm font-medium text-gray-700">
            Complemento
          </label>
          <Input
            id="complemento"
            name="complemento"
            placeholder="Apto, Bloco, etc."
            value={formData.complemento}
            onChange={handleAddressChange}
            className="border-green-200 focus-visible:ring-green-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
            Bairro
          </label>
          <Input
            id="bairro"
            name="bairro"
            placeholder="Seu bairro"
            value={formData.bairro}
            onChange={handleAddressChange}
            className={`border-green-200 focus-visible:ring-green-500 bg-green-50 ${
              errors.bairro ? "border-red-500" : ""
            }`}
            readOnly
          />
          {errors.bairro && <p className="text-red-500 text-xs mt-1">{errors.bairro}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Cidade
          </label>
          <Input
            id="cidade"
            name="cidade"
            placeholder="Sua cidade"
            value={formData.cidade}
            onChange={handleAddressChange}
            className={`border-green-200 focus-visible:ring-green-500 bg-green-50 ${
              errors.cidade ? "border-red-500" : ""
            }`}
            readOnly
          />
          {errors.cidade && <p className="text-red-500 text-xs mt-1">{errors.cidade}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <Input
            id="estado"
            name="estado"
            placeholder="Estado"
            value={formData.estado}
            onChange={handleAddressChange}
            className={`border-green-200 focus-visible:ring-green-500 bg-green-50 ${
              errors.estado ? "border-red-500" : ""
            }`}
            readOnly
          />
          {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado}</p>}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={onPrevious}
          variant="outline"
          className="border-green-200 text-green-700 hover:bg-green-50 mr-2"
        >
          Voltar
        </Button>
      </div>
    </div>
  )
}

