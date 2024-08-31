import { Aggregator, Token } from "@/app/lib/interfaces";

interface SelectTokensProps {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  aggregators: Aggregator[];
  tokens: Token[];
}

export default function SelectTokens({
  index,
  setIndex,
  aggregators,
  tokens,
}: SelectTokensProps) {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setIndex(Number(value));
  };

  return (
    <form className="max-w-sm mx-auto">
      <label htmlFor="oracles" className="block mb-2 text-sm font-medium">
        Select an payment token
      </label>

      <select
        onChange={(e) => handleSelectChange(e)}
        defaultValue={index}
        id="token-payment"
        className="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        {tokens.map((token, i) => (
          <option key={token.id + "-" + i} value={i}>
            {token.name}
          </option>
        ))}
      </select>
    </form>
  );
}
