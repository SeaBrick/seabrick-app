interface ContainerProps {
  children: React.ReactNode;
  bgColor: `bg-${string}`;
}
export default function Container({
  children,
  bgColor = "bg-white",
}: ContainerProps) {
  return (
    <div className={`${bgColor} shadow-lg border rounded`}>{children}</div>
  );
}
