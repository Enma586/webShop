export const FormSection = ({ number, title, color = "bg-primary" }) => (
  <div className="flex items-center gap-3 mb-10">
    <div className={`w-1 h-4 ${color}`} />
    <p className="text-[10px] font-black text-foreground uppercase tracking-[0.5em]">
      {number}. {title}
    </p>
  </div>
);