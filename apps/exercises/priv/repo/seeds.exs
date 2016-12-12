alias Exercises.Repo
alias Exercises.Schemas

english = "2"

HTTPoison.start #its not an app dependency so it's not started unless explicit

{:ok, %{body: response}} = HTTPoison.get("https://wger.de/api/v2/exercise/?language=#{english}")
{:ok, %{body: categories}} = HTTPoison.get("https://wger.de/api/v2/exercisecategory/")

exercises = response
|> Poison.Parser.parse!
|> Map.get("results")

categories = categories
|> Poison.Parser.parse!
|> Map.get("results")

exercises = for %{"description" => description, "name" => name, "category" => cat_id} <- exercises,
                %{"id" => cat_id, "name" => cat_name} <- categories
do
  %Schemas.Exercise{name: name, description: description, category: cat_name}
end

Enum.map(exercises, &Repo.insert!/1)