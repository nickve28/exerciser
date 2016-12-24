defmodule Api.Resolvers.WorkoutResolver do
  def list(args,  %{context: %{user_id: user_id}}) do
    payload = %{user_id: user_id}
    |> Map.merge(Map.take(args, [:limit, :offset]))

    Workout.Services.Workout.list(payload)
  end

  def get(%{id: id}, _) do
    Workout.Services.Workout.get(%{id: id})
  end
end