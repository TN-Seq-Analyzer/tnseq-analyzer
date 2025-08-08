function CardInfo({
  Icon,
  title,
  description,
}: {
  Icon: React.ReactElement;
  title: string;
  description: string;
}) {
  return (
    <div className="shadow-custom flex w-full flex-col items-start gap-1 rounded-md bg-[var(--bg-card)] p-3 transition-transform duration-500 ease-in-out hover:scale-105">
      {Icon}
      <h2 className="font-inter text-textPrimary text-[11px] font-bold">
        {title}
      </h2>
      <p className="font-inter text-descriptionCard text-[10px] font-light">
        {description}
      </p>
    </div>
  );
}

export default CardInfo;
