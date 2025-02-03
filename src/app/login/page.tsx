import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full p-4 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-lg font-semibold">E-COLETA</div>
          <Link href="/login" className="text-sm">
            Entre
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid lg:grid-cols-2">
        {/* Left Side - Logo */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-r from-[#3C6499] to-[#375377] p-8">
          <div className="text-white text-4xl font-bold text-center">
            <Image
                            src="/imagens/logo-full-branco.png"
                            alt="Delivery van with person"
                            width={500}
                            height={600}
                            className="object-contain"
                          />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Entre</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" type="email" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <Input id="password" type="password" required />
              </div>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline block">
                Esqueci minha senha
              </Link>
              <Button className="w-full bg-[#3B5578] hover:bg-[#2f4460]">ENTRE</Button>
              <div className="relative my-4">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-muted-foreground">
                  ou
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full border-[#3B5578] text-[#3B5578] hover:bg-[#3B5578] hover:text-white"
              >
                CADASTRE-SE
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    
  )
}

