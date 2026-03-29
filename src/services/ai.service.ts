import { geminiModel } from "../config/gemini";

export const generateDailyTip = async (context: {
  totalIncome: number;
  totalExpense: number;
  topCategory: string;
  currency: string;
}): Promise<string> => {
  const prompt = `
    Eres un asistente financiero personal llamado Ora. 
    El usuario tiene estos datos del mes actual:
    - Ingresos totales: ${context.currency} ${context.totalIncome.toLocaleString()}
    - Gastos totales: ${context.currency} ${context.totalExpense.toLocaleString()}
    - Categoría con más gastos: ${context.topCategory}
    
    Dame UN solo consejo financiero breve y práctico en español (máximo 2 oraciones).
    Sé amigable, directo y útil. No uses emojis.
  `;

  const result = await geminiModel.generateContent(prompt);
  return result.response.text().trim();
};

export const generateReportSummary = async (context: {
  period: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  byCategory: { category: string; amount: number }[];
  currency: string;
}): Promise<string> => {
  const categoriesText = context.byCategory
    .map((c) => `${c.category}: ${context.currency} ${c.amount.toLocaleString()}`)
    .join(", ");

  const prompt = `
    Eres Ora, un asistente financiero personal. Habla en primera persona dirigiéndote al usuario.
    Genera un resumen hablado de sus finanzas para el periodo: ${context.period}.
    
    Datos:
    - Ingresos: ${context.currency} ${context.totalIncome.toLocaleString()}
    - Gastos: ${context.currency} ${context.totalExpense.toLocaleString()}
    - Balance: ${context.currency} ${context.balance.toLocaleString()}
    - Gastos por categoría: ${categoriesText}
    
    El resumen debe:
    1. Comenzar saludando brevemente
    2. Explicar cómo van las finanzas del periodo
    3. Mencionar en qué se gastó más
    4. Dar 1 recomendación concreta
    5. Terminar con una frase motivadora
    
    Máximo 150 palabras. Tono amigable y conversacional en español.
  `;

  const result = await geminiModel.generateContent(prompt);
  return result.response.text().trim();
};

export const suggestBudgets = async (context: {
  history: { category: string; avgAmount: number }[];
  currency: string;
}): Promise<{ category: string; suggestedLimit: number; reason: string }[]> => {
  const historyText = context.history
    .map((h) => `${h.category}: promedio ${context.currency} ${h.avgAmount.toLocaleString()}`)
    .join(", ");

  const prompt = `
    Eres Ora, un asistente financiero. Basándote en el historial de gastos del usuario, 
    sugiere presupuestos mensuales razonables.
    
    Historial de gastos promedio por categoría: ${historyText}
    
    Responde ÚNICAMENTE con un JSON válido, sin texto adicional, sin bloques de código, sin backticks.
    El JSON debe ser un array con este formato exacto:
    [{"category":"nombre","suggestedLimit":numero,"reason":"explicación breve"}]
  `;

  const result = await geminiModel.generateContent(prompt);
  const text = result.response.text().trim();

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    return [];
  }
};

export const interpretVoiceAction = async (transcript: string): Promise<{
  action: string;
  data: Record<string, unknown>;
  confirmationMessage: string;
}> => {
  const prompt = `
    Eres Ora, un asistente financiero. El usuario te habló y quiere registrar algo.
    Transcripción: "${transcript}"
    
    Interpreta la intención y extrae los datos necesarios.
    
    Responde ÚNICAMENTE con un JSON válido, sin texto adicional, sin bloques de código, sin backticks.
    El JSON debe tener exactamente este formato:
    {
      "action": "CREATE_EXPENSE" | "CREATE_INCOME" | "CREATE_GROUP" | "ADD_TO_GROUP" | "UNKNOWN",
      "data": {
        "amount": numero o null,
        "category": "string o null",
        "description": "string o null",
        "groupName": "string o null",
        "frequency": "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
      },
      "confirmationMessage": "mensaje confirmando lo que entendiste en español"
    }
  `;

  const result = await geminiModel.generateContent(prompt);
  const text = result.response.text().trim();

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return {
      action: "UNKNOWN",
      data: {},
      confirmationMessage: "No pude entender la acción. Por favor intenta de nuevo.",
    };
  }
};