interface PaymentStatusBadgeProps {
  isPaid: boolean;
}

export function PaymentStatusBadge({ isPaid }: PaymentStatusBadgeProps) {
  if (isPaid) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400">
        Pago
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400">
      Não Pago
    </span>
  );
}
