defmodule Workout.Services.WorkoutTest do
  use ExUnit.Case, async: false

  alias Workout.Schemas
  alias Workout.Services
  alias Workout.Repo
  alias Workout.RepoHelper

  setup do
    Repo.delete_all(Schemas.Workout)
    :ok
  end


  describe "#list pagination" do
    setup do
      workouts = RepoHelper.generate_workouts(12)
      |> Enum.map(&RepoHelper.create/1)

      {:ok, workouts: workouts}
    end

    test "#list should only return workouts for the user_id specified" do
      assert {:ok, exercises} = Services.Workout.list(%{user_id: 1})

      user_ids = Enum.map(exercises, fn %{user_id: user_id} -> user_id end) |> Enum.uniq
      assert user_ids === [1]
    end

    test "#list should only return 10 workouts" do
      assert {:ok, exercises} = Services.Workout.list(%{user_id: 1})

      assert Enum.count(exercises) === 10
    end

    test "#list should return the specified paginated amount when passed" do
      assert {:ok, exercises} = Services.Workout.list(%{user_id: 1, limit: 1})

      assert Enum.count(exercises) === 1
    end

    test "#list should sort by date descending" do
      assert {:ok, exercises} = Services.Workout.list(%{user_id: 1})
      dates = Enum.map(exercises, fn %{workout_date: date} -> Ecto.DateTime.cast!(date) end)
      assert Enum.reverse(Enum.sort_by(dates, fn x -> x end)) === dates
    end
  end
end
