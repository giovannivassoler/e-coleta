"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { useFormData } from "../hooks/use-form-data"

interface ScheduleTabProps {
  onNext: () => void
  onPrevious: () => void
}

export function ScheduleTab({ onNext, onPrevious }: ScheduleTabProps) {
  const { formData, setFormData } = useFormData()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isFormValid, setIsFormValid] = useState(false)

  // Estados para os seletores de data e hora
  const [showCalendar, setShowCalendar] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Refs para detectar cliques fora dos seletores
  const calendarRef = useRef<HTMLDivElement>(null)
  const timePickerRef = useRef<HTMLDivElement>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)
  const timeInputRef = useRef<HTMLInputElement>(null)

  // Calcular limites de data (hoje até 2 meses no futuro)
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Resetar horas para comparação correta

  const maxDate = new Date(today)
  maxDate.setMonth(today.getMonth() + 2) // 2 meses a partir de hoje

  // Validate form fields - wrapped in useCallback to prevent infinite loops
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    // Validate date
    if (!formData.data) {
      newErrors.data = "Data é obrigatória"
    }

    // Validate time
    if (!formData.horario) {
      newErrors.horario = "Horário é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData.data, formData.horario])

  // Check form validity whenever form data changes
  useEffect(() => {
    setIsFormValid(validateForm())
  }, [formData.data, formData.horario, validateForm])

  // Handle next button click
  const handleNext = () => {
    const isValid = validateForm()
    if (isValid) {
      onNext()
    }
  }

  // Fechar calendário e seletor de hora ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        dateInputRef.current &&
        !dateInputRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false)
      }

      if (
        timePickerRef.current &&
        !timePickerRef.current.contains(event.target as Node) &&
        timeInputRef.current &&
        !timeInputRef.current.contains(event.target as Node)
      ) {
        setShowTimePicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Inicializar o calendário com o mês atual ao abrir
  useEffect(() => {
    if (showCalendar) {
      setCurrentMonth(new Date())
    }
  }, [showCalendar])

  // Funções para o calendário
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() - 1)

    // Não permitir navegar para meses anteriores ao atual
    if (newDate.getMonth() >= today.getMonth() && newDate.getFullYear() >= today.getFullYear()) {
      setCurrentMonth(newDate)
    }
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + 1)

    // Não permitir navegar para meses além do limite (2 meses a partir de hoje)
    if (newDate.getTime() <= maxDate.getTime()) {
      setCurrentMonth(newDate)
    }
  }

  const isDateSelectable = (date: Date) => {
    // Verificar se a data está entre hoje e o limite máximo (2 meses)
    return date >= today && date <= maxDate
  }

  const handleSelectDate = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const selectedDate = new Date(year, month, day)

    // Verificar se a data é selecionável
    if (!isDateSelectable(selectedDate)) return

    const formattedDay = day < 10 ? `0${day}` : day
    const formattedMonth = month + 1 < 10 ? `0${month + 1}` : month + 1

    setFormData((prev) => ({
      ...prev,
      data: `${formattedDay}/${formattedMonth}/${year}`,
    }))

    setShowCalendar(false)
  }

  // Renderizar o calendário
  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ]

    // Verificar se o mês atual é o mês atual do calendário
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year

    // Verificar se o mês atual é o mês máximo permitido
    const isMaxMonth = maxDate.getMonth() === month && maxDate.getFullYear() === year

    const days = []

    // Adicionar dias vazios para o início do mês
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>)
    }

    // Adicionar os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()

      // Verificar se a data está no passado ou além do limite
      const isPast = isCurrentMonth && day < today.getDate()
      const isFuture = isMaxMonth && day > maxDate.getDate()
      const isDisabled = isPast || isFuture || !isDateSelectable(date)

      days.push(
        <button
          key={`day-${day}`}
          type="button"
          onClick={() => handleSelectDate(day)}
          disabled={isDisabled}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm
                     ${isToday ? "bg-green-100 text-green-700" : ""}
                     ${isDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-green-50 cursor-pointer"}`}
        >
          {day}
        </button>,
      )
    }

    // Verificar se deve desabilitar os botões de navegação
    const isPrevMonthDisabled = today.getMonth() === month && today.getFullYear() === year
    const isNextMonthDisabled = maxDate.getMonth() <= month && maxDate.getFullYear() <= year

    return (
      <div
        ref={calendarRef}
        className="absolute z-10 mt-1 bg-white border border-green-200 rounded-md shadow-lg p-3 w-64"
      >
        <div className="flex justify-between items-center mb-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={isPrevMonthDisabled}
            className={`p-1 rounded-full ${
              isPrevMonthDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-green-50 text-green-700"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-sm font-medium text-green-800">
            {monthNames[month]} {year}
          </div>
          <button
            type="button"
            onClick={handleNextMonth}
            disabled={isNextMonthDisabled}
            className={`p-1 rounded-full ${
              isNextMonthDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-green-50 text-green-700"
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
            <div key={index} className="h-8 w-8 flex items-center justify-center text-xs text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Selecione uma data entre hoje e {maxDate.toLocaleDateString("pt-BR")}
        </div>
      </div>
    )
  }

  // Gerar horários de 30 em 30 minutos das 8h às 17h
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour <= 17; hour++) {
      const hourStr = hour < 10 ? `0${hour}` : `${hour}`

      // Adicionar slot para hora cheia (XX:00)
      slots.push(`${hourStr}:00`)

      // Adicionar slot para meia hora (XX:30), exceto para 17:30 que está fora do horário
      if (hour < 17) {
        slots.push(`${hourStr}:30`)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Funções para o seletor de hora
  const handleSelectTime = (hour: string) => {
    setFormData((prev) => ({
      ...prev,
      horario: hour,
    }))

    setShowTimePicker(false)
  }

  // Renderizar o seletor de hora
  const renderTimePicker = () => {
    const hours = []

    // Horários disponíveis (8h às 17h, de 30 em 30 minutos)
    for (const timeSlot of timeSlots) {
      hours.push(
        <button
          key={`time-${timeSlot}`}
          type="button"
          onClick={() => handleSelectTime(timeSlot)}
          className="w-full text-left px-3 py-2 hover:bg-green-50 text-sm"
        >
          {timeSlot}
        </button>,
      )
    }

    return (
      <div
        ref={timePickerRef}
        className="absolute z-10 mt-1 bg-white border border-green-200 rounded-md shadow-lg p-1 w-40"
      >
        <div className="max-h-48 overflow-y-auto">{hours}</div>
      </div>
    )
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Data da Coleta</label>
          <div className="relative">
            <Input
              id="data"
              name="data"
              type="text"
              placeholder="dd/mm/aaaa"
              value={formData.data}
              onChange={handleAddressChange}
              onClick={() => setShowCalendar(true)}
              readOnly
              ref={dateInputRef}
              className={`w-full border-green-200 focus-visible:ring-green-500 cursor-pointer ${
                errors.data ? "border-red-500" : ""
              }`}
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500 pointer-events-none" />
            {showCalendar && renderCalendar()}
          </div>
          {errors.data && <p className="text-red-500 text-xs mt-1">{errors.data}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Horário Preferencial</label>
          <div className="relative">
            <Input
              id="horario"
              name="horario"
              type="text"
              placeholder="--:--"
              value={formData.horario}
              onChange={handleAddressChange}
              onClick={() => setShowTimePicker(true)}
              readOnly
              ref={timeInputRef}
              className={`w-full border-green-200 focus-visible:ring-green-500 cursor-pointer ${
                errors.horario ? "border-red-500" : ""
              }`}
            />
            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500 pointer-events-none" />
            {showTimePicker && renderTimePicker()}
          </div>
          {errors.horario && <p className="text-red-500 text-xs mt-1">{errors.horario}</p>}
        </div>
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

