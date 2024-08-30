export default function Container({ children, bgColor = "bg-white" }: any) {
  return (
    <div className={`${bgColor} shadow-lg border rounded`}>{children}</div>
  );
}
