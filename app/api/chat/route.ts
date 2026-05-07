import OpenAI from 'openai'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const { messages, model, apiKey, actionMode } = await request.json()

    console.log('[v0] API Route - Received request')
    console.log('[v0] API Route - Model:', model)
    console.log('[v0] API Route - Action Mode:', actionMode)

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key is required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const client = new OpenAI({
      baseURL: 'https://integrate.api.nvidia.com/v1',
      apiKey: apiKey,
    })

    // Adjust system prompt based on action mode
    let systemPrompt = 'You are a helpful AI assistant.'
    
    switch (actionMode) {
      case 'thinking':
        systemPrompt = 'You are a thoughtful AI assistant. Take your time to think through problems step by step, showing your reasoning process. Be thorough and analytical.'
        break
      case 'pro':
        systemPrompt = 'You are an expert AI assistant with professional knowledge. Provide detailed, comprehensive, and technically accurate responses.'
        break
      case 'image':
        systemPrompt = 'You are an AI assistant specialized in analyzing and describing images. Provide detailed observations and insights about any images provided.'
        break
      case 'fast':
      default:
        systemPrompt = 'You are a fast and efficient AI assistant. Provide concise, direct answers. Be helpful but brief.'
        break
    }

    const formattedMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((msg: { role: string; content: string; image?: string }) => {
        if (msg.image) {
          return {
            role: msg.role as 'user' | 'assistant',
            content: [
              { type: 'text' as const, text: msg.content },
              { type: 'image_url' as const, image_url: { url: msg.image } },
            ],
          }
        }
        return {
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }
      }),
    ]

    const stream = await client.chat.completions.create({
      model: model,
      messages: formattedMessages,
      stream: true,
      max_tokens: 2048,
      temperature: actionMode === 'thinking' ? 0.3 : 0.7,
    })

    const encoder = new TextEncoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[v0] API Error:', error)
    
    // Extract detailed error information
    let errorMessage = 'An error occurred'
    let errorDetails = ''
    
    if (error instanceof Error) {
      errorMessage = error.message
      console.error('[v0] Error message:', error.message)
      console.error('[v0] Error stack:', error.stack)
      
      // Check for OpenAI API error details
      if ('status' in error) {
        console.error('[v0] Error status:', (error as { status?: number }).status)
      }
      if ('error' in error) {
        const apiError = (error as { error?: { message?: string; type?: string; code?: string } }).error
        console.error('[v0] API Error details:', apiError)
        errorDetails = apiError?.message || ''
      }
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails,
        hint: 'Check if the model ID is correct for NVIDIA API'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
