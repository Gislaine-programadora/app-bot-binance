'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, TrendingUp, TrendingDown, Activity, DollarSign, Zap, Settings, Play, Pause } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CryptoPrice {
  symbol: string
  price: string
  priceChangePercent: string
}

interface BotConfig {
  symbol: string
  strategy: string
  amount: number
  stopLoss: number
  takeProfit: number
  isActive: boolean
}

interface TradeHistory {
  id: string
  symbol: string
  side: 'BUY' | 'SELL'
  amount: number
  price: number
  profit: number
  timestamp: Date
}

export default function BinanceBotDashboard() {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [botConfig, setBotConfig] = useState<BotConfig>({
    symbol: 'BTCUSDT',
    strategy: 'grid',
    amount: 100,
    stopLoss: 5,
    takeProfit: 10,
    isActive: false
  })
  const [balance, setBalance] = useState<number>(10000)
  const [profit, setProfit] = useState<number>(0)
  const [trades, setTrades] = useState<TradeHistory[]>([])
  const [activeTab, setActiveTab] = useState<string>('dashboard')

  // Simulação de dados em tempo real
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            protocol: 'https',
            origin: 'api.binance.com',
            path: '/api/v3/ticker/24hr',
            method: 'GET',
            headers: {}
          })
        })
        
        if (!response.ok) throw new Error('Erro ao buscar preços')
        
        const data = await response.json()
        const topCoins = data.filter((coin: CryptoPrice) => 
          ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT', 'SOLUSDT'].includes(coin.symbol)
        ).slice(0, 6)
        
        setCryptoPrices(topCoins)
        setError('')
      } catch (err) {
        setError('Erro ao conectar com a API da Binance. Usando dados simulados.')
        // Dados simulados para demonstração
        setCryptoPrices([
          { symbol: 'BTCUSDT', price: '43250.50', priceChangePercent: '2.45' },
          { symbol: 'ETHUSDT', price: '2650.80', priceChangePercent: '-1.20' },
          { symbol: 'BNBUSDT', price: '315.60', priceChangePercent: '3.80' },
          { symbol: 'ADAUSDT', price: '0.4850', priceChangePercent: '5.20' },
          { symbol: 'DOTUSDT', price: '7.25', priceChangePercent: '-0.80' },
          { symbol: 'SOLUSDT', price: '98.40', priceChangePercent: '7.10' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 30000) // Atualiza a cada 30s
    return () => clearInterval(interval)
  }, [])

  const handleBotToggle = () => {
    setBotConfig(prev => ({ ...prev, isActive: !prev.isActive }))
    
    if (!botConfig.isActive) {
      // Simular trade quando bot é ativado
      const newTrade: TradeHistory = {
        id: Date.now().toString(),
        symbol: botConfig.symbol,
        side: Math.random() > 0.5 ? 'BUY' : 'SELL',
        amount: botConfig.amount,
        price: parseFloat(cryptoPrices.find(c => c.symbol === botConfig.symbol)?.price || '0'),
        profit: (Math.random() - 0.5) * 100,
        timestamp: new Date()
      }
      
      setTrades(prev => [newTrade, ...prev.slice(0, 9)])
      setProfit(prev => prev + newTrade.profit)
    }
  }

  const totalProfitPercent = ((profit / balance) * 100).toFixed(2)

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400">
            🤖 Bot Binance Pro
          </h1>
          <p className="text-gray-400">Trading automatizado inteligente</p>
        </div>

        {error && (
          <Alert className="border-yellow-600 bg-yellow-900/20">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900">
            <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-yellow-600">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="prices" className="text-white data-[state=active]:bg-yellow-600">
              Preços
            </TabsTrigger>
            <TabsTrigger value="bot" className="text-white data-[state=active]:bg-yellow-600">
              Bot Config
            </TabsTrigger>
            <TabsTrigger value="trades" className="text-white data-[state=active]:bg-yellow-600">
              Histórico
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Saldo Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ${balance.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Lucro/Perda</CardTitle>
                  {profit >= 0 ? 
                    <TrendingUp className="h-4 w-4 text-green-400" /> : 
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  }
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                  </div>
                  <p className={`text-xs ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {profit >= 0 ? '+' : ''}{totalProfitPercent}%
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Status do Bot</CardTitle>
                  <Activity className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Badge variant={botConfig.isActive ? "default" : "secondary"} 
                           className={botConfig.isActive ? 'bg-green-600' : 'bg-gray-600'}>
                      {botConfig.isActive ? 'ATIVO' : 'PARADO'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Trades Hoje</CardTitle>
                  <Zap className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{trades.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Controle Rápido */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-yellow-400" />
                  Controle Rápido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Bot Status</Label>
                  <Button
                    onClick={handleBotToggle}
                    variant={botConfig.isActive ? "destructive" : "default"}
                    className={botConfig.isActive ? 
                      'bg-red-600 hover:bg-red-700' : 
                      'bg-green-600 hover:bg-green-700'
                    }
                  >
                    {botConfig.isActive ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Parar Bot
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Iniciar Bot
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-300">Par de Negociação</Label>
                    <p className="text-lg font-semibold text-yellow-400">{botConfig.symbol}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Estratégia</Label>
                    <p className="text-lg font-semibold text-blue-400 capitalize">{botConfig.strategy}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Valor por Trade</Label>
                    <p className="text-lg font-semibold text-green-400">${botConfig.amount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prices Tab */}
          <TabsContent value="prices" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Preços em Tempo Real</CardTitle>
                <CardDescription className="text-gray-400">
                  Atualizações a cada 30 segundos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                        <div className="w-20 h-4 bg-gray-800 rounded animate-pulse"></div>
                        <div className="w-24 h-4 bg-gray-800 rounded animate-pulse"></div>
                        <div className="w-16 h-4 bg-gray-800 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cryptoPrices.map((coin) => {
                      const isPositive = parseFloat(coin.priceChangePercent) >= 0
                      return (
                        <div key={coin.symbol} 
                             className="flex items-center justify-between p-4 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
                          <div className="font-semibold text-white">{coin.symbol}</div>
                          <div className="text-lg font-bold text-yellow-400">
                            ${parseFloat(coin.price).toLocaleString()}
                          </div>
                          <Badge variant="secondary" 
                                 className={`${isPositive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                            {isPositive ? '+' : ''}{parseFloat(coin.priceChangePercent).toFixed(2)}%
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bot Configuration Tab */}
          <TabsContent value="bot" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Configuração do Bot</CardTitle>
                <CardDescription className="text-gray-400">
                  Defina os parâmetros de trading
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="symbol" className="text-gray-300">Par de Negociação</Label>
                    <Select value={botConfig.symbol} onValueChange={(value) => 
                      setBotConfig(prev => ({ ...prev, symbol: value }))
                    }>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
                        <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
                        <SelectItem value="BNBUSDT">BNB/USDT</SelectItem>
                        <SelectItem value="ADAUSDT">ADA/USDT</SelectItem>
                        <SelectItem value="DOTUSDT">DOT/USDT</SelectItem>
                        <SelectItem value="SOLUSDT">SOL/USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="strategy" className="text-gray-300">Estratégia</Label>
                    <Select value={botConfig.strategy} onValueChange={(value) => 
                      setBotConfig(prev => ({ ...prev, strategy: value }))
                    }>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="grid">Grid Trading</SelectItem>
                        <SelectItem value="dca">DCA (Dollar Cost Average)</SelectItem>
                        <SelectItem value="scalping">Scalping</SelectItem>
                        <SelectItem value="swing">Swing Trading</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-gray-300">Valor por Trade ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={botConfig.amount}
                      onChange={(e) => setBotConfig(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stopLoss" className="text-gray-300">Stop Loss (%)</Label>
                    <Input
                      id="stopLoss"
                      type="number"
                      value={botConfig.stopLoss}
                      onChange={(e) => setBotConfig(prev => ({ ...prev, stopLoss: parseFloat(e.target.value) || 0 }))}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="takeProfit" className="text-gray-300">Take Profit (%)</Label>
                    <Input
                      id="takeProfit"
                      type="number"
                      value={botConfig.takeProfit}
                      onChange={(e) => setBotConfig(prev => ({ ...prev, takeProfit: parseFloat(e.target.value) || 0 }))}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="10"
                    />
                  </div>

                  <div className="space-y-2 flex items-center justify-between">
                    <Label htmlFor="botActive" className="text-gray-300">Bot Ativo</Label>
                    <Switch
                      id="botActive"
                      checked={botConfig.isActive}
                      onCheckedChange={(checked) => setBotConfig(prev => ({ ...prev, isActive: checked }))}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <Button 
                    onClick={handleBotToggle}
                    className={`w-full ${botConfig.isActive ? 
                      'bg-red-600 hover:bg-red-700' : 
                      'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {botConfig.isActive ? 'Parar Bot' : 'Iniciar Bot'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trade History Tab */}
          <TabsContent value="trades" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Histórico de Trades</CardTitle>
                <CardDescription className="text-gray-400">
                  Últimas operações realizadas pelo bot
                </CardDescription>
              </CardHeader>
              <CardContent>
                {trades.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    Nenhum trade realizado ainda. Inicie o bot para começar!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {trades.map((trade) => (
                      <div key={trade.id} 
                           className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant={trade.side === 'BUY' ? 'default' : 'secondary'}
                                 className={trade.side === 'BUY' ? 'bg-green-600' : 'bg-red-600'}>
                            {trade.side}
                          </Badge>
                          <div>
                            <div className="font-semibold text-white">{trade.symbol}</div>
                            <div className="text-sm text-gray-400">
                              ${trade.amount} @ ${trade.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {trade.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
