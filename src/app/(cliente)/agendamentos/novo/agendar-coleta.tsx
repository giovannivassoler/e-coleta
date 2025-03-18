"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

import { PersonalInfoTab } from "./components/personal-info-tab"
import { ScheduleTab } from "./components/schedule-tab"
import { ItemsTab } from "./components/items-tab"

import { BenefitsCard } from "./components/benefits-card"
import { RecyclingProcessCard } from "./components/recycling-process-card"
import { HelpCard } from "./components/help-card"
import { useFormData } from "./hooks/use-form-data"
import { AddressTab } from "./components/address-tab"
import { criarPedido } from "./funcao"
import { useRouter } from "next/navigation"

export default function AgendarColeta() {
  const [activeTab, setActiveTab] = useState("personal")
  const { formData } = useFormData()
  const router = useRouter()

  // Check if the address form is valid for the final submit button
  const isAddressFormValid = () => {
    // Check required fields
    return (
      formData.cep &&
      formData.cep.replace(/\D/g, "").length === 8 &&
      formData.endereco &&
      formData.numero &&
      formData.bairro &&
      formData.cidade &&
      formData.estado
    )
  }



  const handleSubmit = () => {
    criarPedido(formData).then(()=>router.push("/agendamentos/sucesso"))

  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <main className="container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-green-800 mb-4">Agende a Coleta do seu Lixo Eletrônico</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descarte seus equipamentos eletrônicos de forma responsável e sustentável. Nosso serviço coleta, recicla e
            dá o destino correto para seu lixo eletrônico.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-green-100 shadow-md">
            <CardHeader className="border-b border-green-100 bg-green-50">
              <CardTitle className="text-2xl font-bold text-green-800">Agendar Coleta</CardTitle>
              <CardDescription>Preencha os dados para agendar a retirada do seu lixo eletrônico</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8 bg-green-100">
                  <TabsTrigger
                    value="personal"
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  >
                    Dados Pessoais
                  </TabsTrigger>
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

                <TabsContent value="personal">
                  <PersonalInfoTab onNext={() => setActiveTab("schedule")} />
                </TabsContent>

                <TabsContent value="schedule">
                  <ScheduleTab onNext={() => setActiveTab("items")} onPrevious={() => setActiveTab("personal")} />
                </TabsContent>

                <TabsContent value="items">
                  <ItemsTab onNext={() => setActiveTab("address")} onPrevious={() => setActiveTab("schedule")} />
                </TabsContent>

                <TabsContent value="address">
                  <AddressTab onPrevious={() => setActiveTab("items")} />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-green-100 pt-6">
              {activeTab === "address" && (
                <Button
                  onClick={handleSubmit}
                  className={`${
                    isAddressFormValid() ? "bg-green-600 hover:bg-green-700" : "bg-green-300 cursor-not-allowed"
                  } text-white`}
                  disabled={!isAddressFormValid()}
                >
                  Agendar Coleta
                </Button>
              )}
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <BenefitsCard />
            <RecyclingProcessCard />
            <HelpCard />
          </div>
        </div>
      </main>
    </div>
  )
}

