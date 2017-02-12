defmodule Progress do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      worker(Progress.Pools.Progress, [])
    ]

    opts = [strategy: :one_for_one, name: Progress]
    Supervisor.start_link(children, opts)
  end
end
