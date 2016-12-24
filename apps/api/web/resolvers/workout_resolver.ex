defmodule Api.Resolvers.WorkoutResolver do
  def list(_args,  %{context: %{user_id: user_id}}) do
    Workout.Services.Workout.list(%{user_id: user_id})
    |> IO.inspect
  end
end