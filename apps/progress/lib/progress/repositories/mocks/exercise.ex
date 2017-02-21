defmodule Progress.Repositories.Mocks.Exercise do
  def get(id) when id <= 3 do
    exercise = %{
      id: id,
      name: "foo",
      type: "strength",
      description: "bar",
      categories: ["baz"]
    }
    {:ok, exercise}
  end

  def get(_) do
    {:error, {:enotfound, "The exercise could not be found", []}}
  end
end