export interface Props {
  children: React.ReactNode;
}

export default function TableHeader({ children }: Props) {
  return (
    <thead className="bg-seabrick-blue text-white">
      <tr className="font-semibold direct-children:px-3 direct-children:py-3.5">
        {children}
      </tr>
    </thead>
  );
}
