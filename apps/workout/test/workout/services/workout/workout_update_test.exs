defmodule Workout.Services.WorkoutUpdateTest do
  use ExUnit.Case, async: false

  alias Workout.Schemas
  alias Workout.Services
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

  describe "#update" do
    setup do
      datetime = Timex.to_datetime(:calendar.local_time)
      |> Timex.Ecto.DateTime.cast!

      %{id: exercise_id} = %Schemas.Exercise{name: "foo", categories: ["bar"], description: "baz", metric: "kg", type: "strength"}
      |> Exercise.RepoHelper.create_exercise

      workout = %Schemas.Workout{description: "Saturday workout",
        workout_date: datetime, user_id: 1, performed_exercises: [
          %{exercise_id: exercise_id, reps: 2, weight: 60.0, sets: 2}
        ]}
      |> RepoHelper.create
      {:ok, workout: workout}
    end

    @tag :update
    test "#update should return :enotfound if no workout can be found", %{workout: %{id: id} = workout} do
      payload = workout
      |> Map.take([:id, :description, :workout_date, :performed_exercises])
      |> Map.merge(%{id: id + 1})

      assert {:error, {:enotfound, _, _}} = Services.Workout.update(payload)
    end

    @tag :update
    test "#update should fail if the workout_date update value is invalid", %{workout: workout} do
      payload = workout
      |> Map.take([:id, :description, :workout_date, :performed_exercises])
      |> Map.merge(%{workout_date: "foo"})

      assert {:error, {:invalid, "The data sent was invalid", [{:workout_date, _} | _]}} =
             Workout.Services.Workout.update(payload)
    end

    @tag :update
    test "#update should succeed if the workout_date update value is valid", %{workout: %{id: id} = workout} do
      payload = workout
      |> Map.take([:id, :description, :workout_date, :performed_exercises])
      |> Map.merge(%{workout_date: "2017-01-01"})

      assert {:ok, %{id: ^id, workout_date: "2017-01-01"}} = Workout.Services.Workout.update(payload)
    end

    @tag :update
    test "#update should succeed if the description update value is valid", %{workout: %{id: id} = workout} do
      payload = workout
      |> Map.take([:id, :description, :workout_date, :description, :performed_exercises])
      |> Map.merge(%{description: "foo", workout_date: "2017-01-01"})

      assert {:ok, %{id: ^id, description: "foo"}} = Workout.Services.Workout.update(payload)
      assert {:ok, %{description: "foo"}} = Workout.Services.Workout.get(%{id: id})
    end

    @tag :update
    test "#update should create the new associations and remove properly", %{workout: %{id: id} = workout} do
      %{id: exercise_id} = %Schemas.Exercise{name: "foo", categories: ["bar"], description: "baz", metric: "kg", type: "strength"}
      |> Exercise.RepoHelper.create_exercise

      payload = workout
      |> Map.take([:id, :description, :workout_date, :performed_exercises])
      |> Map.merge(%{workout_date: "2017-01-01", performed_exercises: [%{exercise_id: exercise_id, weight: 1.0, reps: 1, sets: 1}]})

     {:ok, %{performed_exercises: exercises}} = Workout.Services.Workout.update(payload)
     assert [%{exercise_id: ^exercise_id}] = exercises

     {:ok, %{performed_exercises: fetched_exercises}} = Workout.Services.Workout.get(%{id: id})
     assert [%{exercise_id: ^exercise_id}] = fetched_exercises
    end

    @tag :update
    test "#update should fail if one of the exercises does not exist", %{workout: workout} do
      payload = workout
      |> Map.take([:id, :description, :workout_date, :performed_exercises])
      |> Map.merge(%{workout_date: "2017-01-01", performed_exercises: [%{exercise_id: 0, weight: 1.0, reps: 1, sets: 1}]})

      assert {:error, {:invalid, "The data sent was invalid", [exercise_id: "Not found"]}} === Workout.Services.Workout.update(payload)
    end
  end
end