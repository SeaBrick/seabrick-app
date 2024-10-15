export interface Props {
  children: React.ReactNode;
}

export default function TableBodyRow({ children }: Props) {
  return (
    <tr className="even:bg-graay-100 direct-children:px-2 direct-children:py-4 direct-children:text-center">
      {children}
    </tr>
  );
}
