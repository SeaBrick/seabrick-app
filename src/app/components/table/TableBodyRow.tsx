export interface Props {
  children: React.ReactNode;
  uniqueId: string;
}

export default function TableBodyRow({ children, uniqueId }: Props) {
  return (
    <tr
      className="even:bg-graay-100 direct-children:px-2 direct-children:py-4 direct-children:text-center"
      key={uniqueId}
    >
      {children}
    </tr>
  );
}
