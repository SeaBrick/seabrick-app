export interface Props {
  children: React.ReactNode;
}

export default function Table({ children }: Props) {
  return (
    <div>
      <div className="overflow-auto rounded-lg border border-seabrick-blue">
        <table className="w-full divide-y divide-seabrick-blue text-center">
          {children}
        </table>
      </div>
    </div>
  );
}
