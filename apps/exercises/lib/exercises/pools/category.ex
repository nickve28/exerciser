defmodule Exercises.Pools.Category do
  use Supervisor

  @pool_name :category_pool

  def start_link do
    Supervisor.start_link(__MODULE__, [], name: Exercises.Pools.Category)
  end

  def init([]) do
    pool_options = [
      name: {:local, @pool_name},
      worker_module: Exercises.Services.Category,
      size: 5,
      max_overflow: 10
    ]

    children = [
      :poolboy.child_spec(@pool_name, pool_options, [])
    ]

    supervise(children, strategy: :one_for_one)
  end
end