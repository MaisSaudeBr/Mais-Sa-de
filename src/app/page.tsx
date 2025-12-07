"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Clock, Pill, FileText, History, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Base de conhecimento dos medicamentos
const MEDICAMENTOS = {
  clonazepam: {
    nome: "Clonazepam (Rivotril)",
    tipo: "benzodiazepínico",
    efeitosComuns: ["sonolência excessiva", "dependência química", "perda de memória", "confusão mental", "falta de coordenação motora"]
  },
  alprazolam: {
    nome: "Alprazolam",
    tipo: "benzodiazepínico",
    efeitosComuns: ["dependência", "tontura", "irritabilidade", "insônia rebote", "dificuldade de concentração"]
  },
  diazepam: {
    nome: "Diazepam",
    tipo: "benzodiazepínico",
    efeitosComuns: ["sonolência prolongada", "dependência", "fraqueza muscular", "reflexos reduzidos", "queda de pressão"]
  },
  zolpidem: {
    nome: "Zolpidem",
    tipo: "hipnótico para insônia",
    efeitosComuns: ["sonambulismo", "amnésia temporária", "dependência", "alucinações", "tontura ao acordar"]
  },
  sertralina: {
    nome: "Sertralina",
    tipo: "antidepressivo (ISRS)",
    efeitosComuns: ["náusea", "diarreia", "ansiedade inicial", "redução da libido", "insônia ou sonolência"]
  },
  fluoxetina: {
    nome: "Fluoxetina",
    tipo: "antidepressivo (ISRS)",
    efeitosComuns: ["insônia", "dor de cabeça", "inquietação inicial", "alterações de peso", "queda da libido"]
  },
  escitalopram: {
    nome: "Escitalopram",
    tipo: "antidepressivo (ISRS)",
    efeitosComuns: ["náuseas", "tremores leves", "alterações no sono", "redução da libido", "ganho de peso"]
  },
  venlafaxina: {
    nome: "Venlafaxina",
    tipo: "antidepressivo (IRSN)",
    efeitosComuns: ["aumento da pressão arterial", "abstinência ao suspender", "sudorese excessiva", "náuseas", "insônia"]
  },
  metilfenidato: {
    nome: "Metilfenidato (Ritalina/Concerta)",
    tipo: "estimulante do SNC",
    efeitosComuns: ["perda de apetite", "insônia", "ansiedade/agitação", "taquicardia", "aumento da pressão arterial"]
  },
  quetiapina: {
    nome: "Quetiapina",
    tipo: "antipsicótico/estabilizador de humor",
    efeitosComuns: ["sonolência intensa", "aumento de peso", "boca seca", "alteração da glicose/colesterol", "lentidão mental"]
  }
}

type NivelTriagem = "verde" | "amarelo" | "vermelho"

interface Triagem {
  nivel: NivelTriagem
  motivo: string
  orientacoes: string[]
  escalonamento: string
}

interface Consulta {
  id: string
  medicamento: string
  dose: string
  horario: string
  sintomas: string
  triagem: Triagem
  data: Date
}

export default function Home() {
  const [medicamento, setMedicamento] = useState("")
  const [dose, setDose] = useState("")
  const [horario, setHorario] = useState("")
  const [sintomas, setSintomas] = useState("")
  const [resultado, setResultado] = useState<Triagem | null>(null)
  const [historico, setHistorico] = useState<Consulta[]>([])
  const [mostrarHistorico, setMostrarHistorico] = useState(false)

  const analisarSintomas = () => {
    if (!medicamento || !sintomas) {
      alert("Por favor, preencha o medicamento e os sintomas.")
      return
    }

    const triagem = realizarTriagem(medicamento, sintomas)
    setResultado(triagem)

    // Adicionar ao histórico
    const novaConsulta: Consulta = {
      id: Date.now().toString(),
      medicamento,
      dose,
      horario,
      sintomas,
      triagem,
      data: new Date()
    }
    setHistorico([novaConsulta, ...historico])
  }

  const realizarTriagem = (med: string, sint: string): Triagem => {
    const sintomasLower = sint.toLowerCase()
    const medLower = med.toLowerCase()

    // Sinais de EMERGÊNCIA (Vermelho)
    const sinaisGraves = [
      "dificuldade para respirar",
      "falta de ar",
      "dor no peito",
      "convulsão",
      "desmaio",
      "confusão severa",
      "alucinações intensas",
      "pensamentos suicidas",
      "batimento muito rápido",
      "pressão muito alta",
      "reação alérgica",
      "inchaço na garganta",
      "urticária grave"
    ]

    for (const sinal of sinaisGraves) {
      if (sintomasLower.includes(sinal)) {
        return {
          nivel: "vermelho",
          motivo: "Sintomas indicam possível reação grave ou emergência médica.",
          orientacoes: [],
          escalonamento: "Sinal de risco. Procure emergência agora ou ligue 192/193."
        }
      }
    }

    // Sinais MODERADOS (Amarelo)
    const sinaisModeradores = [
      "tontura intensa",
      "vômito persistente",
      "tremores fortes",
      "ansiedade severa",
      "palpitações",
      "pressão alterada",
      "visão turva",
      "fraqueza extrema",
      "desorientação"
    ]

    for (const sinal of sinaisModeradores) {
      if (sintomasLower.includes(sinal)) {
        return gerarTriagemAmarela(medLower, sintomasLower)
      }
    }

    // Sinais LEVES (Verde)
    return gerarTriagemVerde(medLower, sintomasLower)
  }

  const gerarTriagemAmarela = (med: string, sint: string): Triagem => {
    let orientacoes: string[] = []
    let escalonamento = ""

    if (med.includes("clonazepam") || med.includes("alprazolam") || med.includes("diazepam")) {
      orientacoes = [
        "Evite dirigir ou operar máquinas até os sintomas melhorarem",
        "Mantenha-se em ambiente seguro, evite escadas e quedas",
        "Monitore sua pressão arterial e frequência cardíaca se possível"
      ]
      escalonamento = "Contate seu médico nas próximas 24h. Se piorar (confusão severa, dificuldade respiratória), procure emergência."
    } else if (med.includes("sertralina") || med.includes("fluoxetina") || med.includes("escitalopram")) {
      orientacoes = [
        "Mantenha-se hidratado e faça refeições leves e frequentes",
        "Evite álcool e cafeína que podem intensificar os sintomas",
        "Descanse em ambiente calmo e com pouca estimulação"
      ]
      escalonamento = "Entre em contato com seu médico em 24-48h. Se surgirem pensamentos de autoagressão, procure emergência imediatamente."
    } else if (med.includes("metilfenidato") || med.includes("ritalina")) {
      orientacoes = [
        "Meça sua pressão arterial e frequência cardíaca regularmente",
        "Evite cafeína e outros estimulantes",
        "Descanse em ambiente tranquilo e pratique respiração profunda"
      ]
      escalonamento = "Contate seu médico hoje ou amanhã. Se sentir dor no peito ou batimentos muito irregulares, procure emergência."
    } else {
      orientacoes = [
        "Descanse e evite atividades que exijam atenção plena",
        "Mantenha-se hidratado e alimente-se de forma leve",
        "Monitore a evolução dos sintomas nas próximas horas"
      ]
      escalonamento = "Entre em contato com seu médico nas próximas 24-48h para avaliar a necessidade de ajuste."
    }

    return {
      nivel: "amarelo",
      motivo: "Sintomas moderados que requerem atenção e acompanhamento médico.",
      orientacoes,
      escalonamento
    }
  }

  const gerarTriagemVerde = (med: string, sint: string): Triagem => {
    let orientacoes: string[] = []
    let escalonamento = ""

    if (med.includes("clonazepam") || med.includes("alprazolam") || med.includes("diazepam")) {
      orientacoes = [
        "Descanse em local confortável - sonolência é esperada nestes medicamentos",
        "Evite dirigir ou atividades que exijam atenção nas próximas 4-6 horas",
        "Mantenha-se hidratado com água ou chás leves"
      ]
      escalonamento = "Esses sintomas são comuns. Mencione na próxima consulta se persistirem ou piorarem."
    } else if (med.includes("sertralina") || med.includes("fluoxetina") || med.includes("escitalopram")) {
      orientacoes = [
        "Tome o medicamento com alimentos para reduzir náuseas",
        "Mantenha-se hidratado e faça refeições leves ao longo do dia",
        "Sintomas iniciais costumam melhorar em 1-2 semanas de uso contínuo"
      ]
      escalonamento = "Efeitos comuns no início do tratamento. Informe seu médico na próxima consulta se não melhorarem em 2 semanas."
    } else if (med.includes("metilfenidato") || med.includes("ritalina")) {
      orientacoes = [
        "Tome o medicamento pela manhã ou conforme orientação médica para evitar insônia",
        "Faça pequenas refeições frequentes para manter o apetite",
        "Pratique técnicas de relaxamento se sentir ansiedade leve"
      ]
      escalonamento = "Efeitos esperados. Relate ao médico na próxima consulta para possível ajuste de dose ou horário."
    } else if (med.includes("quetiapina")) {
      orientacoes = [
        "Tome preferencialmente à noite devido à sonolência",
        "Evite dirigir ou operar máquinas enquanto sentir sono",
        "Mantenha-se hidratado e tenha água por perto para boca seca"
      ]
      escalonamento = "Efeitos comuns deste medicamento. Converse com seu médico na próxima consulta sobre a intensidade."
    } else {
      orientacoes = [
        "Descanse e observe a evolução dos sintomas",
        "Mantenha-se hidratado e alimente-se adequadamente",
        "Anote os sintomas para relatar ao médico"
      ]
      escalonamento = "Sintomas leves. Mencione ao seu médico na próxima consulta de rotina."
    }

    return {
      nivel: "verde",
      motivo: "Sintomas leves ou esperados para este medicamento.",
      orientacoes,
      escalonamento
    }
  }

  const limparFormulario = () => {
    setMedicamento("")
    setDose("")
    setHorario("")
    setSintomas("")
    setResultado(null)
  }

  const getNivelIcon = (nivel: NivelTriagem) => {
    switch (nivel) {
      case "verde":
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case "amarelo":
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />
      case "vermelho":
        return <XCircle className="w-6 h-6 text-red-600" />
    }
  }

  const getNivelColor = (nivel: NivelTriagem) => {
    switch (nivel) {
      case "verde":
        return "bg-green-50 border-green-200"
      case "amarelo":
        return "bg-yellow-50 border-yellow-200"
      case "vermelho":
        return "bg-red-50 border-red-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Mais Saúde
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Assistente virtual de efeitos colaterais
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMostrarHistorico(!mostrarHistorico)}
              className="flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Histórico</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Aviso importante */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-900">
            Este é um assistente educativo. Não substitui diagnóstico ou orientação médica profissional.
          </AlertDescription>
        </Alert>

        {/* Histórico */}
        {mostrarHistorico && historico.length > 0 && (
          <Card className="mb-6 p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              Histórico de Consultas
            </h2>
            <div className="space-y-3">
              {historico.slice(0, 5).map((consulta) => (
                <div
                  key={consulta.id}
                  className={`p-3 rounded-lg border ${getNivelColor(consulta.triagem.nivel)}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{consulta.medicamento}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {consulta.data.toLocaleString("pt-BR")}
                      </p>
                    </div>
                    {getNivelIcon(consulta.triagem.nivel)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Formulário */}
        <Card className="p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Informações do Medicamento
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="medicamento" className="text-sm font-medium">
                Medicamento *
              </Label>
              <Select value={medicamento} onValueChange={setMedicamento}>
                <SelectTrigger id="medicamento" className="mt-1">
                  <SelectValue placeholder="Selecione o medicamento" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MEDICAMENTOS).map(([key, med]) => (
                    <SelectItem key={key} value={key}>
                      {med.nome} — {med.tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dose" className="text-sm font-medium">
                  Dose (ex: 2mg, 50mg)
                </Label>
                <Input
                  id="dose"
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                  placeholder="Ex: 2mg"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="horario" className="text-sm font-medium">
                  Horário da última dose
                </Label>
                <div className="relative mt-1">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="horario"
                    type="time"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="sintomas" className="text-sm font-medium">
                Descreva os sintomas que está sentindo *
              </Label>
              <Textarea
                id="sintomas"
                value={sintomas}
                onChange={(e) => setSintomas(e.target.value)}
                placeholder="Ex: Estou sentindo muita sonolência e tontura leve..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={analisarSintomas}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Analisar Sintomas
              </Button>
              <Button
                onClick={limparFormulario}
                variant="outline"
              >
                Limpar
              </Button>
            </div>
          </div>
        </Card>

        {/* Resultado da Triagem */}
        {resultado && (
          <Card className={`p-4 sm:p-6 border-2 ${getNivelColor(resultado.nivel)}`}>
            <div className="space-y-4">
              {/* Triagem */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {getNivelIcon(resultado.nivel)}
                  <h3 className="text-lg font-bold">
                    {resultado.nivel === "verde" && "🟢 TRIAGEM: VERDE (Leve)"}
                    {resultado.nivel === "amarelo" && "🟡 TRIAGEM: AMARELO (Moderado)"}
                    {resultado.nivel === "vermelho" && "🔴 TRIAGEM: VERMELHO (Grave)"}
                  </h3>
                </div>
                <p className="text-sm text-gray-700">{resultado.motivo}</p>
              </div>

              {/* Orientações de Autocuidado */}
              {resultado.nivel !== "vermelho" && resultado.orientacoes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-sm">
                    Orientações de Autocuidado:
                  </h4>
                  <ul className="space-y-2">
                    {resultado.orientacoes.map((orientacao, index) => (
                      <li key={index} className="flex gap-2 text-sm">
                        <span className="text-blue-600 font-bold">{index + 1}.</span>
                        <span className="text-gray-700">{orientacao}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Escalonamento */}
              <div className={`p-3 rounded-lg ${
                resultado.nivel === "vermelho" 
                  ? "bg-red-100 border border-red-300" 
                  : "bg-gray-100 border border-gray-300"
              }`}>
                <h4 className="font-semibold mb-1 text-sm">
                  {resultado.nivel === "vermelho" ? "⚠️ AÇÃO IMEDIATA:" : "Quando procurar ajuda:"}
                </h4>
                <p className="text-sm text-gray-800">{resultado.escalonamento}</p>
              </div>

              {/* Aviso Legal */}
              <Alert className="border-gray-300 bg-gray-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs text-gray-700">
                  <strong>Isso não é um diagnóstico.</strong> Essa é uma orientação educativa. 
                  Consulte seu médico. Em caso de emergência, ligue <strong>192 ou 193</strong>.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-xs text-gray-600">
            Este assistente não substitui consulta médica profissional. 
            Sempre consulte seu médico antes de tomar decisões sobre sua saúde.
          </p>
        </div>
      </footer>
    </div>
  )
}
