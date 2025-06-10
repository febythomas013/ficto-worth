import { supabase } from "@/lib/supabaseClient";

interface Props {
  params: { series: string; name: string };
}

type Category = 'income' | 'asset' | 'expense' | 'debt';
type NetWorthItem = {
  id: string;
  category: Category;
  description: string;
  episode: string;
  value_usd: number;
};

export default async function CharacterPage({ params }: Props) {
  const { data: character, error: characterError } = await supabase
    .from("characters")
    .select("*")
    .eq("series", "family-guy")
    .eq("name", "peter-griffin")
    .single();

  if (characterError || !character) {
    return <div className="text-white p-10">Character not found.</div>;
  }

  const itemResponse = await supabase
    .from("net_worth_items")
    .select("*")
    .eq("character_id", character.id);

  const items = itemResponse.data as NetWorthItem[];

  if (!items) {
    return <div className="text-white p-10">No breakdown data found.</div>;
  }

  const grouped: Record<Category, NetWorthItem[]> = {
    income: [],
    asset: [],
    expense: [],
    debt: [],
  };

  items.forEach((item) => {
    if (grouped[item.category]) {
      grouped[item.category].push(item);
    }
  });

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-2">{character.full_name}</h1>
      <p className="text-lg text-gray-300 mb-4 italic">{character.series}</p>
      <p className="text-md mb-6">{character.bio}</p>

      {(["income", "asset", "expense", "debt"] as const).map((cat) => (
        <div key={cat} className="mb-8">
          <h2 className="text-2xl font-semibold capitalize mb-3 border-b border-gray-600 pb-1">
            {cat === "debt"
              ? "Liabilities"
              : cat === "asset"
              ? "Assets"
              : cat === "income"
              ? "Income"
              : "Expenses"}
          </h2>
          <ul className="space-y-3">
            {grouped[cat].map((item) => (
              <li
                key={item.id}
                className="bg-zinc-900 p-4 rounded-md border border-zinc-700"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p>
                      <strong>{item.description}</strong>
                    </p>
                    <p className="text-sm text-gray-400">
                      Value: ${Math.abs(item.value_usd)} — {item.episode}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-green-600 rounded text-white text-sm">
                      Agree 👍
                    </button>
                    <button className="px-3 py-1 bg-red-600 rounded text-white text-sm">
                      Dispute 👎
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="mt-8 text-2xl text-green-400 font-bold">
        Estimated Net Worth: ${character.net_worth}
      </div>
    </main>
  );
}
