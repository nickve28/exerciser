defmodule Workout do
  @moduledoc false
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      worker(Workout.Repo, []),
      supervisor(Workout.Pools.Exercise, []),
      supervisor(Workout.Pools.Category, []),
      supervisor(Workout.Pools.Workout, [])
    ]

    opts = [strategy: :one_for_one, name: Workout.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
