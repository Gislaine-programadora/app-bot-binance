// Utilitários para integração com Binance
export interface BinanceBalance {
  asset: string
  free: string
  locked: string
}

export interface BinanceOrder {
  symbol: string
  orderId: number
  orderListId: number
  clientOrderId: string
  price: string
  origQty: string
  executedQty: string
  cummulativeQuoteQty: string
  status: string
  timeInForce: string
  type: string
  side: string
  stopPrice: string
  icebergQty: string
  time: number
  updateTime: number
  isWorking: boolean
}

export interface BinanceTrade {
  symbol: string
  id: number
  orderId: number
  orderListId: number
  price: string
  qty: string
  quoteQty: string
  commission: string
  commissionAsset: string
  time: number
  isBuyer: boolean
  isMaker: boolean
  isBestMatch: boolean
}

export interface BinancePrice {
  symbol: string
  price: string
  priceChange: string
  priceChangePercent: string
  weightedAvgPrice: string
  prevClosePrice: string
  lastPrice: string
  lastQty: string
  bidPrice: string
  bidQty: string
  askPrice: string
  askQty: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  openTime: number
  closeTime: number
}

// Funções para chamar a API Binance
export class BinanceAPI {
  private baseUrl = '/api/binance'

  async getAccount() {
    const response = await fetch(`${this.baseUrl}?action=account`)
    if (!response.ok) throw new Error('Erro ao obter dados da conta')
    return await response.json()
  }

  async getBalance(): Promise<BinanceBalance[]> {
    const response = await fetch(`${this.baseUrl}?action=balance`)
    if (!response.ok) throw new Error('Erro ao obter saldo')
    const data = await response.json()
    return data.balances
  }

  async getPrices(symbols?: string[]): Promise<BinancePrice[]> {
    const symbolsParam = symbols ? symbols.join(',') : ''
    const response = await fetch(`${this.baseUrl}?action=prices&symbols=${symbolsParam}`)
    if (!response.ok) throw new Error('Erro ao obter preços')
    return await response.json()
  }

  async getOrders(symbol?: string): Promise<BinanceOrder[]> {
    const symbolParam = symbol ? `&symbol=${symbol}` : ''
    const response = await fetch(`${this.baseUrl}?action=orders${symbolParam}`)
    if (!response.ok) throw new Error('Erro ao obter ordens')
    return await response.json()
  }

  async getTrades(symbol: string = 'BTCUSDT', limit: number = 10): Promise<BinanceTrade[]> {
    const response = await fetch(`${this.baseUrl}?action=trades&symbol=${symbol}&limit=${limit}`)
    if (!response.ok) throw new Error('Erro ao obter trades')
    return await response.json()
  }

  async createOrder(params: {
    symbol: string
    side: 'BUY' | 'SELL'
    type?: 'MARKET' | 'LIMIT'
    quantity: number
    price?: number
    timeInForce?: 'GTC' | 'IOC' | 'FOK'
  }): Promise<BinanceOrder> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'order',
        ...params
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erro ao criar ordem')
    }
    
    return await response.json()
  }

  async cancelOrder(orderId: number, symbol: string): Promise<any> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'cancel',
        orderId,
        cancelSymbol: symbol
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erro ao cancelar ordem')
    }
    
    return await response.json()
  }

  // Utilitários
  formatPrice(price: string | number): string {
    return parseFloat(price.toString()).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    })
  }

  formatPercent(percent: string | number): string {
    return parseFloat(percent.toString()).toFixed(2) + '%'
  }

  calculateProfitLoss(entryPrice: number, currentPrice: number, quantity: number, side: 'BUY' | 'SELL'): number {
    if (side === 'BUY') {
      return (currentPrice - entryPrice) * quantity
    } else {
      return (entryPrice - currentPrice) * quantity
    }
  }
}

export const binanceAPI = new BinanceAPI()