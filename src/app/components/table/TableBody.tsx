export interface Props {
  children: React.ReactNode;
}

export default function TableBody({ children }: Props) {
  return (
    <tbody className="divide-y divide-seabrick-blue bg-white transition-all duration-150 direct-children:whitespace-nowrap direct-children:px-3 direct-children:py-4">
      {children}
    </tbody>
  );
}
