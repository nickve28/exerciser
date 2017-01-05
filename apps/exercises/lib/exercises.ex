defmodule Exercises do
  @moduledoc false
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false
    # Define workers and child supervisors to be supervised
    children = [
      supervisor(Exercises.Repo, []),
      supervisor(Exercises.Pools.Exercise, []),
      supervisor(Exercises.Pools.Category, [])
    ]

    opts = [strategy: :one_for_one, name: Exercises.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
