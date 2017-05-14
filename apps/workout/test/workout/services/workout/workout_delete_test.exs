defmodule Workout.Services.WorkoutDeleteTest do
  use ExUnit.Case, async: false

  alias Workout.Schemas
  alias Workout.Repo
  alias Workout.RepoHelper

  setup_all do
    Workout.Repositories.MockExercise.enable #enable mock genserver as proxy for test

    on_exit(fn -> Workout.Repositories.MockExercise.disable end)
    :ok
  end

  setup do
    Repo.delete_all(Schemas.Workout)
    Repo.delete_all(Schemas.PerformedExercise)
    Repo.delete_all(Schemas.Exercise)

    :ok
  end
  @tag :delete
  test "#delete should return :enotfound if workout is not found" do
    assert {:error, {:enotfound, "Workout not found", []}} === Workout.Services.Workout.delete(%{id: 1})
  end

  @tag :delete
  test "#delete should return the deleted workout" do
    datetime = Timex.to_datetime(:calendar.local_time)
    |> Timex.Ecto.DateTime.cast!

    %{id: exercise_id} = %Schemas.Exercise{name: "foo", categories: ["bar"], description: "baz", metric: "kg", type: "strength"}
    |> Exercise.RepoHelper.create_exercise

    exercise = %Schemas.Workout{description: "Saturday workout",
      workout_date: datetime, user_id: 1, performed_exercises: [
        %{exercise_id: exercise_id, reps: 2, weight: 60.0}
      ]}
    |> RepoHelper.create

    assert {:ok, exercise.id} === Workout.Services.Workout.delete(%{id: exercise.id})
  end
end