defmodule User.Pools.User do
  @moduledoc false
  use Supervisor

  @pool_name :user_pool

  def start_link do
    Supervisor.start_link(__MODULE__, [])
  end

  def init([]) do
    pool_options = [
      name: {:local, @pool_name},
      worker_module: User.Services.User,
      size: 10,
      max_overflow: 10
    ]

    children = [
      :poolboy.child_spec(@pool_name, pool_options, [])
    ]

    supervise(children, strategy: :one_for_one)
  end
end