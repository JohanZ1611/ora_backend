import { resend } from "../config/resend";

export const sendReminderEmail = async (params: {
  to: string;
  userName: string;
  reminderType: "transaction" | "group" | "debt";
  itemName: string;
  amount: number;
  dueDate: Date;
  currency: string;
}): Promise<void> => {
  const formattedDate = params.dueDate.toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedAmount = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: params.currency,
  }).format(params.amount);

  const typeLabel = {
    transaction: "pago",
    group: "pago del grupo",
    debt: "pago de deuda",
  }[params.reminderType];

  await resend.emails.send({
    from: "Ora <recordatorios@tudominio.com>",
    to: params.to,
    subject: `🔔 Recordatorio de ${typeLabel}: ${params.itemName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #A8896A;">Hola ${params.userName} 👋</h2>
        <p>Te recordamos que tienes un ${typeLabel} próximo:</p>
        <div style="background: #F5F0E8; border-radius: 12px; padding: 16px; margin: 16px 0;">
          <p><strong>📋 Concepto:</strong> ${params.itemName}</p>
          <p><strong>💰 Monto:</strong> ${formattedAmount}</p>
          <p><strong>📅 Fecha:</strong> ${formattedDate}</p>
        </div>
        <p style="color: #78716C; font-size: 14px;">
          Este es un recordatorio automático de tu app Ora.
        </p>
      </div>
    `,
  });
};