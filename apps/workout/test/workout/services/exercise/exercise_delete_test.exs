defmodule Workout.Services.ExerciseDeleteTest do
  use ExUnit.Case, async: false #since we reset DB each session as a clean slate
  alias Workout.Schemas
  alias Workout.Services
  alias Workout.Repo
  alias Exercise.RepoHelper

  setup do
    Workout.Repositories.MockWorkout.enable #enable mock genserver as proxy for test

    on_exit(fn -> Workout.Repositories.MockWorkout.disable end)

    Repo.delete_all(Schemas.PerformedExercise)
    Repo.delete_all(Schemas.Workout)
    Repo.delete_all(Schemas.Exercise)

    exercise = RepoHelper.create_exercise(%{name: "Barbell Bench Press", description: "Barbell bench press",
      categories: ["Triceps", "Chest"], type: "strength", metric: "kg"})
    {:ok, exercise: exercise}
  end

  @tag :delete
  describe "when no exercise is found" do
    test "#delete should return :enotfound when no exercise is found", %{exercise: %{id: id}} do
      assert {:error, {:enotfound, _, []}} = Services.Exercise.delete(%{id: id + 1})
    end
  end

  describe "when the exercise is not in used in a workout" do
    @tag :delete
    test "#delete should return the exercise that is deleted", %{exercise: %{id: id}} do
      assert {:ok, id} === Services.Exercise.delete(%{id: id})
    end
  end

  @tag :delete
  @tag :delete_constraint
  describe "when the exercise exists in a workout" do
    test "#delete should return unprocessable", %{exercise: %{id: id}} do
      datetime = Timex.to_datetime(:calendar.local_time)
      |> Timex.Ecto.DateTime.cast!

      %Schemas.Workout{workout_date: datetime, description: "foo", user_id: 9, performed_exercises: [
        %{
          exercise_id: id,
          weight: 1.0,
          sets: 2,
          reps: 3
        }
      ]}
      |> Workout.RepoHelper.create

      expected = {:unprocessable, "The request could not be processed.", [
        {:performed_exercises, "are still associated to this entry"}
      ]}
      assert {:error, expected} === Services.Exercise.delete(%{id: id})
    end
  end
end