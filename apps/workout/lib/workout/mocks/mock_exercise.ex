defmodule Workout.Repositories.MockExercise do
  @moduledoc false
  def list(%{ids: [0]}) do
    {:ok, []}
  end

  def list(%{ids: [1]}) do
    {:ok, [%{id: 1, name: "Barbell Bench Press", description: "something", categories: ["Chest"], type: "strength"}]}
  end

  def list(%{ids: [1, 2]}) do
    {:ok, [
      %{id: 1, name: "Barbell Bench Press", description: "something", categories: ["Chest"], type: "strength"},
      %{id: 2, name: "Threadmill", description: "something", categories: ["Fitness"], type: "endurance"}
    ]}
  end

  def list(%{ids: [id]}) when is_number(id) do
    {:ok, [%{id: id, name: "Squats", description: "something", categories: ["Back"], type: "strength"}]}
  end
end