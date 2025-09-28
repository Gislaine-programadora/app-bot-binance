// Exemplos de uso da API Binance
// Este arquivo contém exemplos práticos de como usar a API configurada com suas chaves

import { binanceAPI } from '@/lib/binance'

// ==========================================
// EXEMPLOS DE USO DA API BINANCE
// ==========================================

export async function exemplosBinanceAPI() {
  console.log('🚀 Iniciando exemplos da API Binance...')

  try {
    // 1. OBTER INFORMAÇÕES DA CONTA
    console.log('\n📊 1. Obtendo informações da conta...')
    const accountInfo = await binanceAPI.getAccount()
    console.log('Account Info:', {
      makerCommission: accountInfo.makerCommission,
      takerCommission: accountInfo.takerCommission,
      buyerCommission: accountInfo.buyerCommission,
      sellerCommission: accountInfo.sellerCommission,
      canTrade: accountInfo.canTrade,
      canWithdraw: accountInfo.canWithdraw,
      canDeposit: accountInfo.canDeposit,
      updateTime: new Date(accountInfo.updateTime)
    })

    // 2. OBTER SALDO DA CONTA
    console.log('\n💰 2. Obtendo saldo da conta...')
    const balances = await binanceAPI.getBalance()
    console.log('Principais saldos:')
    balances.slice(0, 5).forEach(balance => {
      if (parseFloat(balance.free) > 0 || parseFloat(balance.locked) > 0) {
        console.log(`${balance.asset}: ${balance.free} (${balance.locked} locked)`)
      }
    })

    // 3. OBTER PREÇOS EM TEMPO REAL
    console.log('\n📈 3. Obtendo preços em tempo real...')
    const prices = await binanceAPI.getPrices(['BTCUSDT', 'ETHUSDT', 'BNBUSDT'])
    prices.forEach(price => {
      console.log(`${price.symbol}: $${parseFloat(price.lastPrice).toLocaleString()} (${price.priceChangePercent}%)`)
    })

    // 4. OBTER ORDENS ABERTAS
    console.log('\n📋 4. Obtendo ordens abertas...')
    const orders = await binanceAPI.getOrders()
    console.log(`Ordens abertas: ${orders.length}`)
    orders.slice(0, 3).forEach(order => {
      console.log(`${order.symbol} ${order.side} ${order.origQty} @ ${order.price} - Status: ${order.status}`)
    })

    // 5. OBTER HISTÓRICO DE TRADES
    console.log('\n💼 5. Obtendo histórico de trades...')
    const trades = await binanceAPI.getTrades('BTCUSDT', 5)
    console.log(`Últimos ${trades.length} trades em BTCUSDT:`)
    trades.forEach(trade => {
      const side = trade.isBuyer ? 'BUY' : 'SELL'
      console.log(`${side} ${trade.qty} @ $${trade.price} - Comissão: ${trade.commission} ${trade.commissionAsset}`)
    })

    // 6. EXEMPLO DE CRIAÇÃO DE ORDEM (COMENTADO POR SEGURANÇA)
    /*
    console.log('\n🛒 6. Exemplo de criação de ordem...')
    const newOrder = await binanceAPI.createOrder({
      symbol: 'BTCUSDT',
      side: 'BUY',
      type: 'LIMIT',
      quantity: 0.001,
      price: 40000,
      timeInForce: 'GTC'
    })
    console.log('Nova ordem criada:', newOrder)
    
    // 7. EXEMPLO DE CANCELAMENTO DE ORDEM
    console.log('\n❌ 7. Cancelando ordem...')
    const cancelResult = await binanceAPI.cancelOrder(newOrder.orderId, 'BTCUSDT')
    console.log('Ordem cancelada:', cancelResult)
    */

  } catch (error) {
    console.error('Erro nos exemplos:', error)
  }
}

// ==========================================
// ESTRATÉGIAS DE TRADING EXEMPLO
// ==========================================

export class TradingStrategies {
  private api = binanceAPI

  // Estratégia Grid Trading
  async gridTrading(symbol: string, gridSize: number = 10, basePrice: number, investment: number = 1000) {
    console.log(`🎯 Iniciando Grid Trading para ${symbol}`)
    
    try {
      // Obter preço atual
      const prices = await this.api.getPrices([symbol])
      const currentPrice = parseFloat(prices[0].lastPrice)
      
      console.log(`Preço atual de ${symbol}: $${currentPrice}`)
      console.log(`Preço base: $${basePrice}`)
      console.log(`Tamanho do grid: ${gridSize}%`)
      console.log(`Investimento: $${investment}`)
      
      // Calcular níveis do grid
      const gridLevels = []
      for (let i = -5; i <= 5; i++) {
        const level = basePrice * (1 + (i * gridSize / 100))
        gridLevels.push({
          level: i,
          price: level,
          action: i < 0 ? 'BUY' : 'SELL'
        })
      }
      
      console.log('Níveis do Grid:')
      gridLevels.forEach(grid => {
        console.log(`${grid.action} @ $${grid.price.toFixed(2)} (Nível ${grid.level})`)
      })
      
      return gridLevels
    } catch (error) {
      console.error('Erro na estratégia Grid Trading:', error)
      throw error
    }
  }

  // Estratégia DCA (Dollar Cost Average)
  async dcaStrategy(symbol: string, amount: number = 100, frequency: string = 'daily') {
    console.log(`📊 Iniciando DCA Strategy para ${symbol}`)
    
    try {
      const prices = await this.api.getPrices([symbol])
      const currentPrice = parseFloat(prices[0].lastPrice)
      const quantity = amount / currentPrice
      
      console.log(`Comprando $${amount} de ${symbol} (${quantity.toFixed(8)} ${symbol.replace('USDT', '')})`)
      console.log(`Preço atual: $${currentPrice}`)
      console.log(`Frequência: ${frequency}`)
      
      // Simular compra DCA
      const dcaOrder = {
        symbol,
        side: 'BUY' as const,
        type: 'MARKET' as const,
        amount,
        quantity,
        price: currentPrice,
        timestamp: new Date()
      }
      
      return dcaOrder
    } catch (error) {
      console.error('Erro na estratégia DCA:', error)
      throw error
    }
  }

  // Análise de suporte e resistência
  async supportResistanceAnalysis(symbol: string, period: string = '1d', limit: number = 100) {
    console.log(`📈 Analisando suporte e resistência para ${symbol}`)
    
    // Nota: Esta é uma versão simplificada
    // Em produção, você precisaria de dados históricos de klines/candlesticks
    
    try {
      const prices = await this.api.getPrices([symbol])
      const currentPrice = parseFloat(prices[0].lastPrice)
      const high24h = parseFloat(prices[0].highPrice)
      const low24h = parseFloat(prices[0].lowPrice)
      
      // Calcular níveis básicos (exemplo simplificado)
      const resistance1 = high24h
      const resistance2 = high24h * 1.02
      const support1 = low24h
      const support2 = low24h * 0.98
      
      const analysis = {
        symbol,
        currentPrice,
        resistance: [resistance1, resistance2],
        support: [support1, support2],
        range: ((high24h - low24h) / low24h * 100).toFixed(2) + '%'
      }
      
      console.log('Análise de Suporte e Resistência:')
      console.log(`Preço atual: $${currentPrice}`)
      console.log(`Resistência: $${resistance1.toFixed(2)} / $${resistance2.toFixed(2)}`)
      console.log(`Suporte: $${support1.toFixed(2)} / $${support2.toFixed(2)}`)
      console.log(`Range 24h: ${analysis.range}`)
      
      return analysis
    } catch (error) {
      console.error('Erro na análise de suporte e resistência:', error)
      throw error
    }
  }
}

// ==========================================
// FUNÇÕES UTILITÁRIAS
// ==========================================

export class BinanceUtils {
  
  // Calcular quantidade baseada em valor em USD
  static calculateQuantity(usdValue: number, price: number, precision: number = 8): number {
    const quantity = usdValue / price
    return Math.floor(quantity * Math.pow(10, precision)) / Math.pow(10, precision)
  }

  // Calcular stop loss
  static calculateStopLoss(entryPrice: number, percentage: number, side: 'BUY' | 'SELL'): number {
    if (side === 'BUY') {
      return entryPrice * (1 - percentage / 100)
    } else {
      return entryPrice * (1 + percentage / 100)
    }
  }

  // Calcular take profit
  static calculateTakeProfit(entryPrice: number, percentage: number, side: 'BUY' | 'SELL'): number {
    if (side === 'BUY') {
      return entryPrice * (1 + percentage / 100)
    } else {
      return entryPrice * (1 - percentage / 100)
    }
  }

  // Verificar se preço está em range
  static isPriceInRange(price: number, target: number, tolerance: number = 0.5): boolean {
    const diff = Math.abs((price - target) / target) * 100
    return diff <= tolerance
  }

  // Formatação de valores
  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(value)
  }

  static formatPercentage(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }
}

// ==========================================
// EXEMPLO DE USO COMPLETO
// ==========================================

/*
// Para usar os exemplos, adicione este código em um componente React:

import { exemplosBinanceAPI, TradingStrategies, BinanceUtils } from '@/examples/binance-usage'

// Em um useEffect ou função:
const testarAPI = async () => {
  // Executar exemplos básicos
  await exemplosBinanceAPI()
  
  // Testar estratégias
  const strategies = new TradingStrategies()
  
  // Grid Trading
  await strategies.gridTrading('BTCUSDT', 5, 45000, 1000)
  
  // DCA Strategy
  await strategies.dcaStrategy('ETHUSDT', 200, 'weekly')
  
  // Análise técnica
  await strategies.supportResistanceAnalysis('BNBUSDT')
  
  // Utilitários
  const quantity = BinanceUtils.calculateQuantity(100, 45000)
  console.log(`Quantidade calculada: ${quantity}`)
  
  const stopLoss = BinanceUtils.calculateStopLoss(45000, 5, 'BUY')
  console.log(`Stop Loss: ${BinanceUtils.formatCurrency(stopLoss)}`)
}
*/

export default {
  exemplosBinanceAPI,
  TradingStrategies,
  BinanceUtils
}