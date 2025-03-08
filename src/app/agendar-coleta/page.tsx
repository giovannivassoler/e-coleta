"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "../componentes/navbar";
import { FooterColeta } from "../componentes/footer";

interface ItensDescarte {
  computador: boolean;
  monitores: boolean;
  pilhasBaterias: boolean;
  outros: boolean;
  celulares: boolean;
  televisores: boolean;
  eletrodomesticos: boolean;
}

interface FormData {
  data: string;
  horario: string;
  cep: string;
  numero: string;
  complemento: string;
  endereco: string;
  estado: string;
  cidade: string;
  bairro: string;
  outroEndereco: boolean;
  itensDescarte: ItensDescarte;
  descricao: string;
}

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export default function AgendarColeta() {
  const [formData, setFormData] = useState<FormData>({
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
  });

  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  // Estados para os seletores de data e hora
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Refs para detectar cliques fora dos seletores
  const calendarRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  // Calcular limites de data (hoje até 2 meses no futuro)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Resetar horas para comparação correta

  const maxDate = new Date(today);
  maxDate.setMonth(today.getMonth() + 2); // 2 meses a partir de hoje

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "checkbox" && name.startsWith("itens.")) {
      const itemName = name.split(".")[1] as keyof ItensDescarte;
      setFormData((prev) => ({
        ...prev,
        itensDescarte: {
          ...prev.itensDescarte,
          [itemName]: checked,
        },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Função para buscar endereço pelo CEP
  const fetchAddressByCep = async (cep: string) => {
    if (!cep || cep.length !== 9) return;

    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);
    setCepError(null);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        setCepError("CEP não encontrado");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        endereco: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
        complemento: data.complemento || prev.complemento,
      }));
    } catch (error) {
      setCepError("Erro ao buscar o CEP. Tente novamente.");
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setIsLoadingCep(false);
    }
  };

  // Formatar o CEP enquanto o usuário digita (99999-999)
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }

    setFormData((prev) => ({
      ...prev,
      cep: value,
    }));

    // Limpar os campos de endereço se o CEP for apagado
    if (value.length < 8) {
      setCepError(null);
      if (value.length === 0) {
        setFormData((prev) => ({
          ...prev,
          endereco: "",
          bairro: "",
          cidade: "",
          estado: "",
        }));
      }
    }
  };

  // Buscar endereço quando o CEP estiver completo
  useEffect(() => {
    const cepWithoutMask = formData.cep.replace(/\D/g, "");
    if (cepWithoutMask.length === 8) {
      fetchAddressByCep(formData.cep);
    }
  }, [formData.cep]);

  // Fechar calendário e seletor de hora ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        dateInputRef.current &&
        !dateInputRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }

      if (
        timePickerRef.current &&
        !timePickerRef.current.contains(event.target as Node) &&
        timeInputRef.current &&
        !timeInputRef.current.contains(event.target as Node)
      ) {
        setShowTimePicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Inicializar o calendário com o mês atual ao abrir
  useEffect(() => {
    if (showCalendar) {
      setCurrentMonth(new Date());
    }
  }, [showCalendar]);

  // Funções para o calendário
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);

    // Não permitir navegar para meses anteriores ao atual
    if (
      newDate.getMonth() >= today.getMonth() &&
      newDate.getFullYear() >= today.getFullYear()
    ) {
      setCurrentMonth(newDate);
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);

    // Não permitir navegar para meses além do limite (2 meses a partir de hoje)
    if (newDate.getTime() <= maxDate.getTime()) {
      setCurrentMonth(newDate);
    }
  };

  const isDateSelectable = (date: Date) => {
    // Verificar se a data está entre hoje e o limite máximo (2 meses)
    return date >= today && date <= maxDate;
  };

  const handleSelectDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const selectedDate = new Date(year, month, day);

    // Verificar se a data é selecionável
    if (!isDateSelectable(selectedDate)) return;

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month + 1 < 10 ? `0${month + 1}` : month + 1;

    setFormData((prev) => ({
      ...prev,
      data: `${formattedDay}/${formattedMonth}/${year}`,
    }));

    setShowCalendar(false);
  };

  // Renderizar o calendário
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

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
    ];

    // Verificar se o mês atual é o mês atual do calendário
    const isCurrentMonth =
      today.getMonth() === month && today.getFullYear() === year;

    // Verificar se o mês atual é o mês máximo permitido
    const isMaxMonth =
      maxDate.getMonth() === month && maxDate.getFullYear() === year;

    const days = [];

    // Adicionar dias vazios para o início do mês
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Adicionar os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      // Verificar se a data está no passado ou além do limite
      const isPast = isCurrentMonth && day < today.getDate();
      const isFuture = isMaxMonth && day > maxDate.getDate();
      const isDisabled = isPast || isFuture || !isDateSelectable(date);

      days.push(
        <button
          key={`day-${day}`}
          type="button"
          onClick={() => handleSelectDate(day)}
          disabled={isDisabled}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm
                     ${isToday ? "bg-blue-100 text-blue-700" : ""}
                     ${
                       isDisabled
                         ? "text-gray-300 cursor-not-allowed"
                         : "hover:bg-gray-100 cursor-pointer"
                     }`}
        >
          {day}
        </button>
      );
    }

    // Verificar se deve desabilitar os botões de navegação
    const isPrevMonthDisabled =
      today.getMonth() === month && today.getFullYear() === year;
    const isNextMonthDisabled =
      maxDate.getMonth() <= month && maxDate.getFullYear() <= year;

    return (
      <div
        ref={calendarRef}
        className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3 w-64"
      >
        <div className="flex justify-between items-center mb-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={isPrevMonthDisabled}
            className={`p-1 rounded-full ${
              isPrevMonthDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-sm font-medium">
            {monthNames[month]} {year}
          </div>
          <button
            type="button"
            onClick={handleNextMonth}
            disabled={isNextMonthDisabled}
            className={`p-1 rounded-full ${
              isNextMonthDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
            <div
              key={index}
              className="h-8 w-8 flex items-center justify-center text-xs text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Selecione uma data entre hoje e {maxDate.toLocaleDateString("pt-BR")}
        </div>
      </div>
    );
  };

  // Funções para o seletor de hora
  const handleSelectTime = (hour: string) => {
    setFormData((prev) => ({
      ...prev,
      horario: hour,
    }));

    setShowTimePicker(false);
  };

  // Renderizar o seletor de hora
  const renderTimePicker = () => {
    const hours = [];

    // Horários disponíveis (8h às 18h, de hora em hora)
    for (let hour = 8; hour <= 18; hour++) {
      const formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      hours.push(
        <button
          key={`hour-${hour}`}
          type="button"
          onClick={() => handleSelectTime(formattedHour)}
          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
        >
          {formattedHour}
        </button>
      );
    }

    return (
      <div
        ref={timePickerRef}
        className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-1 w-40"
      >
        <div className="max-h-48 overflow-y-auto">{hours}</div>
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Dados do agendamento:", formData);
    // Aqui você pode implementar a lógica para enviar os dados para o backend
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="container mx-auto p-4 max-w-5xl">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Agendar Coleta</h1>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="data"
                    className="block text-sm font-medium mb-1"
                  >
                    Data
                  </label>
                  <div className="relative">
                    <input
                      id="data"
                      name="data"
                      type="text"
                      placeholder="dd/mm/aaaa"
                      value={formData.data}
                      onChange={handleChange}
                      onClick={() => setShowCalendar(true)}
                      readOnly
                      ref={dateInputRef}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    {showCalendar && renderCalendar()}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="horario"
                    className="block text-sm font-medium mb-1"
                  >
                    Horário
                  </label>
                  <div className="relative">
                    <input
                      id="horario"
                      name="horario"
                      type="text"
                      placeholder="--:--"
                      value={formData.horario}
                      onChange={handleChange}
                      onClick={() => setShowTimePicker(true)}
                      readOnly
                      ref={timeInputRef}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    {showTimePicker && renderTimePicker()}
                  </div>
                </div>
              </div>

              {/* Campos de endereço em layout mais horizontal */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="cep"
                    className="block text-sm font-medium mb-1"
                  >
                    CEP
                  </label>
                  <div className="relative">
                    <input
                      id="cep"
                      name="cep"
                      type="text"
                      placeholder="00000-000"
                      value={formData.cep}
                      onChange={handleCepChange}
                      className={`w-full px-3 py-2 border ${
                        cepError ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 ${
                        cepError ? "focus:ring-red-500" : "focus:ring-blue-500"
                      }`}
                    />
                    {isLoadingCep && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
                    )}
                  </div>
                  {cepError && (
                    <p className="text-red-500 text-xs mt-1">{cepError}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="estado"
                    className="block text-sm font-medium mb-1"
                  >
                    Estado
                  </label>
                  <input
                    id="estado"
                    name="estado"
                    type="text"
                    placeholder=""
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                    disabled
                  />
                </div>

                <div>
                  <label
                    htmlFor="cidade"
                    className="block text-sm font-medium mb-1"
                  >
                    Cidade
                  </label>
                  <input
                    id="cidade"
                    name="cidade"
                    type="text"
                    placeholder=""
                    value={formData.cidade}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                    disabled
                  />
                </div>

                <div>
                  <label
                    htmlFor="bairro"
                    className="block text-sm font-medium mb-1"
                  >
                    Bairro
                  </label>
                  <input
                    id="bairro"
                    name="bairro"
                    type="text"
                    placeholder=""
                    value={formData.bairro}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label
                    htmlFor="endereco"
                    className="block text-sm font-medium mb-1"
                  >
                    Endereço
                  </label>
                  <input
                    id="endereco"
                    name="endereco"
                    type="text"
                    placeholder=""
                    value={formData.endereco}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
                    disabled
                  />
                </div>

                <div>
                  <label
                    htmlFor="numero"
                    className="block text-sm font-medium mb-1"
                  >
                    Nº
                  </label>
                  <input
                    id="numero"
                    name="numero"
                    type="text"
                    placeholder=""
                    value={formData.numero}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="complemento"
                  className="block text-sm font-medium mb-1"
                >
                  Complemento
                </label>
                <input
                  id="complemento"
                  name="complemento"
                  type="text"
                  placeholder=""
                  value={formData.complemento}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">
                  Quais itens serão descartados?
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="itens.computador"
                      name="itens.computador"
                      checked={formData.itensDescarte.computador}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="itens.computador"
                      className="text-sm font-medium"
                    >
                      Computador
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="itens.monitores"
                      name="itens.monitores"
                      checked={formData.itensDescarte.monitores}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="itens.monitores"
                      className="text-sm font-medium"
                    >
                      Monitores
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="itens.pilhasBaterias"
                      name="itens.pilhasBaterias"
                      checked={formData.itensDescarte.pilhasBaterias}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="itens.pilhasBaterias"
                      className="text-sm font-medium"
                    >
                      Pilhas e Baterias
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="itens.celulares"
                      name="itens.celulares"
                      checked={formData.itensDescarte.celulares}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="itens.celulares"
                      className="text-sm font-medium"
                    >
                      Celulares
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="itens.televisores"
                      name="itens.televisores"
                      checked={formData.itensDescarte.televisores}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="itens.televisores"
                      className="text-sm font-medium"
                    >
                      Televisores
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="itens.eletrodomesticos"
                      name="itens.eletrodomesticos"
                      checked={formData.itensDescarte.eletrodomesticos}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="itens.eletrodomesticos"
                      className="text-sm font-medium"
                    >
                      Eletrodomésticos
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="itens.outros"
                      name="itens.outros"
                      checked={formData.itensDescarte.outros}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="itens.outros"
                      className="text-sm font-medium"
                    >
                      Outros
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="descricao"
                  className="block text-sm font-medium mb-1"
                >
                  Descreva
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Descreva quais itens e a quantidade"
                  value={formData.descricao}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#3C6499] hover:bg-[#375377] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Agendar Coleta
              </button>
            </form>
          </div>
        </div>
      </div>
      <FooterColeta></FooterColeta>
    </>
  );
}
