// "use client"

// import { useState, useEffect } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Recycle } from "lucide-react"
// import { useFormData } from "../hooks/use-form-data"

// interface PersonalInfoTabProps {
//   onNext: () => void
// }

// export function PersonalInfoTab({ onNext }: PersonalInfoTabProps) {
//   const { formData, setFormData } = useFormData()
//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [isFormValid, setIsFormValid] = useState(false)

//   // Validate form fields
//   const validateForm = () => {
//     const newErrors: Record<string, string> = {}

//     // Validate name
//     if (!formData.personalInfo.nome.trim()) {
//       newErrors.nome = "Nome é obrigatório"
//     }

//     // Validate email
//     if (!formData.personalInfo.email.trim()) {
//       newErrors.email = "Email é obrigatório"
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalInfo.email)) {
//       newErrors.email = "Email inválido"
//     }

//     // Validate phone
//     if (!formData.personalInfo.telefone.trim()) {
//       newErrors.telefone = "Telefone é obrigatório"
//     } else if (formData.personalInfo.telefone.replace(/\D/g, "").length < 10) {
//       newErrors.telefone = "Telefone inválido"
//     }

//     // Validate CPF
//     if (!formData.personalInfo.cpf.trim()) {
//       newErrors.cpf = "CPF é obrigatório"
//     } else if (formData.personalInfo.cpf.replace(/\D/g, "").length !== 11) {
//       newErrors.cpf = "CPF inválido"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   // Check form validity whenever form data changes
//   useEffect(() => {
//     setIsFormValid(validateForm())
//   }, [formData.personalInfo])

//   // Handle next button click
//   const handleNext = () => {
//     const isValid = validateForm()
//     if (isValid) {
//       onNext()
//     } else {
//       // Focus on the first field with an error
//       const firstErrorField = Object.keys(errors)[0]
//       const element = document.getElementById(firstErrorField)
//       if (element) {
//         element.focus()
//       }
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
//           <Input
//             id="nome"
//             name="nome"
//             placeholder="Digite seu nome completo"
//             value={formData.personalInfo.nome}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 personalInfo: {
//                   ...prev.personalInfo,
//                   nome: e.target.value,
//                 },
//               }))
//             }
//             className={`border-green-200 focus-visible:ring-green-500 ${errors.nome ? "border-red-500" : ""}`}
//           />
//           {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
//         </div>

//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700">E-mail</label>
//           <Input
//             id="email"
//             name="email"
//             type="email"
//             placeholder="seu@email.com"
//             value={formData.personalInfo.email}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 personalInfo: {
//                   ...prev.personalInfo,
//                   email: e.target.value,
//                 },
//               }))
//             }
//             className={`border-green-200 focus-visible:ring-green-500 ${errors.email ? "border-red-500" : ""}`}
//           />
//           {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//         </div>

//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700">Telefone</label>
//           <Input
//             id="telefone"
//             name="telefone"
//             placeholder="(00) 00000-0000"
//             value={formData.personalInfo.telefone}
//             onChange={(e) => {
//               // Format phone number as user types
//               let value = e.target.value.replace(/\D/g, "")
//               if (value.length > 11) value = value.slice(0, 11)

//               // Format: (XX) XXXXX-XXXX
//               if (value.length > 2) {
//                 value = `(${value.slice(0, 2)}) ${value.slice(2)}`
//               }
//               if (value.length > 10) {
//                 value = `${value.slice(0, 10)}-${value.slice(10)}`
//               }

//               setFormData((prev) => ({
//                 ...prev,
//                 personalInfo: {
//                   ...prev.personalInfo,
//                   telefone: value,
//                 },
//               }))
//             }}
//             className={`border-green-200 focus-visible:ring-green-500 ${errors.telefone ? "border-red-500" : ""}`}
//           />
//           {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
//         </div>

//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700">CPF</label>
//           <Input
//             id="cpf"
//             name="cpf"
//             placeholder="000.000.000-00"
//             value={formData.personalInfo.cpf}
//             onChange={(e) => {
//               // Format CPF as user types
//               let value = e.target.value.replace(/\D/g, "")
//               if (value.length > 11) value = value.slice(0, 11)

//               // Format: XXX.XXX.XXX-XX
//               if (value.length > 3) {
//                 value = `${value.slice(0, 3)}.${value.slice(3)}`
//               }
//               if (value.length > 7) {
//                 value = `${value.slice(0, 7)}.${value.slice(7)}`
//               }
//               if (value.length > 11) {
//                 value = `${value.slice(0, 11)}-${value.slice(11)}`
//               }

//               setFormData((prev) => ({
//                 ...prev,
//                 personalInfo: {
//                   ...prev.personalInfo,
//                   cpf: value,
//                 },
//               }))
//             }}
//             className={`border-green-200 focus-visible:ring-green-500 ${errors.cpf ? "border-red-500" : ""}`}
//           />
//           {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>}
//         </div>
//       </div>

//       <div className="bg-green-50 p-4 rounded-md border border-green-100 mt-4">
//         <h4 className="font-medium text-green-800 flex items-center gap-2">
//           <Recycle className="h-5 w-5" />
//           Política de Privacidade
//         </h4>
//         <p className="mt-2 text-sm text-gray-600">
//           Seus dados pessoais serão utilizados apenas para fins de agendamento e comunicação sobre a coleta. Não
//           compartilhamos suas informações com terceiros sem seu consentimento.
//         </p>
//       </div>

//       <div className="flex justify-end mt-6">
//         <Button
//           onClick={handleNext}
//           className={`${
//             isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-green-300 cursor-not-allowed"
//           } text-white`}
//         >
//           Próximo
//         </Button>
//       </div>
//     </div>
//   )
// }

