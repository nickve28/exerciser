defmodule Workout.Services.WorkoutCountTest do
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

  describe "when no workouts exist for the user" do
    setup do
      datetime = Timex.to_datetime(:calendar.local_time)
      |> Timex.Ecto.DateTime.cast!

      %{id: exercise_id} = %Schemas.Exercise{name: "foo", categories: ["bar"], description: "baz", metric: "kg", type: "strength"}
      |> Exercise.RepoHelper.create_exercise

      workout = %Schemas.Workout{description: "Saturday workout",
        workout_date: datetime, user_id: 2, performed_exercises: [
          %{exercise_id: exercise_id, reps: 2, weight: 60.0}
        ]}
      |> RepoHelper.create
      {:ok, workout: workout}
    end

    @tag :count
    test "#count should return 0" do
      assert {:ok, 0} === Workout.Services.Workout.count(%{user_id: 1})
    end
  end

  describe "when exercises exist for the user" do
    setup do
      datetime = Timex.to_datetime(:calendar.local_time)
      |> Timex.Ecto.DateTime.cast!

      %{id: exercise_id} = %Schemas.Exercise{name: "foo", categories: ["bar"], description: "baz", metric: "kg", type: "strength"}
      |> Exercise.RepoHelper.create_exercise

      %{id: exercise_id2} = %Schemas.Exercise{name: "foo", categories: ["bar"], description: "baz", metric: "kg", type: "strength"}
      |> Exercise.RepoHelper.create_exercise

      workout = %Schemas.Workout{description: "Saturday workout",
        workout_date: datetime, user_id: 1, performed_exercises: [
          %{exercise_id: exercise_id, reps: 2, weight: 60.0}
        ]}
      |> RepoHelper.create

      %Schemas.Workout{description: "Saturday workout",
        workout_date: datetime, user_id: 1, performed_exercises: [
          %{exercise_id: exercise_id, reps: 2, weight: 60.0},
          %{exercise_id: exercise_id2, reps: 2, weight: 60.0}
        ]}
      |> RepoHelper.create
      {:ok, workout: workout}
    end

    @tag :count
    test "#count should return the amount of workouts of the user" do
      assert {:ok, 2} === Workout.Services.Workout.count(%{user_id: 1})
    end

    @tag :count
    test "#count should return 0 if the exercise id it not present in any workout", %{workout: %{performed_exercises: [%{exercise_id: id}]}} do
      assert {:ok, 0} === Workout.Services.Workout.count(%{user_id: 1, exercise_id: [id + 1337]})
    end

    @tag :count
    test "#count should return the amount of workouts that match the exercise_id filter", %{workout: %{performed_exercises: [%{exercise_id: id}]}} do
      assert {:ok, 2} === Workout.Services.Workout.count(%{user_id: 1, exercise_id: [id]})
    end
  end
end