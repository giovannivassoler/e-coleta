"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  Clock,
  Loader2,
  MapPin,
  Recycle,
  Smartphone,
  Tv,
  Battery,
  Monitor,
  Laptop,
  Cpu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface ItensDescarte {
  computador: boolean;
  monitores: boolean;
  pilhasBaterias: boolean;
  outros: boolean;
  celulares: boolean;
  televisores: boolean;
  eletrodomesticos: boolean;
}

export default function AgendarColeta() {
  const [activeTab, setActiveTab] = useState("schedule");

  // Estados para os dados do formulário
  const [formData, setFormData] = useState({
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

  const toggleWasteItem = (id: number) => {
    const wasteItems = [
      { id: 1, name: "computador" },
      { id: 2, name: "monitores" },
      { id: 3, name: "pilhasBaterias" },
      { id: 4, name: "celulares" },
      { id: 5, name: "televisores" },
      { id: 6, name: "eletrodomesticos" },
      { id: 7, name: "outros" },
    ];

    const item = wasteItems.find((item) => item.id === id);
    if (item) {
      const itemName = item.name as keyof ItensDescarte;
      setFormData((prev) => ({
        ...prev,
        itensDescarte: {
          ...prev.itensDescarte,
          [itemName]: !prev.itensDescarte[itemName],
        },
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
                     ${isToday ? "bg-green-100 text-green-700" : ""}
                     ${
                       isDisabled
                         ? "text-gray-300 cursor-not-allowed"
                         : "hover:bg-green-50 cursor-pointer"
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
        className="absolute z-10 mt-1 bg-white border border-green-200 rounded-md shadow-lg p-3 w-64"
      >
        <div className="flex justify-between items-center mb-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={isPrevMonthDisabled}
            className={`p-1 rounded-full ${
              isPrevMonthDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-green-50 text-green-700"
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
              isNextMonthDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-green-50 text-green-700"
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

  // Gerar horários de 30 em 30 minutos das 8h às 17h
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      const hourStr = hour < 10 ? `0${hour}` : `${hour}`;

      // Adicionar slot para hora cheia (XX:00)
      slots.push(`${hourStr}:00`);

      // Adicionar slot para meia hora (XX:30), exceto para 17:30 que está fora do horário
      if (hour < 17) {
        slots.push(`${hourStr}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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
        </button>
      );
    }

    return (
      <div
        ref={timePickerRef}
        className="absolute z-10 mt-1 bg-white border border-green-200 rounded-md shadow-lg p-1 w-40"
      >
        <div className="max-h-48 overflow-y-auto">{hours}</div>
      </div>
    );
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCollectTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      collectType: e.target.value,
    }));
  };

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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">

      <main className="container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Agende a Coleta do seu Lixo Eletrônico
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descarte seus equipamentos eletrônicos de forma responsável e
            sustentável. Nosso serviço coleta, recicla e dá o destino correto
            para seu lixo eletrônico.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-green-100 shadow-md">
            <CardHeader className="border-b border-green-100 bg-green-50">
              <CardTitle className="text-2xl font-bold text-green-800">
                Agendar Coleta
              </CardTitle>
              <CardDescription>
                Preencha os dados para agendar a retirada do seu lixo eletrônico
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-green-100">
                  <TabsTrigger
                    value="schedule"
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  >
                    Agendamento
                  </TabsTrigger>
                  <TabsTrigger
                    value="items"
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  >
                    Itens
                  </TabsTrigger>
                  <TabsTrigger
                    value="address"
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  >
                    Endereço
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="schedule" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Data da Coleta
                      </label>
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
                          className="w-full border-green-200 focus-visible:ring-green-500 cursor-pointer"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500 pointer-events-none" />
                        {showCalendar && renderCalendar()}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Horário Preferencial
                      </label>
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
                          className="w-full border-green-200 focus-visible:ring-green-500 cursor-pointer"
                        />
                        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500 pointer-events-none" />
                        {showTimePicker && renderTimePicker()}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={() => setActiveTab("items")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Próximo
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="items" className="space-y-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Selecione os itens para descarte
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {wasteItemsList.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer transition-colors ${
                            item.selected
                              ? "bg-green-100 border-green-500"
                              : "border-gray-200 hover:border-green-300"
                          }`}
                          onClick={() => toggleWasteItem(item.id)}
                        >
                          <div
                            className={`p-2 rounded-full ${
                              item.selected
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {item.icon}
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <label
                        htmlFor="descricao"
                        className="block text-sm font-medium text-gray-700"
                      >
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
                        className="mt-2 w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                      />
                    </div>

                    <div className="bg-green-50 p-4 rounded-md border border-green-100 mt-4">
                      <h4 className="font-medium text-green-800 flex items-center gap-2">
                        <Recycle className="h-5 w-5" />
                        Informações importantes
                      </h4>
                      <ul className="mt-2 text-sm text-gray-600 space-y-1">
                        <li>
                          • Remova dados pessoais de dispositivos de
                          armazenamento
                        </li>
                        <li>
                          • Separe baterias e pilhas em embalagens separadas
                        </li>
                        <li>• Embale itens frágeis adequadamente</li>
                        <li>
                          • Equipamentos muito grandes podem exigir agendamento
                          especial
                        </li>
                      </ul>
                    </div>
                    <div className="flex justify-between mt-6">
                      <Button
                        onClick={() => setActiveTab("schedule")}
                        variant="outline"
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        Voltar
                      </Button>
                      <Button
                        onClick={() => setActiveTab("address")}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Próximo
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="address" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="cep"
                        className="block text-sm font-medium text-gray-700"
                      >
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
                            cepError ? "border-red-500" : ""
                          }`}
                        />
                        {isLoadingCep && (
                          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500 animate-spin" />
                        )}
                      </div>
                      {cepError && (
                        <p className="text-red-500 text-xs mt-1">{cepError}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Tipo de Coleta
                      </label>
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
                      <label
                        htmlFor="street"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Rua
                      </label>
                      <Input
                        id="endereco"
                        name="endereco"
                        placeholder="Nome da rua"
                        value={formData.endereco}
                        onChange={handleAddressChange}
                        className="border-green-200 focus-visible:ring-green-500 bg-green-50"
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="number"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Número
                      </label>
                      <Input
                        id="numero"
                        name="numero"
                        placeholder="123"
                        value={formData.numero}
                        onChange={handleAddressChange}
                        className="border-green-200 focus-visible:ring-green-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="complement"
                        className="block text-sm font-medium text-gray-700"
                      >
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
                      <label
                        htmlFor="neighborhood"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Bairro
                      </label>
                      <Input
                        id="bairro"
                        name="bairro"
                        placeholder="Seu bairro"
                        value={formData.bairro}
                        onChange={handleAddressChange}
                        className="border-green-200 focus-visible:ring-green-500 bg-green-50"
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Cidade
                      </label>
                      <Input
                        id="cidade"
                        name="cidade"
                        placeholder="Sua cidade"
                        value={formData.cidade}
                        onChange={handleAddressChange}
                        className="border-green-200 focus-visible:ring-green-500 bg-green-50"
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Estado
                      </label>
                      <Input
                        id="estado"
                        name="estado"
                        placeholder="Estado"
                        value={formData.estado}
                        onChange={handleAddressChange}
                        className="border-green-200 focus-visible:ring-green-500 bg-green-50"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* <div className="bg-green-50 p-4 rounded-md border border-green-100 mt-4">
                    <h4 className="font-medium text-green-800 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Área de Cobertura
                    </h4>
                    <p className="mt-2 text-sm text-gray-600">
                      Atualmente atendemos as regiões metropolitanas de São Paulo, Rio de Janeiro e Belo Horizonte. Para
                      outras localidades, entre em contato para verificar disponibilidade.
                    </p>
                  </div> */}
                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={() => setActiveTab("items")}
                      variant="outline"
                      className="border-green-200 text-green-700 hover:bg-green-50 mr-2"
                    >
                      Voltar
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-green-100 pt-6">
              {activeTab === "address" && (
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Agendar Coleta
                </Button>
              )}
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="text-xl font-bold text-green-800">
                  Benefícios
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="p-1 mt-0.5 rounded-full bg-green-100 text-green-600">
                      <Recycle className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium text-green-800">
                        Descarte Responsável
                      </span>
                      <p className="text-sm text-gray-600">
                        Garantimos o descarte correto de seus equipamentos
                        eletrônicos.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="p-1 mt-0.5 rounded-full bg-green-100 text-green-600">
                      <Recycle className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium text-green-800">
                        Redução de Poluição
                      </span>
                      <p className="text-sm text-gray-600">
                        Evite que materiais tóxicos contaminem o meio ambiente.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="p-1 mt-0.5 rounded-full bg-green-100 text-green-600">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium text-green-800">
                        Praticidade
                      </span>
                      <p className="text-sm text-gray-600">
                        A coleta é feita em sua própria casa
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="p-1 mt-0.5 rounded-full bg-green-100 text-green-600">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium text-green-800">
                        Economia de Tempo
                      </span>
                      <p className="text-sm text-gray-600">
                        Não perca tempo procurando pontos de coleta.
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="text-xl font-bold text-green-800">
                  Processo de Reciclagem
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="relative pl-8 pb-4 border-l-2 border-green-200">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                    <h4 className="font-medium text-green-800">1. Coleta</h4>
                    <p className="text-sm text-gray-600">
                      Agendamos a coleta dos seus equipamentos eletrônicos de
                      forma prática e segura.
                    </p>
                  </div>
                  <div className="relative pl-8 pb-4 border-l-2 border-green-200">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                    <h4 className="font-medium text-green-800">2. Triagem</h4>
                    <p className="text-sm text-gray-600">
                      Realizamos a separação cuidadosa dos materiais por tipo e
                      avaliamos se ainda podem ser reutilizados.
                    </p>
                  </div>
                  <div className="relative pl-8 pb-4 border-l-2 border-green-200">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                    <h4 className="font-medium text-green-800">
                      3. Desmontagem
                    </h4>
                    <p className="text-sm text-gray-600">
                      Equipamentos que não podem ser reaproveitados são
                      desmontados para que seus componentes possam ser separados
                      de maneira eficiente.
                    </p>
                  </div>
                  <div className="relative pl-8">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                    <h4 className="font-medium text-green-800">
                      4. Reciclagem
                    </h4>
                    <p className="text-sm text-gray-600">
                      Após a separação dos componentes, eles são enviados para
                      processos de reciclagem, garantindo a destinação correta e
                      sustentável.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-green-600 text-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Precisa de ajuda?</h3>
              <p className="mb-4 text-green-100">
                Nossa equipe está pronta para esclarecer suas dúvidas sobre o
                descarte de lixo eletrônico.
              </p>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5" />
                <span>(11) 9999-9999</span>
              </div>
              <Button
                variant="outline"
                className="w-full border-white text-black "
              >
                Fale Conosco
              </Button>
            </div>
          </div>
        </div>
      </main>

    
    </div>
  );
}
