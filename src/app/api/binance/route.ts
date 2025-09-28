import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const runtime = 'edge'

// Configurações da API Binance
const BINANCE_API_KEY = 'rM8UnbEJvGQV52nFD8c5wmQ8UV1655BZHIFXlJRTuAyRJWbZnxpPz1QHK3hEepIa'
const BINANCE_SECRET_KEY = '2d3zEbC1Mgu6JGxugzB5A3DRB2YNSorIIhDWsg7iPGcqvmaOrKxXSv6syVgQFE5E'
const BINANCE_BASE_URL = 'https://api.binance.com'

// Função para criar assinatura HMAC
function createSignature(queryString: string, secretKey: string): string {
  return crypto.createHmac('sha256', secretKey).update(queryString).digest('hex')
}

// Função para fazer requisições autenticadas à Binance
async function binanceRequest(endpoint: string, params: Record<string, any> = {}, method: 'GET' | 'POST' = 'GET'): Promise<any> {
  try {
    // Adicionar timestamp
    const timestamp = Date.now()
    const queryParams = new URLSearchParams({
      ...params,
      timestamp: timestamp.toString()
    })
    
    // Criar assinatura
    const signature = createSignature(queryParams.toString(), BINANCE_SECRET_KEY)
    queryParams.append('signature', signature)
    
    const url = method === 'GET' 
      ? `${BINANCE_BASE_URL}${endpoint}?${queryParams.toString()}`
      : `${BINANCE_BASE_URL}${endpoint}`
    
    const requestOptions: RequestInit = {
      method,
      headers: {
        'X-MBX-APIKEY': BINANCE_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    
    if (method === 'POST') {
      requestOptions.body = queryParams.toString()
    }
    
    const response = await fetch(url, requestOptions)
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Binance API Error: ${response.status} - ${errorText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erro na requisição Binance:', error)
    throw error
  }
}

// GET - Obter dados da conta, preços, etc.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    switch (action) {
      case 'account':
        // Informações da conta
        const accountInfo = await binanceRequest('/api/v3/account')
        return NextResponse.json(accountInfo)
      
      case 'balance':
        // Saldo da conta
        const account = await binanceRequest('/api/v3/account')
        const balances = account.balances?.filter((b: any) => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0) || []
        return NextResponse.json({ balances })
      
      case 'prices':
        // Preços atuais (público - não requer autenticação)
        const symbols = searchParams.get('symbols')?.split(',') || ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT', 'SOLUSDT']
        const prices = await Promise.all(
          symbols.map(async (symbol) => {
            const response = await fetch(`${BINANCE_BASE_URL}/api/v3/ticker/24hr?symbol=${symbol}`)
            if (!response.ok) throw new Error(`Erro ao buscar preço de ${symbol}`)
            return await response.json()
          })
        )
        return NextResponse.json(prices)
      
      case 'orders':
        // Ordens abertas
        const symbol = searchParams.get('symbol') || undefined
        const params: any = {}
        if (symbol) params.symbol = symbol
        
        const orders = await binanceRequest('/api/v3/openOrders', params)
        return NextResponse.json(orders)
      
      case 'trades':
        // Histórico de trades
        const tradeSymbol = searchParams.get('symbol') || 'BTCUSDT'
        const limit = searchParams.get('limit') || '10'
        
        const trades = await binanceRequest('/api/v3/myTrades', {
          symbol: tradeSymbol,
          limit: parseInt(limit)
        })
        return NextResponse.json(trades)
      
      default:
        return NextResponse.json(
          { error: 'Ação não encontrada. Use: account, balance, prices, orders, trades' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Erro GET Binance API:', error)
    return NextResponse.json(
      { error: 'Erro na API Binance', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Criar ordens, cancelar, etc.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    switch (action) {
      case 'order':
        // Criar nova ordem
        const {
          symbol,
          side,
          type = 'MARKET',
          quantity,
          price,
          timeInForce = 'GTC'
        } = body
        
        if (!symbol || !side || !quantity) {
          return NextResponse.json(
            { error: 'Parâmetros obrigatórios: symbol, side, quantity' },
            { status: 400 }
          )
        }
        
        const orderParams: any = {
          symbol,
          side: side.toUpperCase(),
          type: type.toUpperCase(),
          quantity
        }
        
        if (type.toUpperCase() === 'LIMIT') {
          if (!price) {
            return NextResponse.json(
              { error: 'Preço obrigatório para ordens LIMIT' },
              { status: 400 }
            )
          }
          orderParams.price = price
          orderParams.timeInForce = timeInForce
        }
        
        const order = await binanceRequest('/api/v3/order', orderParams, 'POST')
        return NextResponse.json(order)
      
      case 'cancel':
        // Cancelar ordem
        const { orderId, cancelSymbol } = body
        
        if (!orderId || !cancelSymbol) {
          return NextResponse.json(
            { error: 'Parâmetros obrigatórios: orderId, symbol' },
            { status: 400 }
          )
        }
        
        const cancelResult = await binanceRequest('/api/v3/order', {
          symbol: cancelSymbol,
          orderId
        }, 'POST')
        
        return NextResponse.json(cancelResult)
      
      default:
        return NextResponse.json(
          { error: 'Ação não encontrada. Use: order, cancel' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Erro POST Binance API:', error)
    return NextResponse.json(
      { error: 'Erro na API Binance', details: error.message },
      { status: 500 }
    )
  }
}