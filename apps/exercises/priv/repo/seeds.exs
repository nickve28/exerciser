alias Exercises.Repo
alias Exercises.Schemas

english = "2"

HTTPoison.start #its not an app dependency so it's not started unless explicit

{:ok, %{body: response}} = HTTPoison.get("https://wger.de/api/v2/exercise/?language=#{english}")
{:ok, %{body: categories}} = HTTPoison.get("https://wger.de/api/v2/exercisecategory/")

categories = categories
|> Poison.Parser.parse!
|> Map.get("results")

exercises = response
|> Poison.Parser.parse!
|> Map.get("results")
|> Enum.group_by(&(&1["name"]))
|> Enum.reduce([], fn {_, exercises}, memo ->
  category_ids = Enum.map(exercises, fn %{"category" => category} ->
    category
  end)

  categories = for cat_id <- category_ids,
      %{"id" => cat_id, "name" => name} <- categories, do: name
  IO.inspect(categories)

  [exercise | _] = exercises
  [Map.merge(exercise, %{"categories" => categories}) | memo]
end)


exercises = for %{"name" => name, "categories" => categories, "description" => description} <- exercises
do
  %Schemas.Exercise{name: name, description: description, categories: categories}
end

Enum.map(exercises, &Repo.insert!/1)