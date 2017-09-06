defmodule Workout.Operations.Exercise do
  @moduledoc """
    Operations are an abstraction over commonly used 'operations' in code, revolving repositories
    Logic often used in the application, but not repository logic, can be wrapped in operations

    This module contains operations for Exercises
  """

  @exercise_repo Application.get_env(:workout, :exercise_repo) || Workout.Repositories.Exercise

  import Workout.Error

  @doc """
    Lists a set of exercises matching the ids sent
  """
  def get_exercises_details(%{performed_exercises: exercises_payload} = payload) when is_list(exercises_payload) do
    #TODO IMPROVE
    exercise_ids = for %{exercise_id: id} <- exercises_payload, do: id
    {:ok, exercises} = @exercise_repo.list(%{ids: exercise_ids})

    found_exercise_ids = for %{id: id} <- exercises, do: id

    case Enum.sort(Enum.uniq(exercise_ids)) === Enum.sort(found_exercise_ids) do
      true ->
        indiced_exercises = for %{id: id} = exercise <- exercises, into: %{}, do: {id, exercise}
        full_exercise_data = for %{exercise_id: id} = exercise <- exercises_payload do
          %{type: type} = indiced_exercises[id]
          Map.merge(exercise, %{type: type})
        end
        {:ok, full_exercise_data}
      false -> {:error, {:invalid, "The data sent was invalid", [{:exercise_id, "Not found"}]}}
    end
  end

  def get_exercises_details(_) do
    {:error, {:invalid, "The request was deemed invalid", [performed_exercises: "is required"]}}
  end

  def find_exercise(id) do
    case @exercise_repo.get(id) do
      {:ok, nil} -> handle_error(:enotfound)
      {:ok, exercise} -> {:ok, exercise}
    end
  end
end