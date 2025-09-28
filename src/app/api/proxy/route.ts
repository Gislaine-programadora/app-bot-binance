import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Mapeamento de variáveis secretas customizadas (se necessário)
const customSecretMappings: Record<string, string> = {
  // Exemplo: "BINANCE_API_KEY_MASKED": process.env.BINANCE_API_KEY || "",
  // "BINANCE_SECRET_MASKED": process.env.BINANCE_SECRET || ""
};

function createSecretMap(): Map<string, string> {
  const secretMap = new Map<string, string>();

  for (const [key, value] of Object.entries(customSecretMappings)) {
    if (value) {
      secretMap.set(key, value);
    }
  }

  return secretMap;
}

// Função para validar origem da requisição
function isValidOrigin(origin: string): boolean {
  const allowedOrigins = [
    "api.binance.com",
    "api.binance.us", 
    "testnet.binance.vision",
    "api.coingecko.com",
    "api.coinmarketcap.com",
    "api.cryptocompare.com"
  ];
  
  return allowedOrigins.some(allowedOrigin => 
    origin.includes(allowedOrigin)
  );
}

// Headers CORS para APIs de criptomoedas
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-MBX-APIKEY",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  try {
    // Parse do body da requisição
    let body;
    try {
      const rawBody = await request.text();
      body = rawBody ? JSON.parse(rawBody) : {};
    } catch (error) {
      return NextResponse.json(
        { 
          error: "Invalid JSON format", 
          details: "Request body must be valid JSON" 
        }, 
        { 
          status: 400,
          headers: corsHeaders 
        }
      );
    }

    // Substituir palavras mascaradas por secrets se necessário
    const wordMap = createSecretMap();
    if (wordMap.size > 0) {
      body = replaceMaskedWordsWithSecrets(body, wordMap);
    }

    // Validação dos campos obrigatórios
    const { protocol, origin, path, method, headers = {}, body: requestBody } = body;

    if (!protocol || !origin || !path || !method) {
      return NextResponse.json(
        { 
          error: "Missing required fields", 
          details: "Required: protocol, origin, path, method",
          example: {
            protocol: "https",
            origin: "api.binance.com",
            path: "/api/v3/ticker/24hr",
            method: "GET",
            headers: {},
          }
        }, 
        { 
          status: 400,
          headers: corsHeaders 
        }
      );
    }

    // Validação de segurança - apenas APIs permitidas
    if (!isValidOrigin(origin)) {
      return NextResponse.json(
        { 
          error: "Origin not allowed", 
          details: `Origin ${origin} is not in the allowed list` 
        }, 
        { 
          status: 403,
          headers: corsHeaders 
        }
      );
    }

    // Preparar headers da requisição externa
    const fetchHeaders = new Headers();
    
    // Adicionar headers personalizados
    Object.entries(headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        fetchHeaders.set(key, value);
      }
    });

    // Headers padrão para APIs de criptomoedas
    if (!fetchHeaders.has('User-Agent')) {
      fetchHeaders.set('User-Agent', 'BotBinancePro/1.0.0');
    }

    // Preparar body da requisição externa
    let finalBody: string | FormData | undefined;
    
    if (requestBody) {
      if (requestBody instanceof FormData) {
        finalBody = requestBody;
      } else if (typeof requestBody === 'object') {
        finalBody = JSON.stringify(requestBody);
        if (!fetchHeaders.has('Content-Type')) {
          fetchHeaders.set('Content-Type', 'application/json');
        }
      } else if (typeof requestBody === 'string') {
        finalBody = requestBody;
      }
    }

    // Construir URL final
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const finalUrl = `${protocol}://${origin}/${cleanPath}`;

    console.log(`[PROXY] ${method} ${finalUrl}`);

    // Fazer a requisição para a API externa
    const response = await fetch(finalUrl, {
      method: method.toUpperCase(),
      headers: fetchHeaders,
      body: ['GET', 'HEAD'].includes(method.toUpperCase()) ? undefined : finalBody,
    });

    // Log do status da resposta
    console.log(`[PROXY] Response: ${response.status} ${response.statusText}`);

    // Verificar se a resposta é JSON
    const contentType = response.headers.get('Content-Type') || '';
    const isJSON = contentType.includes('application/json') || contentType.includes('text/json');

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          error: `External API error: ${response.status} ${response.statusText}`,
          details: isJSON ? JSON.parse(errorText) : errorText,
          url: finalUrl
        }, 
        { 
          status: response.status,
          headers: corsHeaders 
        }
      );
    }

    // Parse da resposta
    let responseData;
    if (isJSON) {
      responseData = await response.json();
    } else {
      responseData = { data: await response.text() };
    }

    // Retornar resposta com headers CORS
    return NextResponse.json(responseData, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('[PROXY] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: "Proxy request failed", 
        details: errorMessage,
        timestamp: new Date().toISOString()
      }, 
      { 
        status: 500,
        headers: corsHeaders 
      }
    );
  }
}

// Função para substituir palavras mascaradas por secrets
function replaceMaskedWordsWithSecrets(obj: any, wordMap: Map<string, string>): any {
  if (typeof obj === "string") {
    return replaceInString(obj, wordMap);
  } else if (Array.isArray(obj)) {
    return obj.map(item => replaceMaskedWordsWithSecrets(item, wordMap));
  } else if (typeof obj === "object" && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = replaceMaskedWordsWithSecrets(obj[key], wordMap);
      }
    }
    return newObj;
  }
  return obj;
}

// Função para substituir strings mascaradas
function replaceInString(str: string, wordMap: Map<string, string>): string {
  let result = str;
  for (const [word, replacement] of Array.from(wordMap.entries())) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    result = result.replace(regex, replacement);
  }
  return result;
}