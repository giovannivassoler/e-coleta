import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-between p-6 bg-gradient-to-br from-blue-800 to-blue-600">
      {/* Logo section */}
      <div className="text-white text-4xl font-bold tracking-tight">
        <h1>LOGO E-</h1>
        <h1>COLETA</h1>
        <h1>BRANCO</h1>
      </div>

      {/* Login form */}
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Entre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" type="email" placeholder="Digite seu email" className="w-full" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <Input id="password" type="password" placeholder="Digite sua senha" className="w-full" />
          </div>
          <div className="text-right">
            <Button variant="link" className="text-sm text-blue-600 p-0">
              Esqueci minha senha
            </Button>
          </div>
          <Button className="w-full bg-blue-700 hover:bg-blue-800">ENTRE</Button>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-muted-foreground text-sm">ou</span>
            </div>
          </div>
          <Button variant="outline" className="w-full border-blue-700 text-blue-700 hover:bg-blue-50">
            CADASTRE-SE
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

