const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;


export async function getResponse(userMessage){
    const response = await fetch('https://api.openai.com/v1/chat/completions',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {role: 'system', content: 'Eres un asistente experto en temas del sueño, solo respondes a temas del sueño y cuidado del sueño, si te preguntan otra cosa responde que solo respondes cosas del sueño.'},
                {role: 'user', content: userMessage}
            ],
            temperature: 0.7,
            max_tokens: 350
        })
    });

    if(!response.ok){
        const error = await response.json();
        throw new Error(error.error.message);
    }

    const data = await response.json();
    return data.choices[0].message.content;
    
}