ExUnit.start()

defmodule Workout.RepoHelper do

  def create(workout) do
    Workout.Repo.insert!(workout)
  end

  def generate_workouts(x, user_id \\ 1) when is_number(x) do
    for number <- 1..x do
      {{y, m, _}, t} = :calendar.local_time
      new_date = Enum.random(1..28)
      %Workout.Schemas.Workout{
          description: "Test workout ##{number}",
          #workouts: Enum.take(1..10, Enum.random(1..10)),
          workout_date: Ecto.DateTime.cast!({{y, m, new_date}, t}),
          user_id: user_id
      }
    end
  end
end