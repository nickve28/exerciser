defmodule Workout do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      worker(Workout.Repo, []),
      worker(Workout.Pools.Workout, [])
    ]

    opts = [strategy: :one_for_one, name: Workout.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
