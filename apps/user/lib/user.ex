defmodule User do
  @moduledoc false
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      supervisor(User.Repo, []),
      supervisor(User.Pools.User, [])
    ]

    opts = [strategy: :one_for_one, name: User.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
