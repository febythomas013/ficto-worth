import { supabase } from "@/lib/supabaseClient";

interface Props {
  params: { series: string; name: string };
}

export default async function CharacterPage({ params }: Props) {
  const { data: character, error: characterError } = await supabase
    .from("characters")
    .select("*")
    .eq("series", params.series)
    .eq("name", params.name)
    .single();

  if (characterError || !character) {
    return <div className="text-white p-10">Character not found.</div>;
  }

  const { data: items, error: itemsError } = await supabase
    .from("net_worth_items")
    .select("*")
    .eq("character_id", character.id);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-2">{character.full_name}</h1>
      <p className="text-lg text-gray-300 mb-4 italic">{character.series}</p>
      <p className="text-md mb-6">{character.bio}</p>

      <h2 className="text-2xl font-semibold mb-4">Net Worth Breakdown</h2>
      <ul className="space-y-3">
        {items?.map((item) => (
          <li key={item.id} className="border-b border-gray-700 pb-2">
            <strong className="capitalize">{item.category}:</strong>{" "}
            {item.description} – ${Math.abs(item.value_usd)}{" "}
            <span className="text-sm text-gray-400">({item.episode})</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 text-2xl text-green-400 font-bold">
        Estimated Net Worth: ${character.net_worth}
      </div>
    </main>
  );
}
