ExUnit.start()

defmodule Workout.RepoHelper do
  alias Workout.Repo
  alias Workout.Schemas.{Workout}

  def create(data) do
    Repo.insert!(data)
  end

  def generate_workouts(x, user_id \\ 1) when is_number(x) do
    for number <- 1..x do
      {{y, m, _}, t} = :calendar.local_time
      new_date = Enum.random(1..28)
      %Workout{
          description: "Test workout ##{number}",
          workout_date: Ecto.DateTime.cast!({{y, m, new_date}, t}),
          user_id: user_id
      }
    end
  end
end